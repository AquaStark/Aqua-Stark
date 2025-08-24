import { supabaseAdmin } from '../src/config/supabase.js';

/**
 * Create tables using basic Supabase operations
 */

async function createTables() {
  console.log('🚀 Creating Aqua Stark database tables...\n');

  try {
    // Test connection
    console.log('🔗 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (testError) {
      console.log('❌ Connection failed:', testError.message);
      console.log('\n💡 Please check your .env file and Supabase credentials');
      return;
    }

    console.log('✅ Connection successful!\n');

    // Create tables one by one
    console.log('📋 Creating tables...\n');

    // 1. Create fish_dynamic_states table
    console.log('1️⃣ Creating fish_dynamic_states table...');
    try {
      const { error } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS fish_dynamic_states (
            fish_id TEXT PRIMARY KEY,
            happiness_level INTEGER DEFAULT 50 CHECK (happiness_level >= 0 AND happiness_level <= 100),
            hunger_level INTEGER DEFAULT 100 CHECK (hunger_level >= 0 AND hunger_level <= 100),
            health INTEGER DEFAULT 100 CHECK (health >= 0 AND health <= 100),
            mood TEXT DEFAULT 'happy',
            last_fed_timestamp TIMESTAMP WITH TIME ZONE,
            last_played_timestamp TIMESTAMP WITH TIME ZONE,
            last_interaction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            activity_streak INTEGER DEFAULT 0,
            experience_points INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      });

      if (error) {
        console.log('   ⚠️  Warning:', error.message);
      } else {
        console.log('   ✅ Success');
      }
    } catch (err) {
      console.log('   ❌ Error:', err.message);
    }

    // 2. Create aquarium_dynamic_states table
    console.log('\n2️⃣ Creating aquarium_dynamic_states table...');
    try {
      const { error } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS aquarium_dynamic_states (
            aquarium_id TEXT PRIMARY KEY,
            water_temperature DECIMAL(4,1) DEFAULT 25.0 CHECK (water_temperature >= 18.0 AND water_temperature <= 32.0),
            lighting_level INTEGER DEFAULT 50 CHECK (lighting_level >= 0 AND lighting_level <= 100),
            pollution_level DECIMAL(3,2) DEFAULT 0.0 CHECK (pollution_level >= 0.0 AND pollution_level <= 1.0),
            background_music_playing BOOLEAN DEFAULT false,
            last_cleaned_timestamp TIMESTAMP WITH TIME ZONE,
            current_theme_id TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      });

      if (error) {
        console.log('   ⚠️  Warning:', error.message);
      } else {
        console.log('   ✅ Success');
      }
    } catch (err) {
      console.log('   ❌ Error:', err.message);
    }

    // 3. Create player_preferences table
    console.log('\n3️⃣ Creating player_preferences table...');
    try {
      const { error } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS player_preferences (
            wallet_address TEXT PRIMARY KEY,
            sound_enabled BOOLEAN DEFAULT true,
            animations_enabled BOOLEAN DEFAULT true,
            notifications_enabled BOOLEAN DEFAULT true,
            preferred_language TEXT DEFAULT 'en',
            ui_theme TEXT DEFAULT 'light' CHECK (ui_theme IN ('light', 'dark', 'auto')),
            auto_feed_enabled BOOLEAN DEFAULT false,
            tutorial_completed_steps TEXT[] DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      });

      if (error) {
        console.log('   ⚠️  Warning:', error.message);
      } else {
        console.log('   ✅ Success');
      }
    } catch (err) {
      console.log('   ❌ Error:', err.message);
    }

    // 4. Create minigame_sessions table
    console.log('\n4️⃣ Creating minigame_sessions table...');
    try {
      const { error } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS minigame_sessions (
            session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            player_wallet TEXT NOT NULL,
            game_type TEXT NOT NULL,
            score INTEGER DEFAULT 0,
            duration INTEGER DEFAULT 0,
            xp_earned INTEGER DEFAULT 0,
            synced_to_chain BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      });

      if (error) {
        console.log('   ⚠️  Warning:', error.message);
      } else {
        console.log('   ✅ Success');
      }
    } catch (err) {
      console.log('   ❌ Error:', err.message);
    }

    // 5. Create game_analytics table
    console.log('\n5️⃣ Creating game_analytics table...');
    try {
      const { error } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS game_analytics (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            player_wallet TEXT NOT NULL,
            fish_id TEXT,
            metric_name TEXT NOT NULL,
            metric_value INTEGER DEFAULT 0,
            date DATE DEFAULT CURRENT_DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(player_wallet, fish_id, metric_name, date)
          );
        `,
      });

      if (error) {
        console.log('   ⚠️  Warning:', error.message);
      } else {
        console.log('   ✅ Success');
      }
    } catch (err) {
      console.log('   ❌ Error:', err.message);
    }

    console.log('\n🎉 Database setup completed!');
    console.log('\n📋 Next steps:');
    console.log(
      '1. Check your Supabase dashboard to verify tables were created'
    );
    console.log('2. Run the backend server: pnpm dev');
    console.log('3. Test the API endpoints');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log(
      '\n💡 Alternative: Copy the SQL from migrations/001_initial_schema.sql'
    );
    console.log('   and paste it directly in your Supabase SQL Editor');
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createTables();
}

export { createTables };
