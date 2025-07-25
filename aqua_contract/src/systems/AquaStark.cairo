// dojo decorator
#[dojo::contract]
pub mod AquaStark {
    use dojo::world::IWorldDispatcherTrait;
    use aqua_stark::interfaces::IAquaStark::{IAquaStark};
    use aqua_stark::interfaces::ITransactionHistory::ITransactionHistory;
    use aqua_stark::base::events::{
        PlayerCreated, DecorationCreated, FishCreated, FishBred, FishMoved, DecorationMoved,
        FishAddedToAquarium, DecorationAddedToAquarium, EventTypeRegistered, PlayerEventLogged,
    };
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, get_block_timestamp,
        contract_address_const,
    };
    use aqua_stark::models::player_model::{
        Player, PlayerTrait, PlayerCounter, UsernameToAddress, AddressToUsername,
    };
    use aqua_stark::models::aquarium_model::{
        Aquarium, AquariumTrait, AquariumCounter, AquariumOwner,
    };
    use aqua_stark::models::decoration_model::{Decoration, DecorationCounter, DecorationTrait};
    use aqua_stark::models::fish_model::{
        Fish, FishCounter, Species, FishTrait, FishOwner, FishParents,
    };

    use aqua_stark::models::transaction_model::{
        TransactionLog, EventTypeDetails, EventCounter, TransactionCounter, event_id_target,
        transaction_id_target, EventDetailsTrait, TransactionLogTrait,
    };
    use aqua_stark::models::auctions_model::{
        Auction, AuctionCounter, AuctionStarted, BidPlaced, AuctionEnded,
    };
    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;


    #[abi(embed_v0)]
    impl AquaStarkImpl of IAquaStark<ContractState> {
        fn start_auction(
            ref self: ContractState, fish_id: u256, duration_secs: u64, reserve_price: u256,
        ) -> Auction {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Validate fish ownership and lock status
            let fish_owner: FishOwner = world.read_model(fish_id);
            assert!(fish_owner.owner == caller, "You don't own this fish");
            assert!(!fish_owner.locked, "Fish is already locked");

            // Lock the fish
            world.write_model(@FishOwner { id: fish_id, owner: caller, locked: true });

            // Get next auction ID
            let mut counter: AuctionCounter = world.read_model('auction_counter');
            let auction_id = counter.current_val;
            counter.current_val += 1;
            world.write_model(@counter);

            // Create new auction
            let current_time = get_block_timestamp();

            let auction = Auction {
                auction_id,
                seller: caller,
                fish_id,
                start_time: current_time,
                end_time: current_time + duration_secs,
                reserve_price,
                highest_bid: 0,
                highest_bidder: Option::None(()),
                active: true,
            };

            // Store auction
            world.write_model(@auction);

            // Emit event
            world
                .emit_event(
                    @AuctionStarted {
                        auction_id,
                        seller: caller,
                        fish_id,
                        start_time: current_time,
                        end_time: current_time + duration_secs,
                        reserve_price,
                    },
                );

            auction
        }

        fn place_bid(ref self: ContractState, auction_id: u256, amount: u256) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let current_time = get_block_timestamp();

            let mut auction: Auction = world.read_model(auction_id);

            // Validate auction
            assert!(auction.active, "Auction is not active");
            assert!(auction.start_time <= current_time, "Auction not started yet");
            assert!(auction.end_time > current_time, "Auction has ended");
            assert!(amount > auction.highest_bid, "Bid must be higher than current bid");
            assert!(amount >= auction.reserve_price, "Bid must meet reserve price");

            // Update auction
            auction.highest_bid = amount;
            auction.highest_bidder = Option::Some(caller);

            world.write_model(@auction);

            // Emit event
            world.emit_event(@BidPlaced { auction_id, bidder: caller, amount });
        }

        fn end_auction(ref self: ContractState, auction_id: u256) {
            let mut world = self.world_default();
            let current_time = get_block_timestamp();
            let mut auction: Auction = world.read_model(auction_id);

            // Validate auction can be ended
            assert!(auction.active, "Auction already ended");
            assert!(auction.end_time <= current_time, "Auction not yet ended");

            // Mark auction as inactive
            auction.active = false;
            world.write_model(@auction);

            // Transfer fish ownership if there was a winning bid
            match auction.highest_bidder {
                Option::Some(winner) => {
                    world
                        .write_model(
                            @FishOwner { id: auction.fish_id, owner: winner, locked: false },
                        );
                },
                Option::None(()) => {
                    // No winner, return fish to seller
                    world
                        .write_model(
                            @FishOwner {
                                id: auction.fish_id, owner: auction.seller, locked: false,
                            },
                        );
                },
            }

            // Emit event
            world
                .emit_event(
                    @AuctionEnded {
                        auction_id,
                        winner: auction.highest_bidder,
                        final_price: auction.highest_bid,
                    },
                );
        }

        fn get_active_auctions(self: @ContractState) -> Array<Auction> {
            let world = self.world_default();
            let current_time = get_block_timestamp();
            let mut active_auctions = ArrayTrait::new();

            // Get the current auction counter
            let counter: AuctionCounter = world.read_model('auction_counter');

            // Check all possible auctions
            let mut i = 0;
            loop {
                if i >= counter.current_val {
                    break;
                }

                let auction: Auction = world.read_model(i);
                if auction.active && auction.end_time > current_time {
                    active_auctions.append(auction);
                }

                i += 1;
            };

            active_auctions
        }

        fn get_auction_by_id(self: @ContractState, auction_id: u256) -> Auction {
            self.world_default().read_model(auction_id)
        }

        fn get_username_from_address(self: @ContractState, address: ContractAddress) -> felt252 {
            let mut world = self.world_default();

            let address_map: AddressToUsername = world.read_model(address);

            address_map.username
        }

        fn new_aquarium(
            ref self: ContractState,
            owner: ContractAddress,
            max_capacity: u32,
            max_decorations: u32,
        ) -> Aquarium {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let aquarium_id = self.create_aquarium_id();
            let mut aquarium: Aquarium = world.read_model(aquarium_id);
            aquarium =
                AquariumTrait::create_aquarium(aquarium_id, owner, max_capacity, max_decorations);

            let mut aquarium_owner: AquariumOwner = world.read_model(aquarium_id);
            aquarium_owner.owner = caller;

            let mut player: Player = world.read_model(caller);
            player.aquarium_count += 1;
            player.player_aquariums.append(aquarium.id);
            world.write_model(@player);

            world.write_model(@aquarium_owner);
            world.write_model(@aquarium);

            aquarium
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
            world
                .emit_event(
                    @DecorationAddedToAquarium {
                        decoration_id: decoration.id, aquarium_id, timestamp: get_block_timestamp(),
                    },
                );
        }

        fn new_decoration(
            ref self: ContractState,
            aquarium_id: u256,
            name: felt252,
            description: felt252,
            price: u256,
            rarity: felt252,
        ) -> Decoration {
            let mut world = self.world_default();
            let mut aquarium = self.get_aquarium(aquarium_id);
            assert(aquarium.owner == get_caller_address(), 'You do not own this aquarium');
            let id = self.create_decoration_id();

            let mut decoration = world.read_model(id);

            decoration =
                DecorationTrait::decoration(
                    decoration, id, aquarium_id, name, description, price, rarity,
                );

            let mut player: Player = world.read_model(get_caller_address());
            player.decoration_count += 1;
            player.player_decorations.append(decoration.id);
            aquarium = AquariumTrait::add_decoration(aquarium.clone(), decoration.id);

            world.write_model(@aquarium);
            world.write_model(@player);
            world.write_model(@decoration);

            world
                .emit_event(
                    @DecorationCreated {
                        id,
                        aquarium_id,
                        owner: get_caller_address(),
                        name,
                        rarity,
                        price,
                        timestamp: get_block_timestamp(),
                    },
                );

            decoration
        }

        fn new_fish(ref self: ContractState, aquarium_id: u256, species: Species) -> Fish {
            let mut world = self.world_default();
            let caller = get_caller_address();
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

        fn move_decoration_to_aquarium(
            ref self: ContractState, decoration_id: u256, from: u256, to: u256,
        ) -> bool {
            let mut world = self.world_default();
            let mut decoration: Decoration = world.read_model(decoration_id);
            assert(decoration.aquarium_id == from, 'Decoration not in aquarium');
            let mut aquarium_from: Aquarium = world.read_model(from);
            let mut aquarium_to: Aquarium = world.read_model(to);
            assert(
                aquarium_to.housed_decorations.len() < aquarium_to.max_decorations,
                'Aquarium deco limit reached',
            );
            assert(aquarium_to.owner == get_caller_address(), 'You do not own this aquarium');

            aquarium_from = AquariumTrait::remove_decoration(aquarium_from.clone(), decoration_id);
            aquarium_to = AquariumTrait::add_decoration(aquarium_to.clone(), decoration_id);

            decoration.aquarium_id = to;
            world.write_model(@decoration);
            world.write_model(@aquarium_from);
            world.write_model(@aquarium_to);
            world
                .emit_event(
                    @DecorationMoved { decoration_id, from, to, timestamp: get_block_timestamp() },
                );
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

        fn register(ref self: ContractState, username: felt252) {
            let mut world = self.world_default();
            let player = get_caller_address();

            // Constants
            let zero_address: ContractAddress = contract_address_const::<0x0>();

            // --- Validations ---

            // Username should not be zero
            assert(username != 0, 'USERNAME CANNOT BE ZERO');

            // Username must be unique (not already registered)
            let existing_player: UsernameToAddress = world.read_model(username);
            assert(existing_player.address == zero_address, 'USERNAME ALREADY TAKEN');

            // Address must not already be registered
            let existing_username = self.get_username_from_address(player);
            assert(existing_username == 0, 'USERNAME ALREADY CREATED');
            // --- Player Registration ---

            let id = self.create_new_player_id();

            let mut new_player = PlayerTrait::register_player(id, username, player, 0, 0);

            // --- Username ↔ Address Mappings ---

            let username_to_address = UsernameToAddress { username, address: player };
            let address_to_username = AddressToUsername { address: player, username };

            // --- Aquarium Setup ---

            let mut aquarium = self.new_aquarium(player, 10, 5);

            new_player.aquarium_count += 1;
            let aquarium_id = aquarium.id;
            new_player.player_aquariums.append(aquarium.id);

            let fish = self.new_fish(aquarium.id, Species::GoldFish);
            new_player.fish_count += 1;
            new_player.player_fishes.append(fish.id);
            let fish_id = fish.id;

            let decoration = self.new_decoration(aquarium.id, 'Pebbles', 'Shiny rocks', 0, 0);
            new_player.decoration_count += 1;
            new_player.player_decorations.append(decoration.id);
            let decoration_id = decoration.id;

            aquarium.fish_count += 1;
            aquarium.housed_fish.append(fish.id);
            aquarium.housed_decorations.append(decoration.id);
            aquarium.decoration_count += 1;

            // --- Persist to Storage ---
            world.write_model(@aquarium);
            world.write_model(@new_player);
            world.write_model(@username_to_address);
            world.write_model(@address_to_username);

            // --- Emit Event ---
            world
                .emit_event(
                    @PlayerCreated {
                        username,
                        player,
                        player_id: id,
                        aquarium_id,
                        decoration_id,
                        fish_id,
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn is_verified(self: @ContractState, player: ContractAddress) -> bool {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            player_model.is_verified
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
    }


    #[abi(embed_v0)]
    impl TransactionHistoryImpl of ITransactionHistory<ContractState> {
        fn register_event_type(ref self: ContractState, event_name: ByteArray) -> u256 {
            let mut world = self.world_default();
            let caller = get_caller_address();

            assert(world.dispatcher.is_owner(0, caller), 'Only owner');

            assert(event_name.len() != 0, 'Event name cannot be empty');

            // assert that caller is dojo creator
            let event_type_id = self.create_event_id();
            let mut event_details: EventTypeDetails = world.read_model(event_type_id);
            event_details = EventDetailsTrait::create_event(event_type_id, event_name);
            world.write_model(@event_details);

            // --- Emit Event ---
            world
                .emit_event(
                    @EventTypeRegistered {
                        event_type_id: event_type_id.clone(), timestamp: get_block_timestamp(),
                    },
                );

            event_type_id
        }

        fn log_event(
            ref self: ContractState,
            event_type_id: u256,
            player: ContractAddress,
            payload: Array<felt252>,
        ) -> TransactionLog {
            let mut world = self.world_default();
            let txn_id = self.create_transaction_id();

            let caller = get_caller_address();

            let is_owner = world.dispatcher.is_owner(0, caller);
            let is_contract = get_contract_address() == caller;

            assert(is_owner || is_contract, 'Only owner or contract');

            let mut event_details: EventTypeDetails = world.read_model(event_type_id);

            event_details.total_logged += 1;
            event_details.transaction_history.append(txn_id);

            let mut transaction_event: TransactionLog = world.read_model(txn_id);
            transaction_event =
                TransactionLogTrait::log_transaction(txn_id, event_type_id, player, payload);

            let mut player_details: Player = world.read_model(player);
            player_details.transaction_count += 1;
            player_details.transaction_history.append(txn_id);

            world.write_model(@event_details);
            world.write_model(@transaction_event);
            world.write_model(@player_details);

            world
                .emit_event(
                    @PlayerEventLogged {
                        id: txn_id, event_type_id, player, timestamp: get_block_timestamp(),
                    },
                );

            transaction_event
        }

        fn get_event_types_count(self: @ContractState) -> u256 {
            let world = self.world_default();
            let event_counter: EventCounter = world.read_model(event_id_target());
            event_counter.current_val
        }

        fn get_event_type_details(self: @ContractState, event_type_id: u256) -> EventTypeDetails {
            let world = self.world_default();
            world.read_model(event_type_id)
        }

        fn get_all_event_types(self: @ContractState) -> Span<EventTypeDetails> {
            let world = self.world_default();
            let event_counter: EventCounter = world.read_model(event_id_target());
            let event_count = event_counter.current_val;
            let mut all_events: Array<EventTypeDetails> = array![];

            for i in 0..event_count {
                let event_details: EventTypeDetails = world.read_model(i);
                all_events.append(event_details);
            };

            all_events.span()
        }

        fn get_transaction_count(self: @ContractState) -> u256 {
            let world = self.world_default();
            let txn_counter: TransactionCounter = world.read_model(transaction_id_target());
            txn_counter.current_val
        }

        fn get_transaction_history(
            self: @ContractState,
            player: Option<ContractAddress>,
            event_type_id: Option<u256>,
            start: Option<u32>,
            limit: Option<u32>,
            start_timestamp: Option<u64>,
            end_timestamp: Option<u64>,
        ) -> Span<TransactionLog> {
            let world = self.world_default();
            let start_index = start.unwrap_or_default();
            let lim = limit.unwrap_or(50);
            let s_timestamp = start_timestamp.unwrap_or_default();
            let e_timestamp = end_timestamp.unwrap_or(get_block_timestamp());

            if let Option::Some(player_addr) = player {
                let player_data: Player = world.read_model(player_addr);

                let mut i = start_index;
                let mut count = 0;
                let mut player_history: Array<TransactionLog> = array![];

                while i < player_data.transaction_count && count < lim {
                    let txn_event_id = player_data.transaction_history.at(i);

                    if let Option::Some(event_id) = event_type_id {
                        if @event_id != txn_event_id {
                            i += 1;
                            continue;
                        }
                    }

                    let txn_log: TransactionLog = world.read_model(*txn_event_id);

                    if txn_log.timestamp >= s_timestamp && txn_log.timestamp <= e_timestamp {
                        player_history.append(txn_log);
                    }
                    count += 1;
                    i += 1;
                };

                return player_history.span();
            }

            if let Option::Some(event_id) = event_type_id {
                let event_details: EventTypeDetails = world.read_model(event_id);

                let mut i = start_index;
                let mut count = 0;
                let mut event_history: Array<TransactionLog> = array![];

                while i < event_details.total_logged && count < lim {
                    let txn_event_id = event_details.transaction_history.at(i);

                    let txn_log: TransactionLog = world.read_model(*txn_event_id);

                    if txn_log.timestamp >= s_timestamp && txn_log.timestamp <= e_timestamp {
                        event_history.append(txn_log);
                    }
                    count += 1;
                    i += 1;
                };

                return event_history.span();
            }

            let total_transactions = self.get_transaction_count();

            let mut i: u256 = start_index.into() + 1;
            let mut count = 0;

            let mut transaction_history: Array<TransactionLog> = array![];

            while i <= total_transactions && count < lim {
                let txn_log: TransactionLog = world.read_model(i);

                if txn_log.timestamp >= s_timestamp && txn_log.timestamp <= e_timestamp {
                    transaction_history.append(txn_log);
                }
                count += 1;
                i += 1;
            };

            transaction_history.span()
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "aqua_stark". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }

        fn create_new_player_id(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let mut game_counter: PlayerCounter = world.read_model('v0');
            let new_val = game_counter.current_val + 1;
            game_counter.current_val = new_val;
            world.write_model(@game_counter);
            new_val
        }

        fn create_decoration_id(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let mut decoration_counter: DecorationCounter = world.read_model('v0');
            let new_val = decoration_counter.current_val + 1;
            decoration_counter.current_val = new_val;
            world.write_model(@decoration_counter);
            new_val
        }

        fn create_aquarium_id(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let mut aquarium_counter: AquariumCounter = world.read_model('v0');
            let new_val = aquarium_counter.current_val + 1;
            aquarium_counter.current_val = new_val;
            world.write_model(@aquarium_counter);
            new_val
        }

        fn create_fish_id(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let mut fish_counter: FishCounter = world.read_model('v0');
            let new_val = fish_counter.current_val + 1;
            fish_counter.current_val = new_val;
            world.write_model(@fish_counter);
            new_val
        }

        fn create_event_id(self: @ContractState) -> u256 {
            let mut world = self.world_default();
            let mut event_counter: EventCounter = world.read_model(event_id_target());
            let new_id = event_counter.current_val + 1;
            event_counter.current_val = new_id;
            world.write_model(@event_counter);
            new_id
        }

        fn create_transaction_id(self: @ContractState) -> u256 {
            let mut world = self.world_default();
            let mut txn_counter: TransactionCounter = world.read_model(transaction_id_target());
            let new_id = txn_counter.current_val + 1;
            txn_counter.current_val = new_id;
            world.write_model(@txn_counter);
            new_id
        }
    }
}
