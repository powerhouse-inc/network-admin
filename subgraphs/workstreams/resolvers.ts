import { type ISubgraph } from "@powerhousedao/reactor-api";
import { WorkstreamsProcessor } from "../../processors/workstreams/index.js";
import {
  type RequestForProposalsDocument,
} from "../../document-models/request-for-proposals/index.js";
import { type WorkstreamDocument } from "../../document-models/workstream/index.js";

type WorkstreamFilterArgs = {
  workstreamId?: string | null;
  workstreamSlug?: string | null;
  networkId?: string | null;
  networkSlug?: string | null;
  networkName?: string | null;
  workstreamStatus?: string | null;
  workstreamStatuses?: (string | null)[] | null;
};

type WorkstreamsFilterArgs = {
  networkId?: string | null;
  networkSlug?: string | null;
  networkName?: string | null;
  workstreamStatus?: string | null;
  workstreamStatuses?: (string | null)[] | null;
};

type ScopeOfWorkFilterArgs = {
  networkId?: string | null;
  networkSlug?: string | null;
  networkName?: string | null;
  workstreamId?: string | null;
  workstreamSlug?: string | null;
  workstreamStatus?: string | null;
  proposalRole?: string | null;
};

export const getResolvers = (subgraph: ISubgraph): Record<string, unknown> => {
  const reactor = subgraph.reactor;
  const db = subgraph.relationalDb

  const deriveSlug = (name: string) =>
    name.toLowerCase().trim().split(/\s+/).join("-");

  const getCandidateDrives = async (): Promise<string[]> => {
    try {
      const drives = await (reactor as any).getDrives?.();
      if (Array.isArray(drives) && drives.length > 0) return drives as string[];
    } catch { }
    return [] as string[];
  };

  const loadLinkedDocument = async (id?: string | null) => {
    if (!id) return null;
    try {
      const linked = await reactor.getDocument<any>(id);
      return { id, stateJSON: linked.state.global };
    } catch {
      return { id, stateJSON: null };
    }
  };

  const loadRfpDetails = async (
    rfpRef?: { id?: string | null; title?: string | null } | null,
  ) => {
    if (!rfpRef?.id) {
      return null;
    }

    try {
      const rfpDoc =
        await reactor.getDocument<RequestForProposalsDocument>(rfpRef.id);
      const rfpState = rfpDoc.state.global as any;

      return {
        id: rfpRef.id,
        code: rfpState?.code ?? null,
        title: rfpRef.title ?? rfpState?.title ?? null,
        status: rfpState?.status ?? null,
        summary: rfpState?.summary ?? null,
        submissionDeadline: rfpState?.deadline ?? null,
        budgetMin: rfpState?.budgetRange?.min ?? null,
        budgetMax: rfpState?.budgetRange?.max ?? null,
        budgetCurrency: rfpState?.budgetRange?.currency ?? null,
        eligibilityCriteria: rfpState?.eligibilityCriteria ?? null,
        evaluationCriteria: rfpState?.evaluationCriteria ?? null,
        briefing: rfpState?.briefing ?? null,
      };
    } catch {
      return {
        id: rfpRef.id,
        code: null,
        title: rfpRef.title ?? null,
        status: null,
        summary: null,
        submissionDeadline: null,
        budgetMin: null,
        budgetMax: null,
        budgetCurrency: null,
        eligibilityCriteria: null,
        evaluationCriteria: null,
        briefing: null,
      };
    }
  };

  const hydrateWorkstreamRow = async (row: any) => {
    try {
      const doc = await reactor.getDocument<WorkstreamDocument>(
        row.workstream_phid,
      );
      const state = doc.state.global as any;

      const initialProposalBase = state.initialProposal
        ? {
          id: state.initialProposal.id,
          status: state.initialProposal.status,
          author: state.initialProposal.author,
        }
        : null;

      const alternativeProposalsBase = (state.alternativeProposals || []).map(
        (p: any) => ({
          id: p.id,
          status: p.status,
          author: p.author,
        }),
      );

      const [
        topSowDoc,
        topPaymentTermsDoc,
        initialSowDoc,
        initialPaymentTermsDoc,
        altSowDocs,
        altPaymentDocs,
        rfpDetails,
      ] = await Promise.all([
        loadLinkedDocument(state.sow || row.sow_phid || null),
        loadLinkedDocument(state.paymentTerms || null),
        loadLinkedDocument(state.initialProposal?.sow || row.sow_phid || null),
        loadLinkedDocument(state.initialProposal?.paymentTerms || null),
        Promise.all(
          (state.alternativeProposals || []).map((p: any) =>
            loadLinkedDocument(p.sow || null),
          ),
        ),
        Promise.all(
          (state.alternativeProposals || []).map((p: any) =>
            loadLinkedDocument(p.paymentTerms || null),
          ),
        ),
        loadRfpDetails(state.rfp || null),
      ]);

      const client =
        state.client ??
        (row.network_phid
          ? { id: row.network_phid, name: row.network_slug, icon: null }
          : null);

      return {
        code: state.code || null,
        title: state.title || row.workstream_title || null,
        status: state.status || row.workstream_status || null,
        client,
        rfp: rfpDetails,
        initialProposal: initialProposalBase
          ? {
            ...initialProposalBase,
            sow: initialSowDoc?.stateJSON || null,
            paymentTerms: initialPaymentTermsDoc?.stateJSON || null,
          }
          : null,
        alternativeProposals: alternativeProposalsBase.map(
          (proposal: any, index: number) => ({
            ...proposal,
            sow: altSowDocs[index]?.stateJSON || null,
            paymentTerms: altPaymentDocs[index]?.stateJSON || null,
          }),
        ),
        sow: topSowDoc?.stateJSON || null,
        paymentTerms: topPaymentTermsDoc?.stateJSON || null,
        paymentRequests: state.paymentRequests || [],
      };
    } catch {
      return {
        code: row.workstream_title || null,
        title: row.workstream_title || null,
        status: row.workstream_status || null,
        client: row.network_phid
          ? { id: row.network_phid, name: row.network_slug, icon: null }
          : null,
        rfp: null,
        initialProposal: null,
        alternativeProposals: [],
        sow: null,
        paymentTerms: null,
        paymentRequests: [],
      };
    }
  };

  const applyWorkstreamFilters = (
    qb: any,
    filters: WorkstreamFilterArgs,
    wantedSlug?: string,
  ) => {
    if (filters.workstreamId) {
      qb = qb.where("workstream_phid", "=", filters.workstreamId);
    } else if (filters.workstreamSlug) {
      qb = qb.where("workstream_slug", "=", filters.workstreamSlug);
    }

    if (filters.networkId) {
      qb = qb.where("network_phid", "=", filters.networkId);
    } else if (filters.networkSlug) {
      qb = qb.where("network_slug", "=", filters.networkSlug);
    } else if (filters.networkName && wantedSlug) {
      qb = qb.where("network_slug", "=", wantedSlug);
    }

    const statuses = (filters.workstreamStatuses || []).filter(
      (status): status is string => Boolean(status),
    );

    if (statuses.length > 0) {
      qb = qb.where("workstream_status", "in", statuses as any);
    } else if (filters.workstreamStatus) {
      qb = qb.where("workstream_status", "=", filters.workstreamStatus);
    }

    return qb;
  };

  const applyScopeOfWorkFilters = (
    qb: any,
    filters: ScopeOfWorkFilterArgs,
    wantedSlug?: string,
  ) => {
    if (filters.workstreamId) {
      qb = qb.where("workstream_phid", "=", filters.workstreamId);
    } else if (filters.workstreamSlug) {
      qb = qb.where("workstream_slug", "=", filters.workstreamSlug);
    }

    if (filters.networkId) {
      qb = qb.where("network_phid", "=", filters.networkId);
    } else if (filters.networkSlug) {
      qb = qb.where("network_slug", "=", filters.networkSlug);
    } else if (filters.networkName && wantedSlug) {
      qb = qb.where("network_slug", "=", wantedSlug);
    }

    if (filters.workstreamStatus) {
      qb = qb.where("workstream_status", "=", filters.workstreamStatus);
    }

    return qb;
  };

  return {
    Query: {
      processorWorkstreams: async (parent: unknown, args: {}) => {
        const drives = await getCandidateDrives();
        const allProcessorWorkstreams = await Promise.all(
          drives.map(async (driveId) => {
            return WorkstreamsProcessor.query(driveId, db)
              .selectFrom("workstreams")
              .selectAll()
              .execute();
          }),
        );

        // Flatten the array of arrays into a single array
        const flattenedWorkstreams = allProcessorWorkstreams.flat();

        return flattenedWorkstreams.map((workstream: any) => ({
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
        args: { filter: WorkstreamFilterArgs },
      ) => {
        const filters = args.filter || {};
        const candidateDrives = await getCandidateDrives();
        const wantedSlug =
          filters.networkSlug ||
          (filters.networkName ? deriveSlug(filters.networkName) : undefined);

        let resolved: any = null;
        for (const driveId of candidateDrives) {
          let qb = WorkstreamsProcessor.query(driveId, db)
            .selectFrom("workstreams")
            .selectAll();

          qb = applyWorkstreamFilters(qb, filters, wantedSlug);

          const row = await qb.executeTakeFirst();

          if (!row) continue;

          resolved = await hydrateWorkstreamRow(row);
          break;
        }

        return resolved;
      },
      workstreams: async (
        parent: unknown,
        args: { filter?: WorkstreamsFilterArgs },
      ) => {
        const filters = args.filter || {};
        const candidateDrives = await getCandidateDrives();
        
        // Check if any filters are provided
        const hasFilters =
          filters.networkId ||
          filters.networkSlug ||
          filters.networkName ||
          filters.workstreamStatus ||
          (filters.workstreamStatuses &&
            filters.workstreamStatuses.length > 0);

        const wantedSlug =
          filters.networkSlug ||
          (filters.networkName ? deriveSlug(filters.networkName) : undefined);

        const results: any[] = [];

        for (const driveId of candidateDrives) {
          let qb = WorkstreamsProcessor.query(driveId, db)
            .selectFrom("workstreams")
            .selectAll();

          // Only apply filters if any are provided
          if (hasFilters) {
            const filterArgs: WorkstreamFilterArgs = {
              networkId: filters.networkId,
              networkSlug: filters.networkSlug,
              networkName: filters.networkName,
              workstreamStatus: filters.workstreamStatus,
              workstreamStatuses: filters.workstreamStatuses,
            };
            qb = applyWorkstreamFilters(qb, filterArgs, wantedSlug);
          }

          const rows = await qb.execute();
          if (rows.length === 0) {
            continue;
          }

          for (const row of rows) {
            const hydrated = await hydrateWorkstreamRow(row);
            results.push(hydrated);
          }
        }

        return results;
      },
      rfpByWorkstream: async (
        parent: unknown,
        args: { filter: WorkstreamFilterArgs },
      ) => {
        const filters = args.filter || {};
        const candidateDrives = await getCandidateDrives();
        const wantedSlug =
          filters.networkSlug ||
          (filters.networkName ? deriveSlug(filters.networkName) : undefined);

        const results: any[] = [];

        for (const driveId of candidateDrives) {
          let qb = WorkstreamsProcessor.query(driveId, db)
            .selectFrom("workstreams")
            .selectAll();

          qb = applyWorkstreamFilters(qb, filters, wantedSlug);

          const rows = await qb.execute();
          if (rows.length === 0) {
            continue;
          }

          for (const row of rows) {
            const hydrated = await hydrateWorkstreamRow(row);
            results.push({
              code: hydrated.code,
              title: hydrated.title,
              status: hydrated.status,
              rfp: hydrated.rfp,
            });
          }

          if (filters.workstreamId || filters.workstreamSlug) {
            break;
          }
        }

        return results;
      },
      scopeOfWorkByNetworkOrStatus: async (
        parent: unknown,
        args: { filter: ScopeOfWorkFilterArgs },
      ) => {
        const filters = args.filter || {};
        const candidateDrives = await getCandidateDrives();
        const wantedSlug =
          filters.networkSlug ||
          (filters.networkName ? deriveSlug(filters.networkName) : undefined);

        const results: any[] = [];

        for (const driveId of candidateDrives) {
          let qb = WorkstreamsProcessor.query(driveId, db)
            .selectFrom("workstreams")
            .selectAll();

          qb = applyScopeOfWorkFilters(qb, filters, wantedSlug);

          const rows = await qb.execute();
          if (rows.length === 0) {
            continue;
          }

          for (const row of rows) {
            const hydrated = await hydrateWorkstreamRow(row);

            // Collect SOWs based on proposalRole filter
            const sowDocs: any[] = [];

            if (!filters.proposalRole) {
              // If no proposalRole specified, include all SOWs
              if (hydrated.sow) {
                sowDocs.push(hydrated.sow);
              }
              if (hydrated.initialProposal?.sow) {
                sowDocs.push(hydrated.initialProposal.sow);
              }
              for (const altProposal of hydrated.alternativeProposals || []) {
                if (altProposal.sow) {
                  sowDocs.push(altProposal.sow);
                }
              }
            } else if (filters.proposalRole === "INITIAL") {
              if (hydrated.initialProposal?.sow) {
                sowDocs.push(hydrated.initialProposal.sow);
              }
            } else if (filters.proposalRole === "ALTERNATIVE") {
              for (const altProposal of hydrated.alternativeProposals || []) {
                if (altProposal.sow) {
                  sowDocs.push(altProposal.sow);
                }
              }
            } else if (filters.proposalRole === "AWARDED") {
              // For AWARDED, we check if the workstream status is AWARDED
              // and return the initial proposal's SOW (as it's typically the awarded one)
              if (hydrated.status === "AWARDED" && hydrated.initialProposal?.sow) {
                sowDocs.push(hydrated.initialProposal.sow);
              }
            }

            // Filter out null/undefined SOWs and add to results
            for (const sow of sowDocs) {
              if (sow) {
                results.push(sow);
              }
            }
          }

          if (filters.workstreamId || filters.workstreamSlug) {
            break;
          }
        }

        return results;
      },
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