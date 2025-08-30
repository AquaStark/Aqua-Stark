// dojo decorator
#[dojo::contract]
pub mod FishSystem {
    // use dojo::world::IWorldDispatcherTrait;
    // use dojo::world::WorldStorageTrait;
    use aqua_stark::interfaces::IFishSystem::IFishSystem;
    use aqua_stark::base::game_events::{
        GameStateChanged, FishGameCreated, FishGameMoved, FishGameBred, DecorationGameMoved,
        FishGameListed, FishGamePurchased, GameExperienceEarned, GameLevelUp,
        GameOperationCompleted,
    };
    use aqua_stark::base::events::{
        FishCreated, FishBred, FishMoved, DecorationMoved, FishAddedToAquarium,
        DecorationAddedToAquarium, FishPurchased,
    };
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use aqua_stark::models::player_model::{Player};
    use aqua_stark::models::aquarium_model::{Aquarium, AquariumTrait};
    use aqua_stark::models::decoration_model::{Decoration, DecorationTrait};
    use aqua_stark::models::fish_model::{
        Fish, FishCounter, FishOwner, FishParents, FishTrait, Listing, Species,
    };
    use core::traits::Into;
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;

    #[abi(embed_v0)]
    impl FishSystemImpl of IFishSystem<ContractState> {
        fn new_fish(ref self: ContractState, aquarium_id: u256, species: Species) -> Fish {
            let caller = get_caller_address();

            let mut world = self.world_default();

            let mut aquarium: Aquarium = world.read_model(aquarium_id);
            assert(aquarium.owner == get_caller_address(), 'You do not own this aquarium');
            let fish_id = self.create_fish_id();
            let mut fish: Fish = world.read_model(fish_id);

            fish = FishTrait::create_fish_by_species(fish, aquarium_id, caller, species);
            fish.family_tree = array![];
            aquarium = AquariumTrait::add_fish(aquarium.clone(), fish.id);
            let mut fish_owner: FishOwner = world.read_model(fish_id);
            fish_owner.owner = caller;
            let mut player: Player = world.read_model(caller);
            player.fish_count += 1;
            player.player_fishes.append(fish_id);

            let experience_earned = if player.daily_fish_creations < 5 {
                let experience = match species {
                    Species::GoldFish => 3,
                    Species::AngelFish => 5,
                    Species::Betta => 7,
                    Species::NeonTetra => 7,
                    Species::Corydoras => 7,
                    Species::Hybrid => 10,
                };
                player.experience_points += experience;
                player.daily_fish_creations += 1;
                experience
            } else {
                0
            };

            world.write_model(@aquarium);
            world.write_model(@player);
            world.write_model(@fish_owner);
            world.write_model(@fish);

            // Emit game-specific events
            world
                .emit_event(
                    @FishCreated {
                        fish_id, owner: caller, aquarium_id, timestamp: get_block_timestamp(),
                    },
                );
            fish
        }

