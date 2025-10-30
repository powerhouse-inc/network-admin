import { type IRelationalDb } from "document-drive/processors/types";
import { RelationalDbProcessor } from "document-drive/processors/relational";
import { type InternalTransmitterUpdate, type InternalOperationUpdate } from "document-drive/server/listener/transmitter/internal";
import { up } from "./migrations.js";
import { type DB } from "./schema.js";
import { EditInitialProposalInput, EditClientInfoInput } from "document-models/workstream/index.js";

export class WorkstreamsProcessor extends RelationalDbProcessor<DB> {
  static override getNamespace(driveId: string): string {
    // Default namespace: `${this.name}_${driveId.replaceAll("-", "_")}`
    return super.getNamespace(driveId);
  }

  override async initAndUpgrade(): Promise<void> {
    await up(this.relationalDb);
  }

  override async onStrands(
    strands: InternalTransmitterUpdate[],
  ): Promise<void> {
    if (strands.length === 0) {
      return;
    }

    for (const strand of strands) {
      if (strand.operations.length === 0) {
        continue;
      }

      if (strand.documentType === "powerhouse/workstream") {
        this.setWorkstream(strand)
      }
      // console.log("strand", { documentType: strand.documentType, docId: strand.documentId, state: strand.state });

      for (const operation of strand.operations) {

        if (strand.documentType === "powerhouse/workstream") {
          this.addSowToWorkstream(strand, operation)
          this.updateNetworkInWorkstream(strand, operation)
        }

        // await this.relationalDb
        //   .insertInto("workstreams")
        //   .values({
        //     workstream_phid: strand.documentId,
        //     workstream_slug: strand.documentId.split("-")[1],
        //     workstream_title: strand.documentId.split("-")[2],
        //     workstream_status: "RFP_DRAFT",
        //     sow_phid: strand.documentId.split("-")[3],
        //     roadmap_oid: strand.documentId.split("-")[4],
        //     final_milestone_target: new Date(),
        //   })
        //   .onConflict((oc) => oc.column("workstream_phid").doNothing())
        //   .execute();
      }
    }
  }

  async onDisconnect() { }

  setWorkstream = async (strand: InternalTransmitterUpdate) => {
    const docId = strand.documentId;
    const existingWorkstreamPhids = await this.relationalDb
      .selectFrom("workstreams")
      .select("workstream_phid")
      .where("workstream_phid", "=", docId)
      .execute();

    console.log("existingWorkstreamPhids", existingWorkstreamPhids)
    if (existingWorkstreamPhids.length === 0) {
      console.log('No workstream id found, inserting new one', docId)
      // insert network id
      await this.relationalDb
        .insertInto("workstreams")
        .values({
          // network_phid: strand.state.client.id,
          // network_slug: strand.state.client.name.toLowerCase().split(' ').join("-"),
          workstream_phid: strand.documentId,
          workstream_slug: strand.state.title.toLowerCase().split(' ').join("-"),
          workstream_title: strand.state.title,
          workstream_status: strand.state.status,
          // sow_phid: strand.state.sow,
          roadmap_oid: "which roadmmap Id ? there's many roadmaps in a sow doc",
          final_milestone_target: new Date(),
          // initial_proposal_status: strand.state.initialProposal.status,
          // initial_proposal_author: strand.state.initialProposal.author.name
        })
        .onConflict((oc) => oc.column("workstream_phid").doNothing())
        .execute();
    }
  }

  addSowToWorkstream = async (strand: InternalTransmitterUpdate, operation: InternalOperationUpdate) => {
    const docId = strand.documentId;
    const existingWorkstreamPhids = await this.relationalDb
      .selectFrom("workstreams")
      .select("workstream_phid")
      .where("workstream_phid", "=", docId)
      .execute();

    const [foundWorkstreamId] = existingWorkstreamPhids;

    if (foundWorkstreamId) {
      // update existing workstream row
      if (operation.action.type === 'EDIT_INITIAL_PROPOSAL') {

        const input = operation.action.input as EditInitialProposalInput;
        if (!input) return;
        if (Object.hasOwn(input, 'sowId') || Object.hasOwn(input, "status")) {

          console.log('updating sowId in workstream', operation.action.input)
          await this.relationalDb
            .updateTable('workstreams')
            .set({
              sow_phid: input.sowId,
              initial_proposal_author: strand.state.initialProposal.author.name,
              initial_proposal_status: strand.state.initialProposal.status
            })
            .where("workstream_phid", "=", docId)
            .execute();
        }

      }

    }
  }

  updateNetworkInWorkstream = async (strand: InternalTransmitterUpdate, operation: InternalOperationUpdate) => {
    const docId = strand.documentId;
    const existingWorkstreamPhids = await this.relationalDb
      .selectFrom("workstreams")
      .select("workstream_phid")
      .where("workstream_phid", "=", docId)
      .execute();

    const [foundWorkstreamId] = existingWorkstreamPhids;

    if (foundWorkstreamId) {
      // update existing workstream row
      if (operation.action.type === 'EDIT_CLIENT_INFO') {

        const input = operation.action.input as EditClientInfoInput;
        if (!input) return;
        if (Object.hasOwn(input, 'clientId')) {

          console.log('updating client in workstream', operation.action.input)
          await this.relationalDb
            .updateTable('workstreams')
            .set({
              network_phid: input.clientId,
              network_slug: input.name && input.name.toLowerCase().split(' ').join("-"),
            })
            .where("workstream_phid", "=", docId)
            .execute();
        }

      }

    }
  }
}
