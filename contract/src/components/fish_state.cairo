use contract::models::fish_model::{IFishModelDispatcher, IFishModelDispatcherTrait};
use starknet::ContractAddress;

#[starknet::interface]
trait IFishState {
    fn feed(amount: u32);
    fn grow(amount: u32);
    fn heal(amount: u32);
    fn damage(amount: u32);
    fn update_hunger(hours_passed: u32);
    fn get_hunger() -> u32;
    fn get_growth() -> u32;
    fn get_health() -> u32;
    fn get_model() -> ContractAddress;
    fn is_dead() -> bool;
}

#[starknet::contract]
mod FishState {
    use starknet::{ContractAddress, get_caller_address};
    use contract::models::fish_model::{IFishModelDispatcher, IFishModelDispatcherTrait};
    use core::traits::Into;
    use core::option::OptionTrait;
    use core::traits::TryInto;
    use core::result::ResultTrait;
    use core::array::ArrayTrait;

    #[storage]
    struct Storage {
        model_address: ContractAddress,
        owner: ContractAddress,
        growth: u32, // 0-100, where 0 is newborn and 100 is fully grown
        hunger: u32, // 0-100, where 0 is starving and 100 is full
        health: u32, // 0-100, where 0 is perfectly healthy
        last_fed_timestamp: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        FishFed: FishFed,
        FishDamaged: FishDamaged,
        FishHealed: FishHealed,
        FishGrown: FishGrown,
    }

    #[derive(Drop, starknet::Event)]
    struct FishFed {
        amount: u32,
        new_hunger: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct FishDamaged {
        amount: u32,
        new_health: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct FishHealed {
        amount: u32,
        new_health: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct FishGrown {
        amount: u32,
        new_growth: u32,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, model_address: ContractAddress, owner: ContractAddress,
    ) {
        self.model_address.write(model_address);
        self.owner.write(owner);

        self.hunger.write(100_u32);
        self.growth.write(0_u32);
        self.health.write(100_u32);
        self.last_fed_timestamp.write(starknet::get_block_timestamp());
    }

    #[external(v0)]
    fn feed(ref self: ContractState, amount: u32) {
        assert_only_owner(@self);

        let current_hunger = self.hunger.read();
        // Cannot exceed 100
        let new_hunger = if current_hunger + amount > 100 {
            100_u32
        } else {
            current_hunger + amount
        };

        self.hunger.write(new_hunger);
        self.last_fed_timestamp.write(starknet::get_block_timestamp());

        self.emit(FishFed { amount, new_hunger });
    }

    #[external(v0)]
    fn update_hunger(ref self: ContractState, hours_passed: u32) {
        assert_only_owner(@self);

        let current_hunger = self.hunger.read();
        let hunger_decrease = hours_passed * 2; // 2 hunger points per hour

        // Cannot go below 0
        let new_hunger = if hunger_decrease > current_hunger {
            0_u32
        } else {
            current_hunger - hunger_decrease
        };

        self.hunger.write(new_hunger);

        // Very hungry fish lose health
        if new_hunger < 20 {
            let current_health = self.health.read();
            let health_decrease = hours_passed * 5;

            // Cannot go below 0
            let new_health = if health_decrease > current_health {
                0_u32
            } else {
                current_health - health_decrease
            };

            self.health.write(new_health);
            self.emit(FishDamaged { amount: health_decrease, new_health });
        }
    }

    #[external(v0)]
    fn grow(ref self: ContractState, amount: u32) {
        assert_only_owner(@self);

        let current_growth = self.growth.read();
        // Cannot exceed 100
        let new_growth = if current_growth + amount > 100 {
            100_u32
        } else {
            current_growth + amount
        };

        self.growth.write(new_growth);
        self.emit(FishGrown { amount, new_growth });
    }

    #[external(v0)]
    fn heal(ref self: ContractState, amount: u32) {
        assert_only_owner(@self);

        let current_health = self.health.read();
        // Cannot exceed 100
        let new_health = if current_health + amount > 100 {
            100_u32
        } else {
            current_health + amount
        };

        self.health.write(new_health);
        self.emit(FishHealed { amount, new_health });
    }

    #[external(v0)]
    fn damage(ref self: ContractState, amount: u32) {
        assert_only_owner(@self);

        let current_health = self.health.read();
        // Cannot go below 0
        let new_health = if amount > current_health {
            0_u32
        } else {
            current_health - amount
        };

        self.health.write(new_health);
        self.emit(FishDamaged { amount, new_health });
    }

    #[external(v0)]
    fn update_age(ref self: ContractState, days_passed: u32) {
        assert_only_owner(@self);

        // Update age
        let current_age = self.age.read();
        self.age.write(current_age + days_passed);

        // Fish naturally grow over time
        let growth_amount = (days_passed * 5) / 10; // 0.5 growth points per day
        self.grow(growth_amount);
    }

    #[external(v0)]
    fn is_dead(self: @ContractState) -> bool {
        self.health.read() == 0
    }

    #[external(v0)]
    fn get_hunger(self: @ContractState) -> u32 {
        self.hunger.read()
    }

    #[external(v0)]
    fn get_growth(self: @ContractState) -> u32 {
        self.growth.read()
    }

    #[external(v0)]
    fn get_health(self: @ContractState) -> u32 {
        self.health.read()
    }

    #[external(v0)]
    fn get_model(self: @ContractState) -> ContractAddress {
        self.model_address.read()
    }

    fn assert_only_owner(self: @ContractState) {
        let caller = get_caller_address();
        assert(caller == self.owner.read(), 'Not the owner');
    }
}
