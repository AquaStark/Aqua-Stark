#!/usr/bin/env node

/**
 * Run Store Migrations
 * Executes the store system migrations for Aqua Stark
 *
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-01-XX
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend directory
const envPath = join(__dirname, '..', '.env');
config({ path: envPath });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Read and execute SQL migration file
 */
async function runMigration(migrationFile) {
  try {
    console.log(`📄 Reading migration: ${migrationFile}`);

    const migrationPath = join(
      __dirname,
      '..',
      'supabase',
      'migrations',
      migrationFile
    );
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log(`🚀 Executing migration: ${migrationFile}`);

    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL,
    });

    if (error) {
      console.error(
        `❌ Error executing migration ${migrationFile}:`,
        error.message
      );
      return false;
    }

    console.log(`✅ Migration ${migrationFile} executed successfully`);
    return true;
  } catch (error) {
    console.error(
      `❌ Error reading migration ${migrationFile}:`,
      error.message
    );
    return false;
  }
}

/**
 * Run all store migrations
 */
async function runStoreMigrations() {
  try {
    console.log('🏪 Running Aqua Stark Store Migrations...\n');

    const migrations = [
      '005_create_store_system.sql',
      '006_store_items_seeds.sql',
    ];

    let successCount = 0;
    let failureCount = 0;

    for (const migration of migrations) {
      const success = await runMigration(migration);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
      console.log(''); // Add spacing between migrations
    }

    console.log('📊 Migration Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failureCount}`);
    console.log(`   📁 Total: ${migrations.length}`);

    if (failureCount === 0) {
      console.log('\n🎉 All store migrations completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('   1. Run: node scripts/setup-store-storage.js');
      console.log('   2. Upload item images to Supabase Storage');
      console.log('   3. Update image URLs in the database');
      console.log('   4. Test the store API endpoints');
    } else {
      console.log(
        '\n⚠️  Some migrations failed. Please check the errors above.'
      );
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Aqua Stark Store Migration Runner');
  console.log('====================================\n');

  await runStoreMigrations();

  console.log('\n✨ Migration process complete!');
}

// Run the migrations
main().catch(console.error);
