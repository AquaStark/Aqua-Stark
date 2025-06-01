#[dojo::contract]
pub mod actions {
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use dojo_starter::errors::errors::CustomErrors;
    use dojo_starter::events::events::*;
    use dojo_starter::interfaces::IActions::IFish;
    use dojo_starter::models::aqua_stark::{Fish, Id};
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};

    const FISH_ID_TARGET: felt252 = 'FISH';

    #[abi(embed_v0)]
    impl ActionsImpl of IFish<ContractState> {
        fn create_fish(ref self: ContractState, owner: ContractAddress, fish_type: u32) -> u64 {
            let mut world = self.world_default();

            // Generate new fish ID
            let fish_id = self.generate_fish_id();

            // Create new fish
            let fish = Fish {
                id: fish_id, fish_type, age: 0, hunger_level: 100, health: 100, growth: 0, owner,
            };

            // Write to world state
            world.write_model(@fish);

            // Emit event
            let created_event = FishCreated { id: fish_id, owner, fish_type };
            world.emit_event(@created_event);

            fish_id
        }
        fn feed(ref self: ContractState, fish_id: u64, amount: u32) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read current fish state
            let mut fish: Fish = world.read_model(fish_id);

            // Check ownership
            assert(fish.owner == caller, CustomErrors::NOT_OWNER);

            // Update hunger
            let new_hunger = if fish.hunger_level - amount < 0 {
                0_u32
            } else {
                fish.hunger_level - amount
            };

            fish.hunger_level = new_hunger;

            // Write updated state
            world.write_model(@fish);

            // Emit event
            let fed_event = FishFed { fish_id, amount, new_hunger };
            world.emit_event(@fed_event);
        }

        fn grow(ref self: ContractState, fish_id: u64, amount: u32) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read current fish state
            let mut fish: Fish = world.read_model(fish_id);

            // Check ownership
            assert(fish.owner == caller, CustomErrors::NOT_OWNER);

            // Update growth
            let new_growth = if fish.growth + amount > 100 {
                100_u32
            } else {
                fish.growth + amount
            };

            fish.growth = new_growth;

            // Write updated state
            world.write_model(@fish);

            // Emit event
            let grown_event = FishGrown { fish_id, amount, new_growth };
            world.emit_event(@grown_event);
        }

        fn heal(ref self: ContractState, fish_id: u64, amount: u32) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read current fish state
            let mut fish: Fish = world.read_model(fish_id);

            // Check ownership
            assert(fish.owner == caller, CustomErrors::NOT_OWNER);

            // Update health
            let new_health = if fish.health + amount > 100 {
                100_u32
            } else {
                fish.health + amount
            };

            fish.health = new_health;

            // Write updated state
            world.write_model(@fish);

            // Emit event
            let healed_event = FishHealed { fish_id, amount, new_health };
            world.emit_event(@healed_event);
        }

        fn damage(ref self: ContractState, fish_id: u64, amount: u32) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read current fish state
            let mut fish: Fish = world.read_model(fish_id);

            // Check ownership
            assert(fish.owner == caller, CustomErrors::NOT_OWNER);

            // Update health
            let new_health = if amount >= fish.health {
                0_u32
            } else {
                fish.health - amount
            };

            fish.health = new_health;

            // Write updated state
            world.write_model(@fish);

            // Emit event
            let damaged_event = FishDamaged { fish_id, damage_amount: amount, new_health };
            world.emit_event(@damaged_event);
        }

        fn regenerate_health(ref self: ContractState, fish_id: u64, aquarium_cleanliness: u32) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read current fish state
            let mut fish: Fish = world.read_model(fish_id);

            // Check ownership
            assert(fish.owner == caller, CustomErrors::NOT_OWNER);

            // Only regenerate if fish is not dead and aquarium is clean enough
            if fish.health > 0_u32 && aquarium_cleanliness >= 80_u32 {
                // Calculate regeneration amount based on cleanliness
                let regen_amount = (aquarium_cleanliness - 80_u32) / 4_u32;

                // Update health
                let new_health = if fish.health + regen_amount > 100_u32 {
                    100_u32
                } else {
                    fish.health + regen_amount
                };

                fish.health = new_health;

                // Write updated state
                world.write_model(@fish);

                // Emit event
                let healed_event = FishHealed { fish_id, amount: regen_amount, new_health };
                world.emit_event(@healed_event);
            }
        }

        fn update_hunger(ref self: ContractState, fish_id: u64, hours_passed: u32) {
            let mut world = self.world_default();

            // Read current fish state
            let mut fish: Fish = world.read_model(fish_id);

            // Calculate hunger decrease
            let hunger_decrease = hours_passed * 2;

            // Update hunger
            let new_hunger = if hunger_decrease > fish.hunger_level {
                0_u32
            } else {
                fish.hunger_level - hunger_decrease
            };

            fish.hunger_level = new_hunger;

            // Write updated state
            world.write_model(@fish);

            // Emit event
            let updated_event = FishHungerUpdated { fish_id, hours_passed, new_hunger };
            world.emit_event(@updated_event);
        }

        fn update_age(ref self: ContractState, fish_id: u64, days_passed: u32) {
            let mut world = self.world_default();

            // Read current fish state
            let mut fish: Fish = world.read_model(fish_id);

            // Update age
            fish.age += days_passed;

            // Write updated state
            world.write_model(@fish);

            // Emit event
            let updated_event = FishAgeUpdated { fish_id, days_passed, new_age: fish.age };
            world.emit_event(@updated_event);
        }

        fn get_hunger_level(self: @ContractState, fish_id: u64) -> u32 {
            let mut world = self.world_default();
            let fish: Fish = world.read_model(fish_id);
            fish.hunger_level
        }

        fn get_growth_rate(self: @ContractState, fish_id: u64) -> u32 {
            let mut world = self.world_default();
            let fish: Fish = world.read_model(fish_id);
            fish.growth
        }

        fn get_health(self: @ContractState, fish_id: u64) -> u32 {
            let mut world = self.world_default();
            let fish: Fish = world.read_model(fish_id);
            fish.health
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"dojo_starter")
        }

        fn generate_fish_id(self: @ContractState) -> u64 {
            let mut world = self.world_default();
            let mut fish_id: Id = world.read_model(FISH_ID_TARGET);
            let new_id = fish_id.nonce + 1;
            fish_id.nonce = new_id;
            world.write_model(@fish_id);
            new_id
        }
    }
}
