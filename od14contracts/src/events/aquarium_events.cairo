use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct AquariumCreated {
    #[key]
    pub id: u256,
    pub owner: ContractAddress,
    pub max_capacity: u32,
    pub cleanliness: u32,
}


#[dojo::event]
#[derive(Drop, Serde)]
pub struct FishAdded {
    #[key]
    pub aquarium_id: u256,
    pub fish_id: u64,
}

#[dojo::event]
#[derive(Drop, Serde)]
pub struct FishRemoved {
    #[key]
    pub aquarium_id: u256,
    pub fish_id: u64,
}

#[dojo::event]
#[derive(Drop, Serde)]
pub struct AquariumCleaned {
    #[key]
    pub aquarium_id: u256,
    pub new_cleanliness: u32,
}

#[dojo::event]
#[derive(Drop, Serde)]
pub struct CleanlinessUpdated {
    #[key]
    pub aquarium_id: u256,
    pub new_cleanliness: u32,
}

#[dojo::event]
#[derive(Drop, Serde)]
pub struct AquariumOwnershipTransferred {
    #[key]
    pub aquarium_id: u256,
    pub old_owner: ContractAddress,
    pub new_owner: ContractAddress,
}
