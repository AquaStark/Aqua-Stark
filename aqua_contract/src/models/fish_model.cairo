use starknet::{ContractAddress, get_block_timestamp, get_caller_address};

#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
#[dojo::model]
pub struct FishCounter {
    #[key]
    pub id: felt252,
    pub current_val: u256,
}


#[derive(Serde, Copy, Introspect, Drop, PartialEq)]
pub enum Species {
    #[default]
    AngelFish,
    GoldFish,
    Betta,
    NeonTetra,
    Corydoras,
    Hybrid,
}

#[derive(Serde, Copy, Introspect, Drop, PartialEq)]
pub enum Pattern {
    #[default]
    Plain,
    Spotted,
    Stripes,
}

#[derive(Serde, Copy, Drop, Introspect)]
#[dojo::model]
pub struct FishOwner {
    #[key]
    pub id: u256,
    pub owner: ContractAddress,
}

#[derive(Copy, Drop, Introspect, Serde)]
#[dojo::model]
pub struct Fish {
    #[key]
    pub id: u256,
    pub fish_type: u8,
    pub age: u32, // in days
    pub hunger_level: u8, // 0-100 scale
    pub health: u8, // 0-100 scale
    pub growth: u64, // 0-100 scale
    pub growth_rate: u8,
    pub owner: ContractAddress,
    pub species: Species,
    pub generation: u8,
    pub color: felt252,
    pub pattern: Pattern,
    pub size: u8,
    pub speed: u32,
    pub birth_time: u64,
    pub parent_ids: (u256, u256),
    pub mutation_rate: u8,
    pub growth_counter: u8,
    pub can_grow: bool,
}

pub trait FishTrait {
    fn is_dead(fish: Fish) -> bool;
    fn is_hungry(fish: Fish) -> bool;
    fn is_fully_grown(fish: Fish) -> bool;
    fn can_eat(fish: Fish) -> bool;
    fn create_fish_by_species(fish: Fish, owner: ContractAddress, species: Species) -> Fish;

    fn create_offspring(
        offspring: Fish, owner: ContractAddress, parent1: Fish, parent2: Fish,
    ) -> Fish;
    fn create_random_fish(fish: Fish, owner: ContractAddress) -> Fish;
    fn feed(fish: Fish, amount: u8) -> Fish;
    fn grow(fish: Fish, amount: u64) -> Fish;
    fn heal(fish: Fish, amount: u8) -> Fish;
    fn damage(fish: Fish, species: Species, amount: u8) -> Fish;
    fn regenerate_health(fish: Fish, aquarium_cleanliness: u8) -> Fish;
    fn update_hunger(fish: Fish, hours_passed: u8) -> Fish;
    fn update_age(fish: Fish, days_passed: u32) -> Fish;
    fn get_hunger_level(fish: Fish) -> u8;
    fn get_growth_rate(fish: Fish) -> u8;
    fn get_health(fish: Fish) -> u8;
}

impl FishImpl of FishTrait {
    fn is_dead(fish: Fish) -> bool {
        fish.health == 0
    }

    fn is_hungry(fish: Fish) -> bool {
        fish.hunger_level <= 80
    }

    fn is_fully_grown(fish: Fish) -> bool {
        fish.growth >= 100
    }

    fn can_eat(fish: Fish) -> bool {
        fish.hunger_level < 100
    }

    fn get_health(fish: Fish) -> u8 {
        fish.health
    }

    fn get_growth_rate(fish: Fish) -> u8 {
        fish.growth_rate
    }

