#[dojo::contract]
pub mod Trade {
    use dojo::world::IWorldDispatcherTrait;
    use aqua_stark::interfaces::ITrade::{ITrade};
    use aqua_stark::interfaces::IAquaStark::{IAquaStarkDispatcher, IAquaStarkDispatcherTrait};
    use aqua_stark::base::events::{
        TradeOfferCreated, TradeOfferAccepted, TradeOfferCancelled, FishLocked, FishUnlocked,
        TradeOfferExpired,
    };
    use starknet::{
        ContractAddress, get_caller_address, get_block_timestamp,
        contract_address_const,
    };

    use aqua_stark::models::fish_model::{Fish, FishOwner, Species};
    use aqua_stark::models::trade_model::{
        TradeOffer, TradeOfferStatus, MatchCriteria, FishLock, TradeOfferCounter, ActiveTradeOffers,
        TradeOfferTrait, FishLockTrait, trade_offer_id_target,
    };

    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;


    #[abi(embed_v0)]
    impl TradeImpl of ITrade<ContractState> {
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

            // Validate fish ownership through AquaStark contract
            let aqua_stark_address = self.get_aqua_stark_address();
            let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };
            
            // Verify fish exists in AquaStark
            let _ = aqua_stark.get_fish(offered_fish_id);

            let fish_owner: FishOwner = world.read_model(offered_fish_id);
            assert(fish_owner.owner == caller, 'You do not own this fish');

            // Check if fish is already locked
            let fish_lock: FishLock = world.read_model(offered_fish_id);
            assert(!FishLockTrait::is_locked(fish_lock), 'Fish is already locked');

            // Validate duration
            assert(duration_hours > 0 && duration_hours <= 168, 'Invalid duration (1-168 hours)');

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

            // Lock the fish
            let fish_lock = FishLockTrait::lock_fish(offered_fish_id, offer_id);

            // Update active offers for creator
            let mut active_offers: ActiveTradeOffers = world.read_model(caller);
            active_offers.offers.append(offer_id);

            // Persist to storage
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