        fn breed_fishes(ref self: ContractState, parent1_id: u256, parent2_id: u256) -> u256 {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let mut parent1: Fish = world.read_model(parent1_id);
            let mut parent2: Fish = world.read_model(parent2_id);
            let mut aquarium: Aquarium = world.read_model(parent1.aquarium_id);
            assert(parent1.owner == caller, 'You do not own parent1');
            assert(parent2.owner == caller, 'You do not own parent2');
            assert(aquarium.housed_fish.len() < aquarium.max_capacity, 'Aquarium full');
            assert(parent1.aquarium_id == parent2.aquarium_id, 'Fishes must have same aquarium');
            assert(parent1.owner == parent2.owner, 'Fishes must have same player');

            let new_fish_id = self.create_fish_id();
            let mut new_fish: Fish = world.read_model(new_fish_id);

            new_fish =
                FishTrait::create_offspring(
                    new_fish, caller, parent1.aquarium_id, parent1.clone(), parent2.clone(),
                );

            let mut fish_owner: FishOwner = world.read_model(new_fish_id);
            fish_owner.owner = get_caller_address();

            let mut player: Player = world.read_model(get_caller_address());
            player.fish_count += 1;
            player.player_fishes.append(new_fish.id);
            parent1.offspings.append(new_fish.id);
            parent2.offspings.append(new_fish.id);

            let fish_parents = FishParents { parent1: parent1.id, parent2: parent2.id };

            let mut offspring_tree = parent1.family_tree.clone();
            offspring_tree.append(fish_parents);
            new_fish.family_tree = offspring_tree;

            aquarium.fish_count += 1;
            aquarium.housed_fish.append(new_fish.id);

            let experience_earned = match new_fish.species {
                Species::GoldFish => 15,
                Species::AngelFish => 15,
                Species::Betta => 20,
                Species::NeonTetra => 20,
                Species::Corydoras => 20,
                Species::Hybrid => 25,
            };
            player.experience_points += experience_earned;

            world.write_model(@aquarium);
            world.write_model(@parent1);
            world.write_model(@parent2);
            world.write_model(@player);
            world.write_model(@fish_owner);
            world.write_model(@new_fish);

            // Emit game-specific events
            world
                .emit_event(
                    @FishBred {
                        offspring_id: new_fish.id,
                        owner: get_caller_address(),
                        parent1_id: parent1.id,
                        parent2_id: parent2.id,
                        aquarium_id: parent1.aquarium_id,
                        timestamp: get_block_timestamp(),
                    },
                );
            new_fish.id
        }

        fn move_fish_to_aquarium(
            ref self: ContractState, fish_id: u256, from: u256, to: u256,
        ) -> bool {
            let caller = get_caller_address();

            let mut world = self.world_default();
            let mut fish: Fish = world.read_model(fish_id);
            assert(fish.aquarium_id == from, 'Fish not in source aquarium');
            let mut aquarium_from: Aquarium = world.read_model(from);
            let mut aquarium_to: Aquarium = world.read_model(to);
            assert(aquarium_to.housed_fish.len() < aquarium_to.max_capacity, 'Aquarium full');
            assert(aquarium_to.owner == get_caller_address(), 'You do not own this aquarium');

            aquarium_from = AquariumTrait::remove_fish(aquarium_from.clone(), fish_id);
            aquarium_to = AquariumTrait::add_fish(aquarium_to.clone(), fish_id);

            let mut player: Player = world.read_model(caller);
            let experience_earned = 3; // 3 XP for moving fish
            player.experience_points += experience_earned;
            world.write_model(@player);

            fish.aquarium_id = to;
            world.write_model(@fish);
            world.write_model(@aquarium_from);
            world.write_model(@aquarium_to);

            // Emit game-specific events
            world.emit_event(@FishMoved { fish_id, from, to, timestamp: get_block_timestamp() });

            world
                .emit_event(
                    @FishGameMoved {
                        fish_id,
                        from_aquarium: from,
                        to_aquarium: to,
                        owner: caller,
                        experience_earned,
                        timestamp: get_block_timestamp(),
                    },
                );
            true
        }

        fn add_fish_to_aquarium(ref self: ContractState, mut fish: Fish, aquarium_id: u256) {
            let caller = get_caller_address();

            let mut world = self.world_default();
            let mut aquarium: Aquarium = world.read_model(aquarium_id);
            assert(aquarium.housed_fish.len() < aquarium.max_capacity, 'Aquarium full');
            assert(fish.aquarium_id == aquarium_id, 'Fish in aquarium');
            assert(fish.owner == get_caller_address(), 'You do not own this fish');

            AquariumTrait::add_fish(aquarium.clone(), fish.id);
            world.write_model(@aquarium);

            // Emit game-specific events
            world
                .emit_event(
                    @FishAddedToAquarium {
                        fish_id: fish.id, aquarium_id, timestamp: get_block_timestamp(),
                    },
                );
        }
        fn get_fish(self: @ContractState, id: u256) -> Fish {
            let mut world = self.world_default();
            let fish: Fish = world.read_model(id);
            fish
        }
        fn get_player_fishes(self: @ContractState, player: ContractAddress) -> Array<Fish> {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            let mut fishes: Array<Fish> = array![];
            for fish_id in player_model.player_fishes {
                let fish: Fish = world.read_model(fish_id);
                fishes.append(fish);
            };
            fishes
        }

