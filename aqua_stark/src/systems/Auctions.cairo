use aqua_stark::models::auctions_model::Auction;

#[starknet::interface]
pub trait IAquaAuction<T> {
    fn start_auction(
        ref self: T, fish_id: u256, duration_secs: u64, reserve_price: u256,
    ) -> Auction;

    fn place_bid(ref self: T, auction_id: u256, amount: u256);
    fn end_auction(ref self: T, auction_id: u256);
    fn get_active_auctions(self: @T) -> Array<Auction>;
    fn get_auction_by_id(self: @T, auction_id: u256) -> Auction;
}


#[dojo::contract]
pub mod AquaAuction {
    use super::IAquaAuction;
    use aqua_stark::models::auctions_model::*;
    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;
    use starknet::{get_block_timestamp, get_caller_address, ContractAddress};
    // Session system imports
    use aqua_stark::models::session::{
        SessionKey, SessionAnalytics, SESSION_STATUS_ACTIVE,
         SESSION_TYPE_PREMIUM,
        PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE, PERMISSION_ADMIN,
    };
    use aqua_stark::helpers::session_validation::{
         SessionValidationImpl, MIN_SESSION_DURATION, 
        AUTO_RENEWAL_THRESHOLD, MAX_TRANSACTIONS_PER_SESSION,
    };

    #[abi(embed_v0)]
    impl AquaAuctionImpl of IAquaAuction<ContractState> {
        fn start_auction(
            ref self: ContractState, fish_id: u256, duration_secs: u64, reserve_price: u256,
        ) -> Auction {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Get or create unified session
            let session_id = self.get_or_create_session(caller);
            self.validate_and_update_session(session_id, PERMISSION_TRADE);

            // Validate fish ownership and lock status
            let fish_owner: FishOwnerA = world.read_model(fish_id);
            assert!(fish_owner.owner == caller, "You don't own this fish");
            assert!(!fish_owner.locked, "Fish is already locked");

            // Lock the fish
            world.write_model(@FishOwnerA { fish_id, owner: caller, locked: true });

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

            // Get or create unified session
            let session_id = self.get_or_create_session(caller);
            self.validate_and_update_session(session_id, PERMISSION_TRADE);

            let mut auction: Auction = world.read_model(auction_id);

            let min_bid_amount = auction.highest_bid + (auction.highest_bid * 5) / 100;

            // Validate auction
            assert!(auction.active, "Auction is not active");
            assert!(auction.start_time <= current_time, "Auction not started yet");
            assert!(auction.end_time > current_time, "Auction has ended");
            assert!(amount > min_bid_amount, "Bid must be higher than current bid");
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
            let caller = get_caller_address();

            // Get or create unified session
            let session_id = self.get_or_create_session(caller);
            self.validate_and_update_session(session_id, PERMISSION_TRADE);

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
                            @FishOwnerA { fish_id: auction.fish_id, owner: winner, locked: false },
                        );
                },
                Option::None(()) => {
                    // No winner, return fish to seller
                    world
                        .write_model(
                            @FishOwnerA {
                                fish_id: auction.fish_id, owner: auction.seller, locked: false,
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
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_auction")
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
    }
}
