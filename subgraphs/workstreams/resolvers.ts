import { type Subgraph } from "@powerhousedao/reactor-api";
import { WorkstreamsProcessor } from "../../processors/workstreams/index.js"
import { Workstreams } from "processors/workstreams/schema.js";

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
      }
    }
  };
};