        fn get_player_fish_count(self: @ContractState, player: ContractAddress) -> u32 {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            player_model.fish_count
        }
        fn get_parents(self: @ContractState, fish_id: u256) -> (u256, u256) {
            let mut world = self.world_default();
            let fish: Fish = world.read_model(fish_id);
            fish.parent_ids
        }

        fn get_fish_offspring(self: @ContractState, fish_id: u256) -> Array<Fish> {
            let mut world = self.world_default();
            let fish: Fish = world.read_model(fish_id);
            let mut offspring: Array<Fish> = array![];
            for child_id in fish.offspings {
                let child: Fish = world.read_model(child_id);
                offspring.append(child);
            };
            offspring
        }

        fn get_fish_owner(self: @ContractState, id: u256) -> ContractAddress {
            let fish = self.get_fish(id);
            fish.owner
        }
        fn get_fish_family_tree(self: @ContractState, fish_id: u256) -> Array<FishParents> {
            let mut world = self.world_default();
            let fish: Fish = world.read_model(fish_id);
            fish.family_tree
        }

        fn get_fish_ancestor(self: @ContractState, fish_id: u256, generation: u32) -> FishParents {
            let mut world = self.world_default();
            let fish: Fish = world.read_model(fish_id);
            assert(generation < fish.family_tree.len(), 'Generation out of bounds');
            let fish_parent: FishParents = *fish.family_tree[generation];
            fish_parent
        }

        fn list_fish(self: @ContractState, fish_id: u256, price: u256) -> Listing {
            let mut world = self.world_default();
            let fish: Fish = world.read_model(fish_id);
            let listing: Listing = FishTrait::list(fish, price);
            let mut player: Player = world.read_model(get_caller_address());
            let experience_earned = 5; // 5 XP for listing fish
            player.experience_points += experience_earned;
            world.write_model(@player);
            world.write_model(@listing);

            // Emit game-specific events
            world
                .emit_event(
                    @FishGameListed {
                        fish_id,
                        owner: get_caller_address(),
                        price,
                        experience_earned,
                        timestamp: get_block_timestamp(),
                    },
                );
            listing
        }
        fn purchase_fish(ref self: ContractState, listing_id: felt252) {
            let caller = get_caller_address();

            let mut world = self.world_default();
            let mut listing: Listing = world.read_model(listing_id);
            let mut buyer: Player = world.read_model(caller);
            let mut fish: Fish = world.read_model(listing.fish_id);
            assert!(fish.owner != caller, "You already own this fish");
            assert!(listing.is_active, "Listing is not active");

            // Store the original seller before transferring ownership
            let original_seller = fish.owner;

            // Update seller's Player model
            let mut seller: Player = world.read_model(original_seller);
            seller.fish_count -= 1;
            let mut new_fishes: Array<u256> = array![];
            for fish_id in seller.player_fishes {
                if fish_id != listing.fish_id {
                    new_fishes.append(fish_id);
                }
            };
            seller.player_fishes = new_fishes;
            world.write_model(@seller);

            // Update buyer's Player model
            let fish = FishTrait::purchase(fish, listing);
            buyer.fish_count += 1;
            buyer.player_fishes.append(fish.id);
            listing.is_active = false;

            let experience_earned = if listing.price >= 1000 {
                15
            } else {
                10
            }; // Scale based on price
            buyer.experience_points += experience_earned;

            world.write_model(@fish);
            world.write_model(@buyer);
            world.write_model(@listing);

            // Emit game-specific events
            world
                .emit_event(
                    @FishPurchased {
                        buyer: caller,
                        seller: original_seller,
                        price: listing.price,
                        fish_id: fish.id,
                        timestamp: get_block_timestamp(),
                    },
                );
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "aqua_stark". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }

        fn create_fish_id(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let mut fish_counter: FishCounter = world.read_model('v0');
            let new_val = fish_counter.current_val + 1;
            fish_counter.current_val = new_val;
            world.write_model(@fish_counter);
            new_val
        }
    }
}
