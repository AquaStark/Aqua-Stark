import { supabaseAdmin } from '../src/config/supabase.js';

/**
 * Manual migration using Supabase API
 */

async function manualMigrate() {
  console.log('🚀 Checking database status...\n');

  try {
    // Test connection
    console.log('🔗 Testing connection...');

    const { data, error } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', '%dynamic%');

    if (error) {
      console.log('❌ Connection failed:', error.message);
      return;
    }

    console.log('✅ Connection successful!');
    console.log('📋 Found tables:', data?.map(t => t.table_name) || []);
    console.log('');

    // Create tables using simple operations
    console.log('📋 Creating tables...\n');

    // 1. Test if we can create a simple table
    console.log('1️⃣ Testing table creation...');

    // Try to insert a test record to see if tables exist
    const { error: testError } = await supabaseAdmin
      .from('fish_dynamic_states')
      .select('fish_id')
      .limit(1);

    if (
      testError &&
      testError.message.includes(
        'relation "fish_dynamic_states" does not exist'
      )
    ) {
      console.log('   📝 Tables need to be created manually in Supabase');
      console.log('\n💡 Please follow these steps:');
      console.log('1. Go to your Supabase Dashboard');
      console.log('2. Go to SQL Editor');
      console.log(
        '3. Copy and paste the SQL from supabase/migrations/001_initial_schema.sql'
      );
      console.log('4. Execute the SQL');
    } else {
      console.log('   ✅ Tables already exist!');
    }

    console.log('\n🎉 Migration check completed!');
    console.log('\n📋 Next steps:');
    console.log("1. If tables don't exist, create them manually in Supabase");
    console.log('2. Run the backend server: pnpm dev');
    console.log('3. Test the API endpoints');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  manualMigrate();
}

export { manualMigrate };
