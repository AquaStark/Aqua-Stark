import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
  try {
    console.log('🔍 Checking Supabase Storage...');

    // List buckets
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
      return;
    }

    console.log('📦 Available buckets:');
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.name} (public: ${bucket.public})`);
    });

    // Check if store-items bucket exists
    const storeItemsBucket = buckets.find(b => b.name === 'store-items');

    if (!storeItemsBucket) {
      console.log('❌ store-items bucket not found');
      return;
    }

    console.log('✅ store-items bucket found');
    console.log(`   Public: ${storeItemsBucket.public}`);

    // List files in store-items bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('store-items')
      .list('', { limit: 100 });

    if (filesError) {
      console.error('❌ Error listing files:', filesError);
      return;
    }

    console.log('📁 Files in store-items bucket:');
    files.forEach(file => {
      console.log(
        `  - ${file.name} (${file.metadata?.size || 'unknown size'})`
      );
    });

    // Check fish folder specifically
    const { data: fishFiles, error: fishError } = await supabase.storage
      .from('store-items')
      .list('fish', { limit: 100 });

    if (fishError) {
      console.error('❌ Error listing fish files:', fishError);
    } else {
      console.log('🐟 Fish files:');
      fishFiles.forEach(file => {
        console.log(
          `  - ${file.name} (${file.metadata?.size || 'unknown size'})`
        );
      });
    }

    // Test a specific image URL
    const testUrl =
      'https://jbgmltqjwurfmhqywhct.supabase.co/storage/v1/object/public/store-items/fish/goldfish.webp';
    console.log(`\n🔗 Testing URL: ${testUrl}`);

    try {
      const response = await fetch(testUrl);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      if (response.ok) {
        console.log('   ✅ Image is accessible');
      } else {
        console.log('   ❌ Image is not accessible');
      }
    } catch (error) {
      console.log('   ❌ Error fetching image:', error.message);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkStorage();
