import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { supabaseAdmin } from '../src/config/supabase.js';

/**
 * Migration runner for Aqua Stark database
 * Executes SQL migration files in order
 */

const MIGRATIONS_DIR = join(process.cwd(), 'migrations');

async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');

  try {
    // Get all migration files
    const migrationFiles = readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Execute in alphabetical order

    console.log(`📁 Found ${migrationFiles.length} migration files:`);
    migrationFiles.forEach(file => console.log(`  - ${file}`));
    console.log('');

    // Create migrations tracking table if it doesn't exist
    await createMigrationsTable();

    // Execute each migration
    for (const file of migrationFiles) {
      await executeMigration(file);
    }

    console.log('✅ All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

async function createMigrationsTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      migration_name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const { error } = await supabaseAdmin.rpc('exec_sql', { sql: createTableSQL });
  
  if (error) {
    console.log('Note: Could not create migrations table (might already exist)');
  }
}

async function executeMigration(filename) {
  const filePath = join(MIGRATIONS_DIR, filename);
  const sql = readFileSync(filePath, 'utf8');

  console.log(`🔄 Executing: ${filename}`);

  try {
    // Check if migration was already executed
    const { data: existing } = await supabaseAdmin
      .from('schema_migrations')
      .select('migration_name')
      .eq('migration_name', filename)
      .single();

    if (existing) {
      console.log(`  ⏭️  Already executed: ${filename}`);
      return;
    }

    // Execute the migration
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql });

    if (error) {
      throw new Error(`SQL execution failed: ${error.message}`);
    }

    // Record the migration
    await supabaseAdmin
      .from('schema_migrations')
      .insert({ migration_name: filename });

    console.log(`  ✅ Completed: ${filename}`);
  } catch (error) {
    console.error(`  ❌ Failed: ${filename}`);
    console.error(`     Error: ${error.message}`);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export { runMigrations };
