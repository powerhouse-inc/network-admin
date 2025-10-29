import { type IRelationalDb } from "document-drive/processors/types";
import { RelationalDbProcessor } from "document-drive/processors/relational";
import { type InternalTransmitterUpdate } from "document-drive/server/listener/transmitter/internal";
import { up } from "./migrations.js";
import { type DB } from "./schema.js";

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

      console.log("strand", strand);

      for (const operation of strand.operations) {
        await this.relationalDb
          .insertInto("workstreams")
          .values({
            workstream_phid: strand.documentId,
            workstream_slug: strand.documentId.split("-")[1],
            workstream_title: strand.documentId.split("-")[2],
            workstream_status: "RFP_DRAFT",
            sow_phid: strand.documentId.split("-")[3],
            roadmap_oid: strand.documentId.split("-")[4],
            final_milestone_target: new Date(),
          })
          .onConflict((oc) => oc.column("workstream_phid").doNothing())
          .execute();
      }
    }
  }

  async onDisconnect() {}
}
