import { type IRelationalDb } from "document-drive/processors/types";
import { sql } from "kysely";

export async function up(db: IRelationalDb<any>): Promise<void> {
  // Create table with IF NOT EXISTS
  let tableCreated = false;
  await db.schema.dropTable("workstreams").ifExists().execute();
  try {
    await db.schema
      .createTable("workstreams")
      .addColumn('network_phid', 'varchar(255)')
      .addColumn('network_slug', 'varchar(255)')
      .addColumn("workstream_phid", "varchar(255)")
      .addColumn('workstream_slug', 'varchar(255)')
      .addColumn('workstream_title', 'varchar(255)')
      .addColumn('workstream_status', 'varchar(255)')
      .addColumn('sow_phid', 'varchar(255)')
      .addColumn('roadmap_oid', 'varchar(255)')
      .addColumn('final_milestone_target', 'timestamp')
      .addColumn('initial_proposal_status', 'varchar(255)')
      .addColumn('initial_proposal_author', 'varchar(255)')
      .addPrimaryKeyConstraint("workstreams_pkey", ["workstream_phid"])
      .ifNotExists()
      .execute();
    tableCreated = true;
  } catch (error) {
    // Table creation failed, might already exist or error occurred
    // Check if table exists before trying to add columns
  }

}

export async function down(db: IRelationalDb<any>): Promise<void> {
  // drop table
  await db.schema.dropTable("workstreams").execute();
}
