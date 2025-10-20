#[dojo::contract]
pub mod ShopCatalog {
    use dojo::model::{ModelStorage};
    use starknet::{get_contract_address, get_caller_address, ContractAddress, get_block_timestamp};
    use aqua_stark::models::shop_model::{ShopItemModel, ShopCatalogModel};
    use aqua_stark::interfaces::IShopCatalog::IShopCatalog;
    // Session system imports
    use aqua_stark::models::session::{
        SessionKey, SessionAnalytics, SESSION_STATUS_ACTIVE,
          SESSION_TYPE_PREMIUM,         PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE, PERMISSION_ADMIN,
    };
    use aqua_stark::helpers::session_validation::{
         SessionValidationImpl, MIN_SESSION_DURATION,         AUTO_RENEWAL_THRESHOLD, MAX_TRANSACTIONS_PER_SESSION,
    };

    fn dojo_init(ref self: ContractState, owner: ContractAddress) {
        let mut world = self.world(@"aqua_stark");
        let shop_catalog = ShopCatalogModel {
            id: get_contract_address(), owner: owner, shopItems: 0, latest_item_id: 0,
        };
        world.write_model(@shop_catalog);
    }

    #[abi(embed_v0)]
    impl ShopCatalogImpl of IShopCatalog<ContractState> {
        fn add_new_item(
            self: @ContractState, price: u256, stock: u256, description: felt252,
        ) -> u256 {
            // inputs must be non-zero
            assert(price > 0, 'Invalid price');
            assert(stock > 0, 'Invalid stock');

            let caller = get_caller_address();

            // Get or create unified session
            let session_id = self.get_or_create_session(caller);
            self.validate_and_update_session(session_id, PERMISSION_ADMIN);

            let mut world = self.world(@"aqua_stark");
            let mut shop_catalog: ShopCatalogModel = world.read_model(get_contract_address());
            assert(shop_catalog.owner == caller, 'Only owner can add items');

            shop_catalog.shopItems += 1;
            shop_catalog.latest_item_id += 1;

            let shop_item = ShopItemModel {
                id: shop_catalog.latest_item_id,
                price: price,
                stock: stock,
                description: description,
            };
            world.write_model(@shop_catalog);
            world.write_model(@shop_item);
            shop_item.id
        }

        fn update_item(
            self: @ContractState, id: u256, price: u256, stock: u256, description: felt252,
        ) {
            assert(price > 0, 'Invalid price');
            assert(stock > 0, 'Invalid stock');

            let caller = get_caller_address();

            // Get or create unified session
            let session_id = self.get_or_create_session(caller);
            self.validate_and_update_session(session_id, PERMISSION_ADMIN);

            let mut world = self.world(@"aqua_stark");
            let mut shop_catalog: ShopCatalogModel = world.read_model(get_contract_address());
            assert(shop_catalog.owner == caller, 'Only owner can update items');

            assert(shop_catalog.latest_item_id >= id, 'Item does not exist');

            let mut shop_item: ShopItemModel = world.read_model(id);
            shop_item.price = price;
            shop_item.stock = stock;
            shop_item.description = description;
            world.write_model(@shop_item);
        }

        fn get_item(self: @ContractState, id: u256) -> ShopItemModel {
            let mut world = self.world(@"aqua_stark");
            let mut shop_catalog: ShopCatalogModel = world.read_model(get_contract_address());
            assert(shop_catalog.latest_item_id >= id, 'Item does not exist');

            let mut shop_item: ShopItemModel = world.read_model(id);
            shop_item
        }

        fn get_all_items(self: @ContractState) -> Array<ShopItemModel> {
            let mut world = self.world(@"aqua_stark");
            let mut shop_catalog: ShopCatalogModel = world.read_model(get_contract_address());
            let mut items: Array<ShopItemModel> = array![];
            for i in 0..shop_catalog.latest_item_id {
                let mut shop_item: ShopItemModel = world.read_model(i);
                items.append(shop_item);
            };
            items
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        // Session management functions
        fn get_or_create_session(self: @ContractState, player: ContractAddress) -> felt252 {
            let mut world = self.world(@"aqua_stark");
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
            self: @ContractState, player: ContractAddress, current_time: u64,
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
            self: @ContractState, session_id: felt252, required_permission: u8,
        ) -> bool {
            let mut world = self.world(@"aqua_stark");
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