            let aqua_stark_address = self.get_aqua_stark_address();
            let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };
            
            let _ = aqua_stark.get_fish(trade_offer.offered_fish_id);
            let _ = aqua_stark.get_fish(offered_fish_id);

            assert(TradeOfferTrait::is_active(@trade_offer), 'Offer not active');
            assert(trade_offer.creator != caller, 'Cannot accept own offer');

            if TradeOfferTrait::is_expired(@trade_offer) {
                self._expire_offer(offer_id);
                panic!("Offer has expired");
            }

            // Lock the offer during processing
            trade_offer = TradeOfferTrait::lock_offer(trade_offer);
            world.write_model(@trade_offer);

            // Validate acceptor's fish ownership
            let acceptor_fish_owner: FishOwner = world.read_model(offered_fish_id);
            assert(acceptor_fish_owner.owner == caller, 'You do not own this fish');

            // Check if acceptor's fish is locked
            let acceptor_fish_lock: FishLock = world.read_model(offered_fish_id);
            assert(!FishLockTrait::is_locked(acceptor_fish_lock), 'Your fish is locked');

            // Get fish details for criteria matching
            let creator_fish: Fish = world.read_model(trade_offer.offered_fish_id);
            let acceptor_fish: Fish = world.read_model(offered_fish_id);

            // Convert species to u8 for matching
            let fish_species = match acceptor_fish.species {
                Species::AngelFish => 0_u8,
                Species::GoldFish => 1_u8,
                Species::Betta => 2_u8,
                Species::NeonTetra => 3_u8,
                Species::Corydoras => 4_u8,
                Species::Hybrid => 5_u8,
            };

            let fish_traits = array![acceptor_fish.color].span();

            // Validate matching criteria
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

            // Perform the ownership swap
            let mut creator_fish_owner: FishOwner = world.read_model(trade_offer.offered_fish_id);
            let mut acceptor_fish_owner: FishOwner = world.read_model(offered_fish_id);

            let temp_owner = creator_fish_owner.owner;
            creator_fish_owner.owner = acceptor_fish_owner.owner;
            acceptor_fish_owner.owner = temp_owner;

            // Update fish models with new ownership
            let mut creator_fish_updated = creator_fish;
            let mut acceptor_fish_updated = acceptor_fish;
            creator_fish_updated.owner = caller;
            acceptor_fish_updated.owner = trade_offer.creator;

            // Unlock both fish
            let creator_fish_unlock = FishLockTrait::unlock_fish(trade_offer.offered_fish_id);
            let acceptor_fish_unlock = FishLockTrait::unlock_fish(offered_fish_id);

            // Complete the trade offer
            trade_offer = TradeOfferTrait::complete_offer(trade_offer);

            // Persist all changes
            world.write_model(@creator_fish_owner);
            world.write_model(@acceptor_fish_owner);
            world.write_model(@creator_fish_updated);
            world.write_model(@acceptor_fish_updated);
            world.write_model(@creator_fish_unlock);
            world.write_model(@acceptor_fish_unlock);
            world.write_model(@trade_offer);

            // Emit comprehensive events
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

            // Cancel the offer
            trade_offer = TradeOfferTrait::cancel_offer(trade_offer);

            // Unlock the fish
            let fish_unlock = FishLockTrait::unlock_fish(trade_offer.offered_fish_id);

            // Persist changes
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
                if offer.status == TradeOfferStatus::Active
                    && !TradeOfferTrait::is_expired(@offer) {
                    offers.append(offer);
                }
                i += 1;
            };
            offers
        }

        fn get_all_active_offers(self: @ContractState) -> Array<TradeOffer> {
            let world = self.world_default();
            let trade_counter: TradeOfferCounter = world.read_model(trade_offer_id_target());
            let total_offers = trade_counter.current_val;
            let mut active_offers = array![];

            let mut i = 1;
            loop {
                if i > total_offers {
                    break;
                }
                let offer: TradeOffer = world.read_model(i);
                if offer.status == TradeOfferStatus::Active
                    && !TradeOfferTrait::is_expired(@offer) {
                    active_offers.append(offer);
                }
                i += 1;
            };
            active_offers
        }

        fn get_offers_for_fish(self: @ContractState, fish_id: u256) -> Array<TradeOffer> {
            let world = self.world_default();
            let trade_counter: TradeOfferCounter = world.read_model(trade_offer_id_target());
            let total_offers = trade_counter.current_val;
            let mut matching_offers = array![];

            let mut i = 1;
            loop {
                if i > total_offers {
                    break;
                }
                let offer: TradeOffer = world.read_model(i);
                if offer.offered_fish_id == fish_id && offer.status == TradeOfferStatus::Active {
                    matching_offers.append(offer);
                }
                i += 1;
            };
            matching_offers
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

        fn cleanup_expired_offers(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let trade_counter: TradeOfferCounter = world.read_model(trade_offer_id_target());
            let total_offers = trade_counter.current_val;
            let mut expired_count = 0;

            let mut i = 1;
            loop {
                if i > total_offers {
                    break;
                }
                let offer: TradeOffer = world.read_model(i);
                if offer.status == TradeOfferStatus::Active && TradeOfferTrait::is_expired(@offer) {
                    self._expire_offer(i);
                    expired_count += 1;
                }
                i += 1;
            };

            expired_count
        }

        fn get_total_trades_count(self: @ContractState) -> u256 {
            let world = self.world_default();
            let trade_counter: TradeOfferCounter = world.read_model(trade_offer_id_target());
            trade_counter.current_val
        }

        fn get_user_trade_count(self: @ContractState, user: ContractAddress) -> u256 {
            let world = self.world_default();
            let active_offers: ActiveTradeOffers = world.read_model(user);
            active_offers.offers.len().into()
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "aqua_stark". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }

        fn create_trade_offer_id(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let mut trade_counter: TradeOfferCounter = world.read_model(trade_offer_id_target());
            let new_val = trade_counter.current_val + 1;
            trade_counter.current_val = new_val;
            world.write_model(@trade_counter);
            new_val
        }



        fn get_aqua_stark_address(self: @ContractState) -> ContractAddress {
            // This should be set to the actual AquaStark contract address during deployment
            contract_address_const::<0x1234567890abcdef>()
        }

        fn _expire_offer(ref self: ContractState, offer_id: u256) {
            let mut world = self.world_default();
            let mut offer: TradeOffer = world.read_model(offer_id);

            if offer.status == TradeOfferStatus::Active {
                offer.status = TradeOfferStatus::Expired;

                // Unlock the fish
                let fish_unlock = FishLockTrait::unlock_fish(offer.offered_fish_id);

                world.write_model(@offer);
                world.write_model(@fish_unlock);

                world
                    .emit_event(
                        @TradeOfferExpired {
                            offer_id,
                            creator: offer.creator,
                            offered_fish_id: offer.offered_fish_id,
                            timestamp: get_block_timestamp(),
                        },
                    );

                world
                    .emit_event(
                        @FishUnlocked {
                            fish_id: offer.offered_fish_id,
                            owner: offer.creator,
                            timestamp: get_block_timestamp(),
                        },
                    );
            }
        }
    }
}
