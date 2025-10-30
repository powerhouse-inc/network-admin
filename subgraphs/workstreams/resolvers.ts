import { type Subgraph } from "@powerhousedao/reactor-api";
import { WorkstreamsProcessor } from "../../processors/workstreams/index.js"
import { Workstreams } from "processors/workstreams/schema.js";
import { type WorkstreamDocument } from "../../document-models/workstream/index.js";

export const getResolvers = (subgraph: Subgraph): Record<string, unknown> => {
  const reactor = subgraph.reactor;
  const db = subgraph.relationalDb

  return {
    Query: {
      workstreams: async (parent: unknown, args: { driveId: string }) => {
        const dbWorkstreams = await WorkstreamsProcessor.query(args.driveId, db)
          .selectFrom("workstreams")
          .selectAll()
          .execute();

          console.log("dbWorkstreams", dbWorkstreams);


        return dbWorkstreams.map((workstream) => ({
          network_phid: workstream.network_phid,
          network_slug: workstream.network_slug,
          workstream_phid: workstream.workstream_phid,
          workstream_slug: workstream.workstream_slug,
          workstream_title: workstream.workstream_title,
          workstream_status: workstream.workstream_status,
          sow_phid: workstream.sow_phid,
          roadmap_oid: workstream.roadmap_oid,
          final_milestone_target: workstream.final_milestone_target,
          initial_proposal_status: workstream.initial_proposal_status,
          initial_proposal_author: workstream.initial_proposal_author,
        }));
      },
      workstream: async (
        parent: unknown,
        args: { filter: { workstreamId?: string | null; workstreamSlug?: string | null; networkId?: string | null; networkSlug?: string | null; networkName?: string | null } },
      ) => {
        const { workstreamId, workstreamSlug, networkId, networkSlug, networkName } = args.filter;

        const candidateDrives: string[] = (await (async () => {
          try {
            const drives = await (reactor as any).getDrives?.();
            if (Array.isArray(drives) && drives.length > 0) return drives as string[];
          } catch {}
          return [] as string[];
        })());

        const deriveSlug = (name: string) => name.toLowerCase().trim().split(/\s+/).join("-");
        const wantedSlug = networkSlug || (networkName ? deriveSlug(networkName) : undefined);

        let resolved: any = null;
        for (const driveId of candidateDrives) {
          let qb = WorkstreamsProcessor.query(driveId, db)
            .selectFrom("workstreams")
            .selectAll();

          if (workstreamId) {
            qb = qb.where("workstream_phid", "=", workstreamId);
          } else if (workstreamSlug) {
            qb = qb.where("workstream_slug", "=", workstreamSlug);
          }

          if (networkId) {
            qb = qb.where("network_phid", "=", networkId);
          } else if (networkSlug) {
            qb = qb.where("network_slug", "=", networkSlug);
          } else if (networkName) {
            qb = qb.where("network_slug", "=", wantedSlug as string);
          }

          let row = await qb.executeTakeFirst();

          // No fallback scanning: DB is source of truth

          if (!row) continue;

          // Reuse the existing hydration flow below; capture in local scope
          const doc = await reactor.getDocument<WorkstreamDocument>(row.workstream_phid);
          const state = doc.state.global;

          const loadLinked = async (id?: string | null) => {
            if (!id) return null;
            try {
              const linked = await reactor.getDocument<any>(id);
              return { id, stateJSON: linked.state.global };
            } catch {
              return { id, stateJSON: null };
            }
          };

          const [topSowDoc, topPaymentTermsDoc] = await Promise.all([
            loadLinked(state.sow || row.sow_phid || null),
            loadLinked(state.paymentTerms || null),
          ]);

          const initialProposal = state.initialProposal
            ? {
                id: state.initialProposal.id,
                status: state.initialProposal.status,
                author: state.initialProposal.author,
                sow: null as any,
                paymentTerms: null as any,
              }
            : null;

          const [initialSowDoc, initialPaymentTermsDoc] = await Promise.all([
            loadLinked(state.initialProposal?.sow || row.sow_phid || null),
            loadLinked(state.initialProposal?.paymentTerms || null),
          ]);

          const altProposalsBase = (state.alternativeProposals || []).map((p: any) => ({
            id: p.id,
            status: p.status,
            author: p.author,
          }));

          const [altSowDocs, altPaymentDocs] = await Promise.all([
            Promise.all((state.alternativeProposals || []).map((p: any) => loadLinked(p.sow || null))),
            Promise.all((state.alternativeProposals || []).map((p: any) => loadLinked(p.paymentTerms || null))),
          ]);

          resolved = {
            code: state.code || null,
            title: state.title || row.workstream_title || null,
            status: state.status || row.workstream_status || null,
            client: state.client || (row.network_phid
              ? { id: row.network_phid, name: row.network_slug, icon: null }
              : null),
            rfp: state.rfp || null,
            initialProposal: initialProposal
              ? {
                  ...initialProposal,
                  sow: initialSowDoc?.stateJSON || null,
                  paymentTerms: initialPaymentTermsDoc?.stateJSON || null,
                }
              : null,
            alternativeProposals: altProposalsBase.map((p: any, i: number) => ({
              ...p,
              sow: altSowDocs[i]?.stateJSON || null,
              paymentTerms: altPaymentDocs[i]?.stateJSON || null,
            })),
            sow: topSowDoc?.stateJSON || null,
            paymentTerms: topPaymentTermsDoc?.stateJSON || null,
            paymentRequests: state.paymentRequests || [],
          };

          break;
        }

        return resolved;
      }
    },
    SOW_Progress: {
      __resolveType(obj: any) {
        if (obj && typeof obj === "object") {
          if (Object.prototype.hasOwnProperty.call(obj, "total") && Object.prototype.hasOwnProperty.call(obj, "completed")) {
            return "SOW_StoryPoint";
          }
          if (Object.prototype.hasOwnProperty.call(obj, "value")) {
            return "SOW_Percentage";
          }
          if (Object.prototype.hasOwnProperty.call(obj, "done")) {
            return "SOW_Binary";
          }
        }
        return null;
      }
    }
  };
};