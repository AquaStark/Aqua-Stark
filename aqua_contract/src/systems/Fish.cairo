// dojo decorator
#[dojo::contract]
pub mod Fish {
    use starknet::ContractAddress;
    use aqua_stark::interfaces::IFish::IFish;
    use aqua_stark::models::fish_model::{Fish, FishParents, Species, Listing, FishOwner, FishTrait};
    use aqua_stark::models::trade_model::FishLock;
    use aqua_stark::models::aquarium_model::{Aquarium, AquariumTrait};
    use aqua_stark::models::player_model::{Player, PlayerTrait};
    use aqua_stark::base::events::{
        FishCreated, FishBred, FishMoved, FishAddedToAquarium, FishPurchased, FishLocked,
    };

    #[abi(embed_v0)]
    impl FishImpl of IFish<ContractState> {
        fn get_fish_owner_for_auction(self: @ContractState, fish_id: u256) -> FishOwner {
            self.world_default().read_model(fish_id)
        }
        fn add_fish_to_aquarium(ref self: ContractState, mut fish: Fish, aquarium_id: u256) {
            let mut world = self.world_default();
            let mut aquarium: Aquarium = world.read_model(aquarium_id);
            assert(aquarium.housed_fish.len() < aquarium.max_capacity, 'Aquarium full');
            assert(fish.aquarium_id == aquarium_id, 'Fish in aquarium');
            assert(fish.owner == get_caller_address(), 'You do not own this fish');

            AquariumTrait::add_fish(aquarium.clone(), fish.id);
            world.write_model(@aquarium);
            world
                .emit_event(
                    @FishAddedToAquarium {
                        fish_id: fish.id, aquarium_id, timestamp: get_block_timestamp(),
                    },
                );
        }
        fn new_fish(ref self: ContractState, aquarium_id: u256, species: Species) -> Fish {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let mut aquarium: Aquarium = world.read_model(id);
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

            world.write_model(@aquarium);
            world.write_model(@player);
            world.write_model(@fish_owner);
            world.write_model(@fish);

            world
                .emit_event(
                    @FishCreated {
                        fish_id, owner: caller, aquarium_id, timestamp: get_block_timestamp(),
                    },
                );
            fish
        }
        fn move_fish_to_aquarium(
            ref self: ContractState, fish_id: u256, from: u256, to: u256,
        ) -> bool {
            let mut world = self.world_default();
            let mut fish: Fish = world.read_model(fish_id);
            assert(fish.aquarium_id == from, 'Fish not in source aquarium');
            let mut aquarium_from: Aquarium = world.read_model(from);
            let mut aquarium_to: Aquarium = world.read_model(to);
            assert(aquarium_to.housed_fish.len() < aquarium_to.max_capacity, 'Aquarium full');
            assert(aquarium_to.owner == get_caller_address(), 'You do not own this aquarium');

            aquarium_from = AquariumTrait::remove_fish(aquarium_from.clone(), fish_id);
            aquarium_to = AquariumTrait::add_fish(aquarium_to.clone(), fish_id);

            fish.aquarium_id = to;
            world.write_model(@fish);
            world.write_model(@aquarium_from);
            world.write_model(@aquarium_to);

            world.emit_event(@FishMoved { fish_id, from, to, timestamp: get_block_timestamp() });

            true
        }
        fn breed_fishes(ref self: ContractState, parent1_id: u256, parent2_id: u256) -> u256 {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let mut parent1: Fish = world.read_model(parent1_id);
            let mut parent2: Fish = world.read_model(parent2_id);
            let mut aquarium = self.get_aquarium(parent1.aquarium_id);
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

            let mut offspring_tree = parent1.family_tree.clone(); // or copy if supported
            offspring_tree.append(fish_parents);
            new_fish.family_tree = offspring_tree;

            aquarium.fish_count += 1;
            aquarium.housed_fish.append(new_fish.id);

            world.write_model(@aquarium);
            world.write_model(@parent1);
            world.write_model(@parent2);
            world.write_model(@player);
            world.write_model(@fish_owner);
            world.write_model(@new_fish);

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
            world.write_model(@listing);
            listing
        }
        fn purchase_fish(self: @ContractState, listing_id: felt252) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let mut listing: Listing = self.get_listing(listing_id);
            let mut player: Player = self.get_player(caller);
            let mut fish: Fish = world.read_model(listing.fish_id);
            assert(fish.owner != caller, 'You already own this fish');
            assert(listing.is_active, 'Listing is not active');

            // Store the original seller before transferring ownership
            let original_seller = fish.owner;

            // Purchase the fish
            let fish = FishTrait::purchase(fish, listing);
            player.fish_count += 1;
            player.player_fishes.append(fish.id);
            listing.is_active = false;

            world.write_model(@fish);
            world.write_model(@player);
            world.write_model(@listing);
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
        fn get_fish_lock_status(self: @ContractState, fish_id: u256) -> FishLock {
            let world = self.world_default();
            world.read_model(fish_id)
        }

        fn is_fish_locked(self: @ContractState, fish_id: u256) -> bool {
            let world = self.world_default();
            let fish_lock: FishLock = world.read_model(fish_id);
            FishLockTrait::is_locked(fish_lock)
        }
    }
    #[generate_trait]
    impl InternalImpl of InternalTrait {
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
