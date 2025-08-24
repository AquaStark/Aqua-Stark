import { readFileSync } from 'fs';
import { join } from 'path';
import { supabaseAdmin } from '../src/config/supabase.js';

/**
 * Simple migration runner that executes SQL directly
 */

const MIGRATION_FILE = join(
  process.cwd(),
  'migrations',
  '001_initial_schema.sql'
);

async function runSimpleMigration() {
  console.log('🚀 Starting simple database migration...\n');

  try {
    // Read the migration file
    const sql = readFileSync(MIGRATION_FILE, 'utf8');
    console.log('📁 Migration file loaded successfully');
    console.log('📝 SQL content length:', sql.length, 'characters\n');

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`🔧 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`🔄 Executing statement ${i + 1}/${statements.length}`);
        console.log(`   ${statement.substring(0, 50)}...`);

        try {
          // Use raw SQL execution
          const { error } = await supabaseAdmin.rpc('exec_sql', {
            sql: statement + ';',
          });

          if (error) {
            console.log(`   ⚠️  Warning: ${error.message}`);
          } else {
            console.log(`   ✅ Success`);
          }
        } catch (err) {
          console.log(`   ❌ Error: ${err.message}`);
        }
      }
    }

    console.log('\n✅ Migration completed!');
    console.log('\n📋 Next steps:');
    console.log(
      '1. Check your Supabase dashboard to verify tables were created'
    );
    console.log('2. Run the backend server: pnpm dev');
    console.log('3. Test the API endpoints');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log(
      '\n💡 Alternative: Copy the SQL from migrations/001_initial_schema.sql'
    );
    console.log('   and paste it directly in your Supabase SQL Editor');
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSimpleMigration();
}

export { runSimpleMigration };
