use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct PlayerLevel {
    #[key]
    pub player_id: u64,
    pub experience: u64,
    pub level: u32,
}

// Experience thresholds for each level
// Returns the experience needed for the given level
fn get_level_threshold(level: u32) -> u64 {
    // Base experience needed for level 1 is 100
    // Each subsequent level requires 50% more experience than the previous level
    // Level 1: 100
    // Level 2: 150
    // Level 3: 225
    // Level 4: 337
    // And so on...
    if level == 0 {
        return 0;
    }
    let base_exp: u64 = 100;
    let mut required_exp: u64 = base_exp;
    let mut current_level: u32 = 1;
    
    loop {
        if current_level == level {
            break required_exp;
        }
        required_exp = (required_exp * 3) / 2; // 50% increase
        current_level += 1;
    }
}

#[cfg(test)]
mod tests {
    use super::PlayerLevel;
    use super::*;

    #[test]
    fn test_level_thresholds() {
        assert(get_level_threshold(0) == 0, 'Level 0 should be 0 exp');
        assert(get_level_threshold(1) == 100, 'Level 1 should be 100 exp');
        assert(get_level_threshold(2) == 150, 'Level 2 should be 150 exp');
        assert(get_level_threshold(3) == 225, 'Level 3 should be 225 exp');
    }

    #[test]
    fn test_player_level_creation() {
        let player_level = PlayerLevel { 
            player_id: 1_u64, 
            experience: 0_u64, 
            level: 0_u32 
        };
        assert(player_level.player_id == 1, 'Player ID should match');
        assert(player_level.experience == 0, 'Initial exp should be 0');
        assert(player_level.level == 0, 'Initial level should be 0');
    }
}