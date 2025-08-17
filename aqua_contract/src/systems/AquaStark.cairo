// dojo decorator
#[dojo::contract]
pub mod AquaStark {
    use aqua_stark::base::events::{
        PlayerCreated, DecorationCreated, FishCreated, FishBred, FishMoved, DecorationMoved,
        FishAddedToAquarium, DecorationAddedToAquarium, EventTypeRegistered, PlayerEventLogged,
        FishPurchased, TradeOfferCreated, TradeOfferAccepted, TradeOfferCancelled, FishLocked,
        FishUnlocked, AquariumCreated,
    };
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, get_block_timestamp,
        contract_address_const,
    };
    use aqua_stark::models::player_model::{
        Player, PlayerTrait, PlayerCounter, UsernameToAddress, AddressToUsername,
        DecorationAddedToAquarium, DecorationCreated, DecorationMoved, EventTypeRegistered,
        FishAddedToAquarium, FishBred, FishCreated, FishLocked, FishMoved, FishPurchased,
        FishUnlocked, PlayerCreated, PlayerEventLogged, TradeOfferAccepted, TradeOfferCancelled,
        TradeOfferCreated,

    };
    use aqua_stark::interfaces::IAquaStark::IAquaStark;
    use aqua_stark::interfaces::ITransactionHistory::ITransactionHistory;
    use aqua_stark::models::aquarium_model::{
        Aquarium, AquariumCounter, AquariumOwner, AquariumTrait,
    };
    use aqua_stark::models::decoration_model::{Decoration, DecorationCounter, DecorationTrait};
    use aqua_stark::models::fish_model::{
        Fish, FishCounter, FishOwner, FishParents, FishTrait, Listing, Species,
    };
    use aqua_stark::models::player_model::{
        AddressToUsername, Player, PlayerCounter, PlayerTrait, UsernameToAddress,
    };
    use aqua_stark::models::trade_model::{
        ActiveTradeOffers, FishLock, FishLockTrait, MatchCriteria, TradeOffer, TradeOfferCounter,
        TradeOfferStatus, TradeOfferTrait, trade_offer_id_target,
    };
    use aqua_stark::models::transaction_model::{
        EventCounter, EventDetailsTrait, EventTypeDetails, TransactionCounter, TransactionLog,
        TransactionLogTrait, event_id_target, transaction_id_target,
    };
    use core::traits::Into;
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use dojo::world::IWorldDispatcherTrait;
    use starknet::{
        ContractAddress, contract_address_const, get_block_timestamp, get_caller_address,
        get_contract_address,
    };


    #[abi(embed_v0)]
    impl AquaStarkImpl of IAquaStark<ContractState> {
        fn get_fish_owner_for_auction(self: @ContractState, fish_id: u256) -> FishOwner {
            self.world_default().read_model(fish_id)
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
            // Delegate to aquarium contract
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

            world
                .emit_event(
                    @AquariumCreated {
                        aquarium_id,
                        owner,
                        max_capacity,
                        max_decorations,
                        timestamp: get_block_timestamp(),
                    },
                );

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

        fn list_fish(self: @ContractState, fish_id: u256, price: u256) -> Listing {
            let mut world = self.world_default();
            let fish: Fish = world.read_model(fish_id);
            let listing: Listing = FishTrait::list(fish, price);
            world.write_model(@listing);
            listing
        }

        fn get_listing(self: @ContractState, listing_id: felt252) -> Listing {
            let mut world = self.world_default();
            let listing: Listing = world.read_model(listing_id);
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

        fn create_trade_offer(
            ref self: ContractState,
            offered_fish_id: u256,
            criteria: MatchCriteria,
            requested_fish_id: Option<u256>,
            requested_species: Option<u8>,
            requested_generation: Option<u8>,
            requested_traits: Span<felt252>,
            duration_hours: u64,
        ) -> u256 {
            let mut world = self.world_default();
            let caller = get_caller_address();

            let fish_owner: FishOwner = world.read_model(offered_fish_id);
            assert(fish_owner.owner == caller, 'You do not own this fish');

            let fish_lock: FishLock = world.read_model(offered_fish_id);
            assert(!FishLockTrait::is_locked(fish_lock), 'Fish is already locked');

            let offer_id = self.create_trade_offer_id();

            let trade_offer = TradeOfferTrait::create_offer(
                offer_id,
                caller,
                offered_fish_id,
                criteria,
                requested_fish_id,
                requested_species,
                requested_generation,
                requested_traits,
                duration_hours,
            );

            let fish_lock = FishLockTrait::lock_fish(offered_fish_id, offer_id);

            let mut active_offers: ActiveTradeOffers = world.read_model(caller);
            active_offers.offers.append(offer_id);

            world.write_model(@trade_offer);
            world.write_model(@fish_lock);
            world.write_model(@active_offers);

            world
                .emit_event(
                    @TradeOfferCreated {
                        offer_id,
                        creator: caller,
                        offered_fish_id,
                        criteria,
                        requested_fish_id,
                        requested_species,
                        requested_generation,
                        expires_at: trade_offer.expires_at,
                    },
                );

            world
                .emit_event(
                    @FishLocked {
                        fish_id: offered_fish_id,
                        owner: caller,
                        locked_by_offer: offer_id,
                        timestamp: get_block_timestamp(),
                    },
                );

            offer_id
        }

        fn accept_trade_offer(
            ref self: ContractState, offer_id: u256, offered_fish_id: u256,
        ) -> bool {
            let mut world = self.world_default();
            let caller = get_caller_address();

            let mut trade_offer: TradeOffer = world.read_model(offer_id);
            assert(TradeOfferTrait::is_active(@trade_offer), 'Offer not active');
            assert(trade_offer.creator != caller, 'Cannot accept own offer');

            trade_offer = TradeOfferTrait::lock_offer(trade_offer);
            world.write_model(@trade_offer);

            let acceptor_fish_owner: FishOwner = world.read_model(offered_fish_id);
            assert(acceptor_fish_owner.owner == caller, 'You do not own this fish');

            let acceptor_fish_lock: FishLock = world.read_model(offered_fish_id);
            assert(!FishLockTrait::is_locked(acceptor_fish_lock), 'Your fish is locked');

            let creator_fish: Fish = world.read_model(trade_offer.offered_fish_id);
            let acceptor_fish: Fish = world.read_model(offered_fish_id);

            let fish_species: u8 = acceptor_fish.species.into();

            let fish_traits = array![acceptor_fish.color].span();

            assert(
                TradeOfferTrait::matches_criteria(
                    @trade_offer,
                    offered_fish_id,
                    fish_species,
                    acceptor_fish.generation,
                    fish_traits,
                ),
                'Fish does not match criteria',
            );

            // Perform the trade - swap ownership
            let mut creator_fish_owner: FishOwner = world.read_model(trade_offer.offered_fish_id);
            let mut acceptor_fish_owner: FishOwner = world.read_model(offered_fish_id);

            // Swap owners
            let temp_owner = creator_fish_owner.owner;
            creator_fish_owner.owner = acceptor_fish_owner.owner;
            acceptor_fish_owner.owner = temp_owner;

            // Update fish ownership in the fish models
            let mut creator_fish_updated = creator_fish;
            let mut acceptor_fish_updated = acceptor_fish;
            creator_fish_updated.owner = caller;
            acceptor_fish_updated.owner = trade_offer.creator;

            let creator_fish_unlock = FishLockTrait::unlock_fish(trade_offer.offered_fish_id);
            let acceptor_fish_unlock = FishLockTrait::unlock_fish(offered_fish_id);

            trade_offer = TradeOfferTrait::complete_offer(trade_offer);

            world.write_model(@creator_fish_owner);
            world.write_model(@acceptor_fish_owner);
            world.write_model(@creator_fish_updated);
            world.write_model(@acceptor_fish_updated);
            world.write_model(@creator_fish_unlock);
            world.write_model(@acceptor_fish_unlock);
            world.write_model(@trade_offer);

            world
                .emit_event(
                    @TradeOfferAccepted {
                        offer_id,
                        acceptor: caller,
                        creator: trade_offer.creator,
                        creator_fish_id: trade_offer.offered_fish_id,
                        acceptor_fish_id: offered_fish_id,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @FishUnlocked {
                        fish_id: trade_offer.offered_fish_id,
                        owner: caller,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @FishUnlocked {
                        fish_id: offered_fish_id,
                        owner: trade_offer.creator,
                        timestamp: get_block_timestamp(),
                    },
                );

            true
        }

        fn cancel_trade_offer(ref self: ContractState, offer_id: u256) -> bool {
            let mut world = self.world_default();
            let caller = get_caller_address();

            let mut trade_offer: TradeOffer = world.read_model(offer_id);
            assert(trade_offer.creator == caller, 'Not offer creator');
            assert(trade_offer.status == TradeOfferStatus::Active, 'Offer not active');

            trade_offer = TradeOfferTrait::cancel_offer(trade_offer);

            let fish_unlock = FishLockTrait::unlock_fish(trade_offer.offered_fish_id);

            world.write_model(@trade_offer);
            world.write_model(@fish_unlock);

            world
                .emit_event(
                    @TradeOfferCancelled {
                        offer_id,
                        creator: caller,
                        offered_fish_id: trade_offer.offered_fish_id,
                        timestamp: get_block_timestamp(),
                    },
                );

            world
                .emit_event(
                    @FishUnlocked {
                        fish_id: trade_offer.offered_fish_id,
                        owner: caller,
                        timestamp: get_block_timestamp(),
                    },
                );

            true
        }

        fn get_trade_offer(self: @ContractState, offer_id: u256) -> TradeOffer {
            let world = self.world_default();
            world.read_model(offer_id)
        }

        fn get_active_trade_offers(
            self: @ContractState, creator: ContractAddress,
        ) -> Array<TradeOffer> {
            let world = self.world_default();
            let active_offers: ActiveTradeOffers = world.read_model(creator);
            let mut offers = array![];
            let mut i = 0;
            loop {
                if i >= active_offers.offers.len() {
                    break;
                }
                let offer_id = *active_offers.offers.at(i);
                let offer: TradeOffer = world.read_model(offer_id);
                if offer.status == TradeOfferStatus::Active {
                    offers.append(offer);
                }
                i += 1;
            };
            offers
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

        fn create_trade_offer_id(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let mut trade_counter: TradeOfferCounter = world.read_model(trade_offer_id_target());
            let new_val = trade_counter.current_val + 1;
            trade_counter.current_val = new_val;
            world.write_model(@trade_counter);
            new_val
        }
    }
}
