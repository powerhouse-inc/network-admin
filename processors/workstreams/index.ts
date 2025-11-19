import { RelationalDbProcessor } from "document-drive";
import type { InternalTransmitterUpdate, InternalOperationUpdate, DeleteNodeAction, } from "document-drive";
import type { EditInitialProposalInput, EditClientInfoInput, EditWorkstreamInput } from "@powerhousedao/network-admin/document-models/workstream";
import { up } from "./migrations.js";
import type { DB } from "./schema.js";

export class WorkstreamsProcessor extends RelationalDbProcessor<DB> {
  static override getNamespace(driveId: string): string {
    // Default namespace: `${this.name}_${driveId.replaceAll("-", "_")}`
    return super.getNamespace(driveId);
  }

  workstreams: string[] = []

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

      // console.log("strand", { documentType: strand.documentType, docId: strand.documentId });

      for (const operation of strand.operations) {
        if (strand.documentType === "powerhouse/workstream") {
          this.updateWorkstream(strand, operation)
          this.updateNetworkInWorkstream(strand, operation)
          this.updateInitialProposalInWorkstream(strand, operation)
        }
        if (strand.documentType === "powerhouse/document-drive") {
          if(operation.action.type === "DELETE_NODE") {
            const castAction = operation.action as DeleteNodeAction;
            console.log("deleting workstream node", (castAction.input.id))
            const foundWorkstream = this.workstreams.find(ws => ws === castAction.input.id);
            if(foundWorkstream) {
              await this.relationalDb.deleteFrom("workstreams").where("workstream_phid", "=", foundWorkstream).execute();
            }
          }
        }
      }
    }
  }

  async onDisconnect() {
    // Clean up all workstreams for this drive's namespace when the drive is deleted
    // Since the database is already namespaced per drive, we delete all rows
    // This ensures no orphaned data remains after drive deletion
    try {
      await this.relationalDb
        .deleteFrom("workstreams")
        .execute();
      console.log(`Cleaned up workstreams for namespace: ${this.namespace}`);
    } catch (error) {
      console.error(`Error cleaning up workstreams for namespace ${this.namespace}:`, error);
      // Don't throw - cleanup errors shouldn't prevent drive deletion
    }
  }

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
      this.workstreams.push(docId)
      // insert network id
      await this.relationalDb
        .insertInto("workstreams")
        .values({
          network_phid: strand.state.client.id,
          network_slug: strand.state.client.name ? strand.state.client.name.toLowerCase().split(' ').join("-") : null,
          workstream_phid: strand.documentId,
          workstream_slug: strand.state.title ? strand.state.title.toLowerCase().split(' ').join("-") : "",
          workstream_title: strand.state.title,
          workstream_status: strand.state.status,
          sow_phid: strand.state.initialProposal ? strand.state.initialProposal.sow : null,
          // roadmap_oid: "which roadmmap Id ? there's many roadmaps in a sow doc",
          // final_milestone_target: new Date(),
          initial_proposal_status: strand.state.initialProposal ? strand.state.initialProposal.status : null,
          initial_proposal_author: strand.state.initialProposal ? strand.state.initialProposal.author.name : null
        })
        .onConflict((oc) => oc.column("workstream_phid").doNothing())
        .execute();
    }
  }

  updateInitialProposalInWorkstream = async (strand: InternalTransmitterUpdate, operation: InternalOperationUpdate) => {
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

        console.log('updating initial proposal in workstream', operation.action.input)

        // Build update object with only defined values
        const updateData: any = {};
        if (input.sowId) {
          updateData.sow_phid = input.sowId;
          updateData.initial_proposal_status = "DRAFT";
        }
        if (input.proposalAuthor) {
          updateData.initial_proposal_author = input.proposalAuthor.name;
          updateData.initial_proposal_status = "DRAFT";
        }
        if (input.status) {
          updateData.initial_proposal_status = input.status;
        }

        // Only execute update if there are fields to update
        if (Object.keys(updateData).length > 0) {
          await this.relationalDb
            .updateTable('workstreams')
            .set(updateData)
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

        console.log('updating client in workstream', operation.action.input)

        // Build update object with only defined values
        const updateData: any = {};
        if (input.clientId) {
          updateData.network_phid = input.clientId;
        }
        if (input.name) {
          updateData.network_slug = input.name.toLowerCase().split(' ').join("-");
        }

        // Only execute update if there are fields to update
        if (Object.keys(updateData).length > 0) {
          await this.relationalDb
            .updateTable('workstreams')
            .set(updateData)
            .where("workstream_phid", "=", docId)
            .execute();
        }

      }

    }
  }

  updateWorkstream = async (strand: InternalTransmitterUpdate, operation: InternalOperationUpdate) => {
    const docId = strand.documentId;
    const existingWorkstreamPhids = await this.relationalDb
      .selectFrom("workstreams")
      .select("workstream_phid")
      .where("workstream_phid", "=", docId)
      .execute();

    const [foundWorkstreamId] = existingWorkstreamPhids;

    if (foundWorkstreamId) {
      // update existing workstream row
      if (operation.action.type === 'EDIT_WORKSTREAM') {

        const input = operation.action.input as EditWorkstreamInput;
        if (!input) return;

        console.log('updating workstream', operation.action.input)

        // Build update object with only defined values
        const updateData: any = {};
        if (input.title) {
          updateData.workstream_title = input.title;
          updateData.workstream_slug = input.title.toLowerCase().split(' ').join("-");
        }
        if (input.status) {
          updateData.workstream_status = input.status;
        }

        // Only execute update if there are fields to update
        if (Object.keys(updateData).length > 0) {
          await this.relationalDb
            .updateTable('workstreams')
            .set(updateData)
            .where("workstream_phid", "=", docId)
            .execute();
        }

      }

    }
  }
}
