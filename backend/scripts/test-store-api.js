#!/usr/bin/env node

/**
 * Test Store API
 * Script para probar todos los endpoints de la API de tienda
 * 
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-01-XX
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend directory
const envPath = join(__dirname, '..', '.env');
config({ path: envPath });

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001/api/v1';

/**
 * Make HTTP request
 */
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    const data = await response.json();
    
    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
    };
  }
}

/**
 * Test all store API endpoints
 */
async function testStoreAPI() {
  console.log('🧪 Testing Aqua Stark Store API');
  console.log('================================\n');

  const tests = [
    {
      name: 'GET /store/items - Get all items',
      endpoint: '/store/items',
      method: 'GET',
    },
    {
      name: 'GET /store/items - Filter by type (fish)',
      endpoint: '/store/items?type=fish',
      method: 'GET',
    },
    {
      name: 'GET /store/items - Search for "goldfish"',
      endpoint: '/store/items?search=goldfish',
      method: 'GET',
    },
    {
      name: 'GET /store/items - Price range filter',
      endpoint: '/store/items?minPrice=10&maxPrice=50',
      method: 'GET',
    },
    {
      name: 'GET /store/items - Limit results',
      endpoint: '/store/items?limit=5',
      method: 'GET',
    },
    {
      name: 'GET /store/items/stats - Get store statistics',
      endpoint: '/store/items/stats',
      method: 'GET',
    },
    {
      name: 'GET /store/items/type/fish - Get fish items',
      endpoint: '/store/items/type/fish',
      method: 'GET',
    },
    {
      name: 'GET /store/items/type/decoration - Get decoration items',
      endpoint: '/store/items/type/decoration',
      method: 'GET',
    },
    {
      name: 'GET /store/items/type/food - Get food items',
      endpoint: '/store/items/type/food',
      method: 'GET',
    },
    {
      name: 'GET /store/items/type/other - Get other items',
      endpoint: '/store/items/type/other',
      method: 'GET',
    },
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const test of tests) {
    console.log(`🔍 ${test.name}`);
    
    const result = await makeRequest(test.endpoint, { method: test.method });
    
    if (result.ok && result.data.success) {
      console.log(`   ✅ Status: ${result.status}`);
      console.log(`   📊 Data: ${JSON.stringify(result.data).substring(0, 100)}...`);
      passedTests++;
    } else {
      console.log(`   ❌ Status: ${result.status}`);
      console.log(`   🚨 Error: ${result.error || result.data?.error || 'Unknown error'}`);
      failedTests++;
    }
    
    console.log('');
  }

  // Test individual item fetch (if items exist)
  console.log('🔍 Testing individual item fetch...');
  const allItemsResult = await makeRequest('/store/items?limit=1');
  
  if (allItemsResult.ok && allItemsResult.data.success && allItemsResult.data.data.length > 0) {
    const firstItem = allItemsResult.data.data[0];
    const itemResult = await makeRequest(`/store/items/${firstItem.id}`);
    
    if (itemResult.ok && itemResult.data.success) {
      console.log(`   ✅ Individual item fetch successful`);
      console.log(`   📦 Item: ${itemResult.data.data.name}`);
      passedTests++;
    } else {
      console.log(`   ❌ Individual item fetch failed`);
      failedTests++;
    }
  } else {
    console.log(`   ⚠️  No items found to test individual fetch`);
  }

  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   📁 Total: ${tests.length + 1}`);

  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! Store API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }

  // Additional information
  console.log('\n📋 API Information:');
  console.log(`   🌐 Base URL: ${API_BASE_URL}`);
  console.log(`   📚 Available endpoints:`);
  console.log(`      GET    /store/items`);
  console.log(`      GET    /store/items/:id`);
  console.log(`      GET    /store/items/type/:type`);
  console.log(`      GET    /store/items/stats`);
  console.log(`      POST   /store/items (admin)`);
  console.log(`      PUT    /store/items/:id (admin)`);
  console.log(`      DELETE /store/items/:id (admin)`);
}

/**
 * Test with sample data creation
 */
async function testWithSampleData() {
  console.log('\n🧪 Testing with sample data creation...');
  
  const sampleItem = {
    name: 'Test Fish',
    description: 'A test fish for API testing',
    price: 25.99,
    type: 'fish',
    stock: 10,
    image_url: 'https://example.com/test-fish.png',
  };

  const result = await makeRequest('/store/items', {
    method: 'POST',
    body: JSON.stringify(sampleItem),
  });

  if (result.ok && result.data.success) {
    console.log('   ✅ Sample item created successfully');
    console.log(`   🆔 Item ID: ${result.data.data.id}`);
    
    // Clean up - delete the test item
    const deleteResult = await makeRequest(`/store/items/${result.data.data.id}`, {
      method: 'DELETE',
    });
    
    if (deleteResult.ok && deleteResult.data.success) {
      console.log('   🧹 Test item cleaned up successfully');
    } else {
      console.log('   ⚠️  Failed to clean up test item');
    }
  } else {
    console.log('   ❌ Failed to create sample item');
    console.log(`   🚨 Error: ${result.data?.error || result.error}`);
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    await testStoreAPI();
    
    // Uncomment to test with sample data creation
    // await testWithSampleData();
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
main().catch(console.error);
