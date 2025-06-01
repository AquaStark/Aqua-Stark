#[cfg(test)]
mod tests {
    use dojo_cairo_test::WorldStorageTestTrait;
    use dojo::model::{ModelStorage, ModelStorageTest};
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{
        spawn_test_world, NamespaceDef, TestResource, ContractDefTrait, ContractDef,
    };
    use dojo_starter::systems::actions::actions;
    use dojo_starter::interfaces::IActions::{IFishDispatcher, IFishDispatcherTrait};
    use dojo_starter::events::events;
    use dojo_starter::models::aqua_stark::{Fish, m_Fish, Id, m_Id};
    use starknet::{testing, get_caller_address, contract_address_const};


    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "dojo_starter",
            resources: [
                TestResource::Model(m_Fish::TEST_CLASS_HASH),
                TestResource::Model(m_Id::TEST_CLASS_HASH),
                TestResource::Contract(actions::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishAdded::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishDamaged::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishRemoved::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishCreated::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishFed::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishGrown::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishHealed::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishHungerUpdated::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishAgeUpdated::TEST_CLASS_HASH),
            ]
                .span(),
        };

        ndef
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"dojo_starter", @"actions")
                .with_writer_of([dojo::utils::bytearray_hash(@"dojo_starter")].span())
        ]
            .span()
    }


    #[test]
    fn test_fish_creation() {
        let caller = contract_address_const::<'Shola'>();
        let username = 'Shola';

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let fish_system = IFishDispatcher { contract_address };

        // Create Fish model instance and fetch from world state
        let fish_id = fish_system.create_fish(caller, 1_u32);
        assert(fish_id == 1_u64, 'Fish ID should be 1');

        // Verify fish initialization details
        let fish: Fish = world.read_model(fish_id);
        assert(fish.owner == caller, 'Fish owner should match');
        assert(fish.fish_type == 1_u32, 'Fish type should match');
        assert(fish.age == 0_u32, 'Initial age should be 0');
        assert(fish.hunger_level == 100_u32, 'Initial hunger should be 100');
        assert(fish.health == 100_u32, 'Initial health should be 100');
        assert(fish.growth == 0_u32, 'Initial growth should be 0');
    }


    #[test]
    fn test_fish_feeding() {
        let caller = contract_address_const::<'Shola'>();
        let username = 'Shola';

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let fish_system = IFishDispatcher { contract_address };

        testing::set_contract_address(caller);

        // Create fish instance
        let fish_id = fish_system.create_fish(caller, 1_u32);
        // Test feeding functionality
        fish_system.feed(fish_id, 30_u32);
        assert(fish_system.get_hunger_level(fish_id) == 70_u32, 'Hunger should decrease');

        // Test update hunger over time
        fish_system.update_hunger(fish_id, 10_u32);
        assert(fish_system.get_hunger_level(fish_id) == 50_u32, 'Hunger should decrease');
    }
    #[test]
    fn test_fish_growth() {
        let caller = contract_address_const::<'Shola'>();
        let username = 'Shola';

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let fish_system = IFishDispatcher { contract_address };

        testing::set_contract_address(caller);

        // Create fish instance
        let fish_id = fish_system.create_fish(caller, 1_u32);

        // Test growth functionality
        fish_system.grow(fish_id, 30_u32);
        assert(fish_system.get_growth_rate(fish_id) == 30_u32, 'Growth should increase by 30');

        // Test max growth cap
        fish_system.grow(fish_id, 80_u32);
        assert(fish_system.get_growth_rate(fish_id) == 100_u32, 'Growth should be capped at 100');
    }

    #[test]
    fn test_fish_health() {
        // Initialize test environment with world and caller
        let caller = contract_address_const::<'Shola'>();
        let username = 'Shola';

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let fish_system = IFishDispatcher { contract_address };

        testing::set_contract_address(caller);

        // Create fish instance
        let fish_id = fish_system.create_fish(caller, 1_u32);

        // Test damage functionality
        fish_system.damage(fish_id, 30_u32);
        assert(fish_system.get_health(fish_id) == 70_u32, 'Health should decrease by 30');

        // Test healing functionality
        fish_system.heal(fish_id, 20_u32);
        assert(fish_system.get_health(fish_id) == 90_u32, 'Health should increase by 20');

        // Test death (health reaching 0)
        fish_system.damage(fish_id, 100_u32);
        assert(fish_system.get_health(fish_id) == 0_u32, 'Health should be 0 after damage');
    }

    #[test]
    fn test_fish_age() {
        let caller = contract_address_const::<'Shola'>();
        let username = 'Shola';

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let fish_system = IFishDispatcher { contract_address };

        testing::set_contract_address(caller);
        // Create fish instance
        let fish_id = fish_system.create_fish(caller, 1_u32);

        // Test age update
        fish_system.update_age(fish_id, 5_u32);

        // Verify fish age
        let fish: Fish = world.read_model(fish_id);
        assert(fish.age == 5_u32, 'Fish age should be 5 days');
    }

    #[test]
    #[should_panic(expected: ('CALLER NOT OWNER', 'ENTRYPOINT_FAILED'))]
    fn test_unauthorized_access() {
        let caller = contract_address_const::<'Shola'>();
        let username = 'Shola';
        let owner = contract_address_const::<0x1>();
        let user = contract_address_const::<0x2>();

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let fish_system = IFishDispatcher { contract_address };

        // Create fish as owner
        testing::set_contract_address(owner);
        let fish_id = fish_system.create_fish(owner, 1_u32);

        // Try to feed fish as non-owner (should panic)
        testing::set_contract_address(user);
        fish_system.feed(fish_id, 10_u32);
    }
}