    fn get_hunger_level(fish: Fish) -> u8 {
        fish.hunger_level
    }
    fn update_age(mut fish: Fish, days_passed: u32) -> Fish {
        // Update age
        fish.age += days_passed;

        fish
    }
    fn update_hunger(mut fish: Fish, hours_passed: u8) -> Fish {
        // Calculate hunger decrease
        assert(fish.hunger_level > 0, 'Fish dead');

        let hunger_increase = hours_passed * 2;

        // Update hunger
        let new_hunger = if hunger_increase > fish.hunger_level {
            0
        } else {
            fish.hunger_level + hunger_increase
        };

        fish.hunger_level = new_hunger;

        fish
    }
    fn regenerate_health(mut fish: Fish, aquarium_cleanliness: u8) -> Fish {
        let caller = get_caller_address();

        // Check ownership
        assert(fish.owner == caller, 'Not your Fish');

        // Calculate regeneration amount based on cleanliness
        let regen_amount = (aquarium_cleanliness - 80) / 4;

        // Update health
        let new_health = if fish.health + regen_amount > 100 {
            100
        } else {
            fish.health + regen_amount
        };

        fish.health = new_health;

        fish
    }


    fn damage(mut fish: Fish, species: Species, amount: u8) -> Fish {
        let caller = get_caller_address();

        // Check ownership
        assert(fish.owner == caller, 'Not your Fish');

        // Update health
        let new_health = if amount >= fish.health {
            0
        } else {
            fish.health - amount
        };

        fish.health = new_health;
        fish
    }

    fn heal(mut fish: Fish, amount: u8) -> Fish {
        let caller = get_caller_address();

        // Check ownership
        assert(fish.owner == caller, 'Not your Fish');

        // Update health
        let new_health = if fish.health + amount > 100 {
            100
        } else {
            fish.health + amount
        };

        fish.health = new_health;
        fish
    }

    fn grow(mut fish: Fish, amount: u64) -> Fish {
        let caller = get_caller_address();
        let timestamp = get_block_timestamp();
        // Check ownership
        assert(fish.owner == caller, 'Not your Fish');

        let new_grow = ((timestamp - fish.birth_time) * fish.mutation_rate.into()) / 86400;
        // Update growth
        let new_growth = if fish.growth + amount > 100 {
            100
        } else {
            fish.growth + amount
        };

        fish.growth = new_grow + new_growth;
        fish
    }

    fn feed(mut fish: Fish, amount: u8) -> Fish {
        let caller = get_caller_address();
        assert(caller == fish.owner, 'Not your Fish');
        assert(fish.hunger_level < 100, 'Fish is dead');

        if ((fish.hunger_level + amount) <= 0) {
            fish.hunger_level = 0
        } else {
            if (fish.hunger_level < 30) {
                fish.can_grow == true;
            }
            // Update hunger
            let new_hunger = fish.hunger_level - amount;

            fish.hunger_level = new_hunger;
            if ((fish.hunger_level == 100) && fish.can_grow) {
                fish.growth += 2;
                fish.health += 1;
                fish.can_grow = false;
            }
        }

        fish
    }
    fn create_fish_by_species(mut fish: Fish, owner: ContractAddress, species: Species) -> Fish {
        let timestamp = get_block_timestamp();

        // Set base properties
        fish.owner = owner;
        fish.age = 0;
        fish.health = 100;
        fish.hunger_level = 80;
        fish.growth = 4;
        fish.generation = 1;
        fish.birth_time = timestamp;
        fish.parent_ids = (0, 0);
        fish.species = species;

        // Assign species-specific traits
        match species {
            Species::AngelFish => {
                fish.color = 'blue';
                fish.pattern = Pattern::Plain;
                fish.size = 5;
                fish.growth_rate = 5;
                fish.speed = 4;
                fish.mutation_rate = 5;
            },
            Species::GoldFish => {
                fish.color = 'gold';
                fish.pattern = Pattern::Spotted;
                fish.size = 4;
                fish.growth_rate = 4;
                fish.speed = 3;
                fish.mutation_rate = 3;
            },
            Species::Betta => {
                fish.color = 'red';
                fish.pattern = Pattern::Stripes;
                fish.size = 3;
                fish.growth_rate = 3;
                fish.speed = 5;
                fish.mutation_rate = 4;
            },
            Species::NeonTetra => {
                fish.color = 'neon';
                fish.pattern = Pattern::Plain;
                fish.size = 2;
                fish.growth_rate = 2;
                fish.speed = 5;
                fish.mutation_rate = 2;
            },
            Species::Corydoras => {
                fish.color = 'silver';
                fish.pattern = Pattern::Spotted;
                fish.size = 4;
                fish.growth_rate = 4;
                fish.speed = 3;
                fish.mutation_rate = 3;
            },
            _ => {
                // For safety, fallback values (won't apply for Hybrid if it's blocked)
                fish.color = 'gray';
                fish.pattern = Pattern::Plain;
                fish.size = 3;
                fish.growth_rate = 3;
                fish.speed = 3;
                fish.mutation_rate = 3;
            },
        }

        fish
    }


