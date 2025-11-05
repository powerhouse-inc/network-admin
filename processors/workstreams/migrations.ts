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

  // Create table with IF NOT EXISTS
  let tableCreated = false;
  try {
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
    tableCreated = true;
  } catch (error) {
    // Table creation failed, might already exist or error occurred
    // Check if table exists before trying to add columns
  }

  // Check if table exists before trying to add columns
  let tableExists = false;
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'workstreams'
      )
    `.execute(db);
    tableExists = (result as any).rows?.[0]?.exists === true || (result as any)[0]?.exists === true;
  } catch (error) {
    // If we can't check, assume table doesn't exist
    tableExists = false;
  }

  // Only try to add columns if table exists and wasn't just created
  if (tableExists && !tableCreated) {
    // Add missing columns if table already existed (migration upgrade path)
    // Use try-catch since PostgreSQL doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
    const addColumnIfNotExists = async (columnName: string, columnDef: string | any) => {
      try {
        if (typeof columnDef === 'string') {
          await db.schema.alterTable("workstreams").addColumn(columnName, columnDef as any).execute();
        } else {
          // For enum types (sql template), use ALTER TABLE with raw SQL
          if (columnName === 'workstream_status') {
            await sql`ALTER TABLE workstreams ADD COLUMN workstream_status workstream_status`.execute(db);
          } else if (columnName === 'initial_proposal_status') {
            await sql`ALTER TABLE workstreams ADD COLUMN initial_proposal_status proposal_status`.execute(db);
          }
        }
      } catch (error: any) {
        // Column already exists (error code 42701) - ignore
        // Table doesn't exist (error code 42P01) - ignore (shouldn't happen but handle gracefully)
        if (error?.code !== '42701' && error?.code !== '42P16' && error?.code !== '42P01') {
          console.warn(`Error adding column ${columnName}:`, error?.message || error);
        }
      }
    };

    await addColumnIfNotExists('network_phid', 'varchar(255)');
    await addColumnIfNotExists('network_slug', 'varchar(255)');
    await addColumnIfNotExists('workstream_phid', 'varchar(255)');
    await addColumnIfNotExists('workstream_slug', 'varchar(255)');
    await addColumnIfNotExists('workstream_title', 'varchar(255)');
    await addColumnIfNotExists('workstream_status', sql`workstream_status`);
    await addColumnIfNotExists('sow_phid', 'varchar(255)');
    await addColumnIfNotExists('roadmap_oid', 'varchar(255)');
    await addColumnIfNotExists('final_milestone_target', 'timestamp');
    await addColumnIfNotExists('initial_proposal_status', sql`proposal_status`);
    await addColumnIfNotExists('initial_proposal_author', 'varchar(255)');
  }
}

export async function down(db: IRelationalDb<any>): Promise<void> {
  // drop table
  await db.schema.dropTable("workstreams").execute();
  
  // drop enum types
  await sql`DROP TYPE IF EXISTS workstream_status`.execute(db);
  await sql`DROP TYPE IF EXISTS proposal_status`.execute(db);
}
