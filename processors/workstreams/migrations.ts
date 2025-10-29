import { type IRelationalDb } from "document-drive/processors/types";
import { sql } from "kysely";

export async function up(db: IRelationalDb<any>): Promise<void> {
  // Create enum types first (without IF NOT EXISTS as it's not supported for CREATE TYPE)
  try {
    await sql`CREATE TYPE workstream_status AS ENUM ('RFP_DRAFT', 'PREWORK_RFC', 'RFP_CANCELLED', 'OPEN_FOR_PROPOSALS', 'PROPOSAL_SUBMITTED', 'NOT_AWARDED', 'AWARDED', 'IN_PROGRESS', 'FINISHED')`.execute(db);
  } catch (error) {
    // Type might already exist, ignore error
  }
  
  try {
    await sql`CREATE TYPE proposal_status AS ENUM ('DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED')`.execute(db);
  } catch (error) {
    // Type might already exist, ignore error
  }

  // Create table
  await db.schema
    .createTable("workstreams")
    .addColumn('network_phid', 'varchar(255)')
    .addColumn('network_slug', 'varchar(255)')
    .addColumn("workstream_phid", "varchar(255)")
    .addColumn('workstream_slug', 'varchar(255)')
    .addColumn('workstream_title', 'varchar(255)')
    .addColumn('workstream_status', sql`workstream_status`)
    .addColumn('sow_phid', 'varchar(255)')
    .addColumn('roadmap_oid', 'varchar(255)')
    .addColumn('final_milestone_target', 'timestamp')
    .addColumn('initial_proposal_status', sql`proposal_status`)
    .addColumn('initial_proposal_author', 'varchar(255)')
    .addPrimaryKeyConstraint("workstreams_pkey", ["workstream_phid"])
    .ifNotExists()
    .execute();
}

export async function down(db: IRelationalDb<any>): Promise<void> {
  // drop table
  await db.schema.dropTable("workstreams").execute();
  
  // drop enum types
  await sql`DROP TYPE IF EXISTS workstream_status`.execute(db);
  await sql`DROP TYPE IF EXISTS proposal_status`.execute(db);
}
