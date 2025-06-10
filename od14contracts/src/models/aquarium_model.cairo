use aqua_stark_od::constants::aquarium_constants::MAXIMUM_CLEANLINESS;
use starknet::ContractAddress;


#[dojo::model]
#[derive(Drop, Introspect, Serde, Debug)]
pub struct AquariumId {
    #[key]
    pub id: felt252,
    pub count: u256,
}

#[derive(Drop, Introspect, Serde, Debug)]
#[dojo::model]
pub struct Aquarium {
    #[key]
    pub id: u256,
    pub owner: ContractAddress,
    pub max_capacity: u32,
    pub cleanliness: u32, // 0-100 scale
    pub housed_fish: Array<u64> // Array of fish IDs
}


#[generate_trait]
pub impl AquariumGetterImpl of AquariumGetter {
    fn get_cleanliness(self: @Aquarium) -> u32 {
        *self.cleanliness
    }

    fn get_capacity(self: @Aquarium) -> u32 {
        *self.max_capacity
    }

    fn get_fish_count(self: @Aquarium) -> u32 {
        self.housed_fish.len()
    }

    fn is_full(self: @Aquarium) -> bool {
        self.housed_fish.len() >= *self.max_capacity
    }
}

#[generate_trait]
pub impl AquariumChangerImpl of AquariumChanger {
    fn create_aquarium(aquarium_id: u256, owner: ContractAddress, max_capacity: u32) -> Aquarium {
        Aquarium {
            id: aquarium_id,
            owner: owner,
            max_capacity: max_capacity,
            cleanliness: MAXIMUM_CLEANLINESS, // Start with a clean aquarium
            housed_fish: array![],
        }
    }

    fn add_fish(ref self: Aquarium, fish_id: u64) {
        // add fish to an aquarium
        let number_of_fishes_in_aquarium = self.housed_fish.len();
        assert!(number_of_fishes_in_aquarium < self.max_capacity, "Aquarium is full");
        self.housed_fish.append(fish_id);
        // return self;
    }

    fn remove_fish(ref self: Aquarium, fish_id: u64) {
        let len_of_aquarium_fishes = self.housed_fish.len();
        assert!(len_of_aquarium_fishes > 0, "No fish to remove");
        let mut index = 0;
        let mut new_fishes_id = array![];
        while index < len_of_aquarium_fishes {
            let gotten_aquarium_fish_id = *self.housed_fish.at(index);

            if gotten_aquarium_fish_id != fish_id {
                new_fishes_id.append(gotten_aquarium_fish_id);
            }
            index += 1;
        };
        self.housed_fish = new_fishes_id;
        // return self;
    }

    fn clean(ref self: Aquarium, amount: u32, owner: ContractAddress) {
        // check ownership of the aquarium
        assert!(self.owner == owner, "Not the owner of this aquarium");
        // clean the aquarium
        let new_cleanliness = if self.cleanliness + amount > 100 {
            100_u32
        } else {
            self.cleanliness + amount
        };

        self.cleanliness = new_cleanliness;
        // return self;
    }

    fn update_cleanliness(ref self: Aquarium, hours_passed: u32) {
        let cleanliness_decrease = (hours_passed * (self.housed_fish.len() * 5)) / 10;
        self
            .cleanliness =
                if self.cleanliness < cleanliness_decrease {
                    0
                } else {
                    self.cleanliness - cleanliness_decrease
                };
        // self
    }

    fn transfer_ownership(ref self: Aquarium, new_owner: ContractAddress) {
        // transfer ownership of the aquarium
        self.owner = new_owner;
    }
}
// #[generate_trait]
// pub impl AquariumImpl of IAquarium {
//     fn create_aquarium(aquarium_id: u256, owner: ContractAddress, max_capacity: u32) -> Aquarium
//     {
//         Aquarium {
//             id: aquarium_id,
//             owner: owner,
//             max_capacity: max_capacity,
//             cleanliness: MAXIMUM_CLEANLINESS, // Start with a clean aquarium
//             housed_fish: array![],
//         }
//     }

//     fn add_fish(mut aquarium: Aquarium, fish_id: u64) -> Aquarium {
//         // add fish to an aquarium

//         let number_of_fishes_in_aquarium = aquarium.housed_fish.len();
//         assert!(number_of_fishes_in_aquarium < aquarium.max_capacity, "Aquarium is full");
//         aquarium.housed_fish.append(fish_id);
//         return aquarium;
//     }
//     fn remove_fish(mut aquarium: Aquarium, fish_id: u64) -> Aquarium {
//         let len_of_aquarium_fishes = aquarium.housed_fish.len();
//         assert!(len_of_aquarium_fishes > 0, "No fish to remove");
//         let mut index = 0;
//         let mut new_fishes_id = array![];
//         while index < len_of_aquarium_fishes {
//             let gotten_aquarium_fish_id = *aquarium.housed_fish.at(index);

//             if gotten_aquarium_fish_id != fish_id {
//                 new_fishes_id.append(gotten_aquarium_fish_id);
//             }
//             index += 1;
//         }
//         aquarium.housed_fish = new_fishes_id;
//         return aquarium;
//     }
//     fn clean(mut aquarium: Aquarium, amount: u32, owner: ContractAddress) -> Aquarium {
//         // check ownership of the aquarium
//         assert!(aquarium.owner == owner, "Not the owner of this aquarium");
//         // clean the aquarium
//         let new_cleanliness = if aquarium.cleanliness + amount > 100 {
//             100_u32
//         } else {
//             aquarium.cleanliness + amount
//         };

//         aquarium.cleanliness = new_cleanliness;

//         return aquarium;
//     }

//     fn update_cleanliness(mut aquarium: Aquarium, hours_passed: u32) -> Aquarium {
//         let cleanliness_decrease = (hours_passed * (aquarium.housed_fish.len() * 5)) / 10;
//         aquarium
//             .cleanliness =
//                 if aquarium.cleanliness < cleanliness_decrease {
//                     0
//                 } else {
//                     aquarium.cleanliness - cleanliness_decrease
//                 };
//         aquarium
//     }
//     // run getters in the contract
// }


