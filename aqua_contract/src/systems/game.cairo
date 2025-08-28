// dojo decorator
#[dojo::contract]
pub mod Game {
    // use dojo::world::IWorldDispatcherTrait;
    // use dojo::world::WorldStorageTrait;
    use aqua_stark::interfaces::IGame::{IGame};
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
    use aqua_stark::models::session::{
        SessionKey, SessionAnalytics, SESSION_STATUS_ACTIVE, SESSION_STATUS_EXPIRED,
        SESSION_TYPE_PREMIUM, PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE, PERMISSION_ADMIN,
    };
    use aqua_stark::helpers::session_validation::{
        SessionValidationImpl, MIN_SESSION_DURATION, AUTO_RENEWAL_THRESHOLD,
        MAX_TRANSACTIONS_PER_SESSION,
    };
    use core::traits::Into;
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;

    #[abi(embed_v0)]
    impl GameImpl of IGame<ContractState> {
        fn new_fish(ref self: ContractState, aquarium_id: u256, species: Species) -> Fish {
            // Get or create unified session
            let caller = get_caller_address();
            let session_id = self.get_or_create_session(caller);
            self.validate_and_update_session(session_id, PERMISSION_SPAWN);

            let mut world = self.world_default();
            let mut aquarium = self.get_aquarium(aquarium_id);
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

            self.check_and_reset_daily_limits(caller);

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

            world
                .emit_event(
                    @FishGameCreated {
                        fish_id,
                        owner: caller,
                        aquarium_id,
                        species,
                        experience_earned,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameExperienceEarned {
                        player: caller,
                        amount: experience_earned,
                        total_experience: player.experience_points,
                        action_type: 'fish_creation',
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameStateChanged {
                        player: caller,
                        state_type: 'fish_created',
                        state_value: fish_id,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameOperationCompleted {
                        player: caller,
                        operation_type: 'new_fish',
                        success: true,
                        timestamp: get_block_timestamp(),
                    },
                );

            fish
        }

        fn breed_fishes(ref self: ContractState, parent1_id: u256, parent2_id: u256) -> u256 {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let mut parent1: Fish = world.read_model(parent1_id);
            let mut parent2: Fish = world.read_model(parent2_id);
            let mut aquarium = self.get_aquarium(parent1.aquarium_id);
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

            world
                .emit_event(
                    @FishGameBred {
                        offspring_id: new_fish.id,
                        owner: get_caller_address(),
                        parent1_id: parent1.id,
                        parent2_id: parent2.id,
                        aquarium_id: parent1.aquarium_id,
                        experience_earned,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameExperienceEarned {
                        player: caller,
                        amount: experience_earned,
                        total_experience: player.experience_points,
                        action_type: 'fish_breeding',
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameStateChanged {
                        player: caller,
                        state_type: 'fish_bred',
                        state_value: new_fish.id,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameOperationCompleted {
                        player: caller,
                        operation_type: 'breed_fishes',
                        success: true,
                        timestamp: get_block_timestamp(),
                    },
                );

            new_fish.id
        }

        fn move_fish_to_aquarium(
            ref self: ContractState, fish_id: u256, from: u256, to: u256,
        ) -> bool {
            // Get or create unified session
            let caller = get_caller_address();
            let session_id = self.get_or_create_session(caller);
            self.validate_and_update_session(session_id, PERMISSION_MOVE);

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

            world
                .emit_event(
                    @GameExperienceEarned {
                        player: caller,
                        amount: experience_earned,
                        total_experience: player.experience_points,
                        action_type: 'fish_movement',
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameStateChanged {
                        player: caller,
                        state_type: 'fish_moved',
                        state_value: fish_id,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameOperationCompleted {
                        player: caller,
                        operation_type: 'move_fish',
                        success: true,
                        timestamp: get_block_timestamp(),
                    },
                );

            true
        }

        fn move_decoration_to_aquarium(
            ref self: ContractState, decoration_id: u256, from: u256, to: u256,
        ) -> bool {
            // Get or create unified session
            let caller = get_caller_address();
            let session_id = self.get_or_create_session(caller);
            self.validate_and_update_session(session_id, PERMISSION_MOVE);

            let mut world = self.world_default();
            let mut decoration: Decoration = world.read_model(decoration_id);
            assert!(decoration.aquarium_id == from, "Decoration not in aquarium");
            let mut aquarium_from: Aquarium = world.read_model(from);
            let mut aquarium_to: Aquarium = world.read_model(to);
            assert!(
                aquarium_to.housed_decorations.len() < aquarium_to.max_decorations,
                "Aquarium deco limit reached",
            );
            assert!(aquarium_to.owner == caller, "You do not own this aquarium");

            aquarium_from = AquariumTrait::remove_decoration(aquarium_from.clone(), decoration_id);
            aquarium_to = AquariumTrait::add_decoration(aquarium_to.clone(), decoration_id);

            // Add experience points
            let mut player: Player = world.read_model(caller);
            let experience_earned = 3; // 3 XP for moving decoration
            player.experience_points += experience_earned;
            world.write_model(@player);

            decoration.aquarium_id = to;
            world.write_model(@decoration);
            world.write_model(@aquarium_from);
            world.write_model(@aquarium_to);

            // Emit game-specific events
            world
                .emit_event(
                    @DecorationMoved { decoration_id, from, to, timestamp: get_block_timestamp() },
                );

            world
                .emit_event(
                    @DecorationGameMoved {
                        decoration_id,
                        from_aquarium: from,
                        to_aquarium: to,
                        owner: caller,
                        experience_earned,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameExperienceEarned {
                        player: caller,
                        amount: experience_earned,
                        total_experience: player.experience_points,
                        action_type: 'decoration_movement',
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameStateChanged {
                        player: caller,
                        state_type: 'decoration_moved',
                        state_value: decoration_id,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameOperationCompleted {
                        player: caller,
                        operation_type: 'move_decoration',
                        success: true,
                        timestamp: get_block_timestamp(),
                    },
                );

            true
        }

        fn add_fish_to_aquarium(ref self: ContractState, mut fish: Fish, aquarium_id: u256) {
            // Get or create unified session
            let caller = get_caller_address();
            let session_id = self.get_or_create_session(caller);
            self.validate_and_update_session(session_id, PERMISSION_MOVE);

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

            world
                .emit_event(
                    @GameStateChanged {
                        player: caller,
                        state_type: 'fish_added_to_aquarium',
                        state_value: fish.id,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameOperationCompleted {
                        player: caller,
                        operation_type: 'add_fish_to_aquarium',
                        success: true,
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn add_decoration_to_aquarium(
            ref self: ContractState, mut decoration: Decoration, aquarium_id: u256,
        ) {
            let mut world = self.world_default();
            let mut aquarium: Aquarium = world.read_model(aquarium_id);
            assert(
                aquarium.max_decorations > aquarium.housed_decorations.len(),
                'Aquarium deco limit reached',
            );
            assert(decoration.aquarium_id == aquarium_id, 'Deco in aquarium');
            assert(decoration.owner == get_caller_address(), 'You do not own this deco');
            AquariumTrait::add_decoration(aquarium.clone(), decoration.id);
            world.write_model(@aquarium);

            // Emit game-specific events
            world
                .emit_event(
                    @DecorationAddedToAquarium {
                        decoration_id: decoration.id, aquarium_id, timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameStateChanged {
                        player: get_caller_address(),
                        state_type: 'decoration_added_to_aquarium',
                        state_value: decoration.id,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameOperationCompleted {
                        player: get_caller_address(),
                        operation_type: 'add_decoration_to_aquarium',
                        success: true,
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn get_player(self: @ContractState, address: ContractAddress) -> Player {
            let mut world = self.world_default();
            let player: Player = world.read_model(address);
            player
        }

        fn get_fish(self: @ContractState, id: u256) -> Fish {
            let mut world = self.world_default();
            let fish: Fish = world.read_model(id);
            fish
        }

        fn get_aquarium(self: @ContractState, id: u256) -> Aquarium {
            let mut world = self.world_default();
            let aquarium: Aquarium = world.read_model(id);
            aquarium
        }

        fn get_decoration(self: @ContractState, id: u256) -> Decoration {
            let mut world = self.world_default();
            let decoration: Decoration = world.read_model(id);
            decoration
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

        fn get_player_aquariums(self: @ContractState, player: ContractAddress) -> Array<Aquarium> {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            let mut aquariums: Array<Aquarium> = array![];
            for aquarium_id in player_model.player_aquariums {
                let aquarium: Aquarium = world.read_model(aquarium_id);
                aquariums.append(aquarium);
            };
            aquariums
        }

        fn get_player_decorations(
            self: @ContractState, player: ContractAddress,
        ) -> Array<Decoration> {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            let mut decorations: Array<Decoration> = array![];
            for decoration_id in player_model.player_decorations {
                let decoration: Decoration = world.read_model(decoration_id);
                decorations.append(decoration);
            };
            decorations
        }

        fn get_player_fish_count(self: @ContractState, player: ContractAddress) -> u32 {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            player_model.fish_count
        }

        fn get_player_aquarium_count(self: @ContractState, player: ContractAddress) -> u32 {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            player_model.aquarium_count
        }

        fn get_player_decoration_count(self: @ContractState, player: ContractAddress) -> u32 {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            player_model.decoration_count
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

        fn get_aquarium_owner(self: @ContractState, id: u256) -> ContractAddress {
            let aquarium = self.get_aquarium(id);
            aquarium.owner
        }

        fn get_decoration_owner(self: @ContractState, id: u256) -> ContractAddress {
            let decoration = self.get_decoration(id);
            decoration.owner
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

            world
                .emit_event(
                    @GameExperienceEarned {
                        player: get_caller_address(),
                        amount: experience_earned,
                        total_experience: player.experience_points,
                        action_type: 'fish_listing',
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameStateChanged {
                        player: get_caller_address(),
                        state_type: 'fish_listed',
                        state_value: fish_id,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameOperationCompleted {
                        player: get_caller_address(),
                        operation_type: 'list_fish',
                        success: true,
                        timestamp: get_block_timestamp(),
                    },
                );

            listing
        }

        fn get_listing(self: @ContractState, listing_id: felt252) -> Listing {
            let mut world = self.world_default();
            let listing: Listing = world.read_model(listing_id);
            listing
        }

        fn purchase_fish(ref self: ContractState, listing_id: felt252) {
            // Get or create unified session
            let caller = get_caller_address();
            let session_id = self.get_or_create_session(caller);
            self.validate_and_update_session(session_id, PERMISSION_TRADE);

            let mut world = self.world_default();
            let mut listing: Listing = self.get_listing(listing_id);
            let mut buyer: Player = self.get_player(caller);
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

            world
                .emit_event(
                    @FishGamePurchased {
                        fish_id: fish.id,
                        buyer: caller,
                        seller: original_seller,
                        price: listing.price,
                        experience_earned,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameExperienceEarned {
                        player: caller,
                        amount: experience_earned,
                        total_experience: buyer.experience_points,
                        action_type: 'fish_purchase',
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameStateChanged {
                        player: caller,
                        state_type: 'fish_purchased',
                        state_value: fish.id,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @GameOperationCompleted {
                        player: caller,
                        operation_type: 'purchase_fish',
                        success: true,
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn is_verified(self: @ContractState, player: ContractAddress) -> bool {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            player_model.is_verified
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

        // Session management functions
        fn get_or_create_session(ref self: ContractState, player: ContractAddress) -> felt252 {
            let mut world = self.world_default();
            let current_time = get_block_timestamp();

            // Try to find existing active session
            let session_id = self.generate_session_id(player, current_time);

            // Try to read existing session
            let existing_session: SessionKey = world.read_model((session_id, player));

            // If session doesn't exist or is invalid, create new one
            if existing_session.session_id == 0
                || !existing_session.is_valid
                || existing_session.status != SESSION_STATUS_ACTIVE {
                let mut session = self.create_new_session(player, current_time);
                world.write_model(@session);

                // Create analytics for new session
                let analytics = SessionAnalytics {
                    session_id,
                    total_transactions: 0,
                    successful_transactions: 0,
                    failed_transactions: 0,
                    total_gas_used: 0,
                    average_gas_per_tx: 0,
                    last_activity: current_time,
                    created_at: current_time,
                };
                world.write_model(@analytics);
            }

            session_id
        }

        fn create_new_session(
            ref self: ContractState, player: ContractAddress, current_time: u64,
        ) -> SessionKey {
            let session_id = self.generate_session_id(player, current_time);

            SessionKey {
                session_id,
                player_address: player,
                created_at: current_time,
                expires_at: current_time + MIN_SESSION_DURATION,
                last_used: current_time,
                max_transactions: MAX_TRANSACTIONS_PER_SESSION,
                used_transactions: 0,
                status: SESSION_STATUS_ACTIVE,
                is_valid: true,
                auto_renewal_enabled: true,
                session_type: SESSION_TYPE_PREMIUM, // All permissions
                permissions: array![
                    PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE, PERMISSION_ADMIN,
                ],
            }
        }

        fn generate_session_id(
            self: @ContractState, player: ContractAddress, timestamp: u64,
        ) -> felt252 {
            player.into() + timestamp.into()
        }

        fn validate_and_update_session(
            ref self: ContractState, session_id: felt252, required_permission: u8,
        ) -> bool {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let current_time = get_block_timestamp();

            // Try to read existing session
            let existing_session: SessionKey = world.read_model((session_id, caller));

            // If session doesn't exist or is invalid, create a new one
            if existing_session.session_id == 0
                || !existing_session.is_valid
                || existing_session.status != SESSION_STATUS_ACTIVE {
                let mut session = self.create_new_session(caller, current_time);
                world.write_model(@session);

                // Create new analytics
                let analytics = SessionAnalytics {
                    session_id,
                    total_transactions: 0,
                    successful_transactions: 0,
                    failed_transactions: 0,
                    total_gas_used: 0,
                    average_gas_per_tx: 0,
                    last_activity: current_time,
                    created_at: current_time,
                };
                world.write_model(@analytics);

                // Session validation successful

                // Return true for new session (bypass validation for first use)
                return true;
            }

            // Use existing session
            let mut session = existing_session;

            // Basic validation
            assert(session.session_id != 0, 'Session not found');
            assert(session.player_address == caller, 'Unauthorized session');
            assert(session.is_valid, 'Session invalid');
            assert(session.status == SESSION_STATUS_ACTIVE, 'Session not active');
            assert(current_time < session.expires_at, 'Session expired');
            assert(session.used_transactions < session.max_transactions, 'No transactions left');

            // Check required permission
            let has_permission = self.check_permission(@session, required_permission);
            assert(has_permission, 'Insufficient permissions');

            // Auto-renewal check
            let expires_at = session.expires_at;
            let time_remaining = if current_time >= expires_at {
                0
            } else {
                expires_at - current_time
            };
            if time_remaining < AUTO_RENEWAL_THRESHOLD && session.auto_renewal_enabled {
                session.expires_at = current_time + MIN_SESSION_DURATION;
                session.max_transactions = MAX_TRANSACTIONS_PER_SESSION;
                session.used_transactions = 0;
            }

            // Update session
            session.used_transactions += 1;
            session.last_used = current_time;
            world.write_model(@session);

            // Update analytics
            let mut analytics: SessionAnalytics = world.read_model(session_id);
            analytics.total_transactions += 1;
            analytics.successful_transactions += 1;
            analytics.last_activity = current_time;
            world.write_model(@analytics);

            // Session validation successful

            true
        }

        fn check_permission(
            self: @ContractState, session: @SessionKey, required_permission: u8,
        ) -> bool {
            let mut i = 0;
            loop {
                if i >= session.permissions.len() {
                    break false;
                }
                if *session.permissions.at(i) == required_permission {
                    break true;
                }
                i += 1;
            }
        }

        fn check_and_reset_daily_limits(ref self: ContractState, player_addr: ContractAddress) {
            let mut world = self.world_default();
            let mut player: Player = world.read_model(player_addr);
            let current_timestamp = get_block_timestamp();
            let seconds_per_day: u64 = 86400;

            if current_timestamp >= player.last_action_reset + seconds_per_day {
                let _old_reset = player.last_action_reset;
                player.last_action_reset = current_timestamp;
                player.daily_fish_creations = 0;
                player.daily_decoration_creations = 0;
                player.daily_aquarium_creations = 0;
                world.write_model(@player);
                // Daily limits reset
            }
        }
    }
}
