import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    console.log('🔍 Checking database tables...');

    // Query to get all tables
    const { data, error } = await supabase.rpc('get_tables');

    if (error) {
      console.error('❌ Error getting tables:', error);

      // Try alternative approach
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (tablesError) {
        console.error('❌ Error with alternative approach:', tablesError);
        return;
      }

      console.log('📋 Tables in database:');
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    } else {
      console.log('📋 Tables in database:');
      data.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }

    // Check specifically for store-related tables
    console.log('\n🔍 Checking for store-related tables...');
    const storeTables = ['store_items', 'store_products', 'items', 'products'];

    for (const tableName of storeTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ Table ${tableName} does not exist`);
      } else {
        console.log(
          `✅ Table ${tableName} exists with ${data.length} sample records`
        );
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTables();