    fn create_offspring(
        mut offspring: Fish, owner: ContractAddress, parent1: Fish, parent2: Fish,
    ) -> Fish {
        let timestamp = get_block_timestamp();
        let g: bool = timestamp % 2 == 0;

        if parent1.species == parent2.species {
            offspring.species = parent1.species;
            offspring.fish_type = parent1.fish_type;

            // Inherit color & pattern randomly
            if g {
                offspring.color = parent1.color;
                offspring.pattern = parent2.pattern;
            } else {
                offspring.color = parent2.color;
                offspring.pattern = parent1.pattern;
            }
        } else {
            offspring.species = Species::Hybrid;
            // Inherit color & pattern randomly
            if !g {
                offspring.color = parent1.color;
                offspring.pattern = parent2.pattern;
                offspring.growth_rate = parent1.growth_rate;
            } else {
                offspring.color = parent2.color;
                offspring.pattern = parent1.pattern;
                offspring.growth_rate = parent2.growth_rate;
            }
        }
        offspring.speed = (parent1.speed + parent2.speed) / 2;
        offspring.size = ((parent1.size + parent2.size) / 2);
        offspring.mutation_rate = (parent1.mutation_rate + parent2.mutation_rate) / 2;
        offspring.generation = parent1.generation + 1;

        // Set inherited/general fields
        offspring.owner = owner;
        offspring.age = 0;
        offspring.health = 100;
        offspring.hunger_level = 80;

        offspring.growth = 4;
        offspring.birth_time = timestamp;
        offspring.parent_ids = (parent1.id, parent2.id);

        offspring
    }

    fn create_random_fish(mut fish: Fish, owner: ContractAddress) -> Fish {
        let timestamp = get_block_timestamp();
        let species_index = timestamp % 5;

        // Set base properties
        fish.owner = owner;
        fish.age = 0;
        fish.health = 100;
        fish.hunger_level = 20;

        fish.growth = 4;
        fish.generation = 1;
        fish.birth_time = timestamp;
        fish.parent_ids = (0, 0);

        // Assign species-specific traits
        if species_index == 0 {
            fish.species = Species::AngelFish;
            fish.color = 'blue';
            fish.pattern = Pattern::Plain;
            fish.size = 5;
            fish.growth_rate = 5;
            fish.speed = 4;
            fish.mutation_rate = 5;
        } else if species_index == 1 {
            fish.species = Species::GoldFish;
            fish.color = 'gold';
            fish.pattern = Pattern::Spotted;
            fish.size = 4;
            fish.growth_rate = 4;
            fish.speed = 3;
            fish.mutation_rate = 3;
        } else if species_index == 2 {
            fish.species = Species::Betta;
            fish.color = 'red';
            fish.pattern = Pattern::Stripes;
            fish.size = 3;
            fish.growth_rate = 3;
            fish.speed = 5;
            fish.mutation_rate = 4;
        } else if species_index == 3 {
            fish.species = Species::NeonTetra;
            fish.color = 'neon';
            fish.pattern = Pattern::Plain;
            fish.size = 2;
            fish.growth_rate = 2;
            fish.speed = 5;
            fish.mutation_rate = 2;
        } else if species_index == 4 {
            fish.species = Species::Corydoras;
            fish.color = 'silver';
            fish.pattern = Pattern::Spotted;
            fish.size = 4;
            fish.growth_rate = 4;
            fish.speed = 3;
            fish.mutation_rate = 3;
        }

        fish
    }
}


#[cfg(test)]
mod tests {
    use starknet::contract_address_const;
    use super::{*, Fish};

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }
    #[test]
    fn test_fish_creation() {
        let fish = Fish {
            id: 1,
            fish_type: 1,
            age: 0,
            hunger_level: 0,
            health: 100,
            growth: 0,
            owner: zero_address(),
            species: Species::AngelFish,
            generation: 1,
            color: 'blue',
            pattern: Pattern::Plain,
            size: 2,
            speed: 8,
            birth_time: get_block_timestamp(),
            parent_ids: (0, 0),
            mutation_rate: 5,
            growth_counter: 0,
            growth_rate: 4,
            can_grow: false,
        };
        assert(fish.fish_type == 1, 'Fish type should match');
    }

    #[test]
    fn test_create_random_fish() {
        let fish = Fish {
            id: 1,
            fish_type: 0,
            age: 0,
            hunger_level: 0,
            health: 0,
            growth: 0,
            owner: zero_address(),
            species: Species::AngelFish,
            generation: 0,
            color: '',
            pattern: Pattern::Plain,
            size: 0,
            speed: 0,
            birth_time: 0,
            parent_ids: (0, 0),
            mutation_rate: 5,
            growth_counter: 0,
            growth_rate: 5,
            can_grow: false,
        };

        let new_fish: Fish = FishTrait::create_random_fish(fish, zero_address());
        assert(new_fish.generation == 1, 'Fish generation error');
    }

    #[test]
    fn test_create_fish_by_Specie() {
        let fish = Fish {
            id: 1,
            fish_type: 0,
            age: 0,
            hunger_level: 0,
            health: 0,
            growth: 4,
            owner: zero_address(),
            species: Species::AngelFish,
            generation: 0,
            color: '',
            pattern: Pattern::Plain,
            size: 0,
            speed: 0,
            birth_time: 0,
            parent_ids: (0, 0),
            mutation_rate: 5,
            growth_counter: 0,
            growth_rate: 5,
            can_grow: false,
        };

        let parent1: Fish = FishTrait::create_fish_by_species(
            fish, zero_address(), Species::AngelFish,
        );
        let parent: Fish = FishTrait::create_fish_by_species(
            fish, zero_address(), Species::GoldFish,
        );
        assert(parent1.species == Species::AngelFish, 'Fish Species error');
        assert(parent1.color == 'blue', 'Color error');
        assert(parent1.pattern == Pattern::Plain, 'Pattern error');
        assert(parent1.size == 5, 'size error');
        assert(parent1.speed == 4, 'speed error');
        assert(parent1.mutation_rate == 5, 'mutation_rate error');

        assert(parent.species == Species::GoldFish, 'Fish Species error');
        assert(parent.color == 'gold', 'Color error');
        assert(parent.pattern == Pattern::Spotted, 'Pattern error');
        assert(parent.size == 4, 'size error');
        assert(parent.speed == 3, 'speed error');
        assert(parent.mutation_rate == 3, 'mutation_rate error');
    }
    #[test]
    fn test_create_hybrid_offspring() {
        let fish = Fish {
            id: 1,
            fish_type: 0,
            age: 0,
            hunger_level: 0,
            health: 0,
            growth: 4,
            owner: zero_address(),
            species: Species::AngelFish,
            generation: 0,
            color: '',
            pattern: Pattern::Plain,
            size: 0,
            speed: 0,
            birth_time: 0,
            parent_ids: (0, 0),
            mutation_rate: 5,
            growth_counter: 0,
            growth_rate: 0,
            can_grow: false,
        };

        let parent2: Fish = FishTrait::create_fish_by_species(
            fish, zero_address(), Species::AngelFish,
        );
        let parent1: Fish = FishTrait::create_fish_by_species(
            fish, zero_address(), Species::GoldFish,
        );
        let offspring: Fish = FishTrait::create_offspring(fish, zero_address(), parent1, parent2);
        assert(offspring.species == Species::Hybrid, 'offspring Species error');
        assert(offspring.pattern == Pattern::Spotted, 'offspring pattern error');
    }

    #[test]
    fn test_create_pure_offspring() {
        let fish = Fish {
            id: 1,
            fish_type: 0,
            age: 0,
            hunger_level: 0,
            health: 0,
            growth: 4,
            owner: zero_address(),
            species: Species::AngelFish,
            generation: 0,
            color: '',
            pattern: Pattern::Plain,
            size: 0,
            speed: 0,
            birth_time: 0,
            parent_ids: (0, 0),
            mutation_rate: 5,
            growth_counter: 0,
            growth_rate: 0,
            can_grow: false,
        };

        let parent2: Fish = FishTrait::create_fish_by_species(
            fish, zero_address(), Species::AngelFish,
        );
        let parent1: Fish = FishTrait::create_fish_by_species(
            fish, zero_address(), Species::AngelFish,
        );
        let offspring: Fish = FishTrait::create_offspring(fish, zero_address(), parent1, parent2);
        assert(offspring.species == Species::AngelFish, 'offspring Species error');
        assert(offspring.pattern == Pattern::Plain, 'offspring pattern error');
    }

    #[test]
    fn test_fish_feeding() {
        let fish = Fish {
            id: 1,
            fish_type: 0,
            age: 0,
            hunger_level: 0,
            health: 0,
            growth: 4,
            owner: zero_address(),
            species: Species::AngelFish,
            generation: 0,
            color: '',
            pattern: Pattern::Plain,
            size: 0,
            speed: 0,
            birth_time: 0,
            parent_ids: (0, 0),
            mutation_rate: 5,
            growth_counter: 0,
            growth_rate: 0,
            can_grow: false,
        };

        let new_fish: Fish = FishTrait::create_fish_by_species(
            fish, zero_address(), Species::AngelFish,
        );

        let health: u8 = FishTrait::get_health(new_fish);
        let is_hungry: bool = FishTrait::is_hungry(new_fish);

        let hungry_fish: Fish = FishTrait::update_hunger(new_fish, 6);
        let new_hunger: u8 = FishTrait::get_hunger_level(hungry_fish);

        let feed_fish: Fish = FishTrait::feed(hungry_fish, 92);
        let hunger_level: u8 = FishTrait::get_hunger_level(feed_fish);

        assert(is_hungry, 'Hunger error');
        assert(new_hunger == 92, 'Update hunger error');
        assert(health == 100, 'get health error');
        assert(hunger_level == 0, 'get hunger_level error');
    }

    #[test]
    fn test_fish_growth() {
        let fish = Fish {
            id: 1,
            fish_type: 0,
            age: 0,
            hunger_level: 0,
            health: 0,
            growth: 0,
            owner: zero_address(),
            species: Species::AngelFish,
            generation: 0,
            color: '',
            pattern: Pattern::Plain,
            size: 0,
            speed: 0,
            birth_time: 0,
            parent_ids: (0, 0),
            mutation_rate: 5,
            growth_counter: 0,
            growth_rate: 4,
            can_grow: false,
        };

        let new_fish: Fish = FishTrait::create_fish_by_species(
            fish, zero_address(), Species::AngelFish,
        );

        let growth: u8 = FishTrait::get_growth_rate(new_fish);
        // let is_hungry: bool = FishTrait::is_hungry(new_fish);
        // assert(is_hungry, 'Hunger error');

        // let hungry_fish: Fish = FishTrait::update_hunger(new_fish, 6);
        // let new_hunger: u8 = FishTrait::get_hunger_level(hungry_fish);

        // let feed_fish: Fish = FishTrait::feed(hungry_fish, 92);
        // let hunger_level: u8 = FishTrait::get_hunger_level(feed_fish);

        // let species: u8 = FishTrait::get_health(new_fish);
        // let generation: u8 = FishTrait::get_health(new_fish);
        // let color: u8 = FishTrait::get_health(new_fish);
        println!("growth level: {}", growth);
        // println!("feed_fish hunger level: {}", hunger_level);
    // assert(health == 100, 'get health error');
    // assert(hunger_level == 0, 'get hunger_level error');
    }
}
