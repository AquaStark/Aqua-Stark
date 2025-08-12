import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, BigNumberish } from 'starknet';

// Type definition for `aqua_stark::models::aquarium_model::Aquarium` struct
export interface Aquarium {
	id: BigNumberish;
	owner: string;
	fish_count: BigNumberish;
	decoration_count: BigNumberish;
	max_capacity: BigNumberish;
	cleanliness: BigNumberish;
	housed_fish: Array<BigNumberish>;
	housed_decorations: Array<BigNumberish>;
	max_decorations: BigNumberish;
}

// Type definition for `aqua_stark::models::aquarium_model::AquariumCounter` struct
export interface AquariumCounter {
	id: BigNumberish;
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::aquarium_model::AquariumCounterValue` struct
export interface AquariumCounterValue {
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::aquarium_model::AquariumFishes` struct
export interface AquariumFishes {
	id: BigNumberish;
	owner: string;
	current_fish_count: BigNumberish;
	max_fish_count: BigNumberish;
}

// Type definition for `aqua_stark::models::aquarium_model::AquariumFishesValue` struct
export interface AquariumFishesValue {
	owner: string;
	current_fish_count: BigNumberish;
	max_fish_count: BigNumberish;
}

// Type definition for `aqua_stark::models::aquarium_model::AquariumOwner` struct
export interface AquariumOwner {
	id: BigNumberish;
	owner: string;
}

// Type definition for `aqua_stark::models::aquarium_model::AquariumOwnerValue` struct
export interface AquariumOwnerValue {
	owner: string;
}

// Type definition for `aqua_stark::models::aquarium_model::AquariumValue` struct
export interface AquariumValue {
	owner: string;
	fish_count: BigNumberish;
	decoration_count: BigNumberish;
	max_capacity: BigNumberish;
	cleanliness: BigNumberish;
	housed_fish: Array<BigNumberish>;
	housed_decorations: Array<BigNumberish>;
	max_decorations: BigNumberish;
}

// Type definition for `aqua_stark::models::decoration_model::Decoration` struct
export interface Decoration {
	id: BigNumberish;
	owner: string;
	aquarium_id: BigNumberish;
	name: BigNumberish;
	description: BigNumberish;
	price: BigNumberish;
	rarity: BigNumberish;
}

// Type definition for `aqua_stark::models::decoration_model::DecorationCounter` struct
export interface DecorationCounter {
	id: BigNumberish;
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::decoration_model::DecorationCounterValue` struct
export interface DecorationCounterValue {
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::decoration_model::DecorationValue` struct
export interface DecorationValue {
	owner: string;
	aquarium_id: BigNumberish;
	name: BigNumberish;
	description: BigNumberish;
	price: BigNumberish;
	rarity: BigNumberish;
}

// Type definition for `aqua_stark::models::fish_model::Fish` struct
export interface Fish {
	id: BigNumberish;
	fish_type: BigNumberish;
	age: BigNumberish;
	hunger_level: BigNumberish;
	health: BigNumberish;
	growth: BigNumberish;
	growth_rate: BigNumberish;
	owner: string;
	species: SpeciesEnum;
	generation: BigNumberish;
	color: BigNumberish;
	pattern: PatternEnum;
	size: BigNumberish;
	speed: BigNumberish;
	birth_time: BigNumberish;
	parent_ids: [BigNumberish, BigNumberish];
	mutation_rate: BigNumberish;
	growth_counter: BigNumberish;
	can_grow: boolean;
	aquarium_id: BigNumberish;
	offspings: Array<BigNumberish>;
	family_tree: Array<FishParents>;
}

// Type definition for `aqua_stark::models::fish_model::FishCounter` struct
export interface FishCounter {
	id: BigNumberish;
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::fish_model::FishCounterValue` struct
export interface FishCounterValue {
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::fish_model::FishOwner` struct
export interface FishOwner {
	id: BigNumberish;
	owner: string;
}

// Type definition for `aqua_stark::models::fish_model::FishOwnerValue` struct
export interface FishOwnerValue {
	owner: string;
}

// Type definition for `aqua_stark::models::fish_model::FishParents` struct
export interface FishParents {
	parent1: BigNumberish;
	parent2: BigNumberish;
}

// Type definition for `aqua_stark::models::fish_model::FishValue` struct
export interface FishValue {
	fish_type: BigNumberish;
	age: BigNumberish;
	hunger_level: BigNumberish;
	health: BigNumberish;
	growth: BigNumberish;
	growth_rate: BigNumberish;
	owner: string;
	species: SpeciesEnum;
	generation: BigNumberish;
	color: BigNumberish;
	pattern: PatternEnum;
	size: BigNumberish;
	speed: BigNumberish;
	birth_time: BigNumberish;
	parent_ids: [BigNumberish, BigNumberish];
	mutation_rate: BigNumberish;
	growth_counter: BigNumberish;
	can_grow: boolean;
	aquarium_id: BigNumberish;
	offspings: Array<BigNumberish>;
	family_tree: Array<FishParents>;
}

// Type definition for `aqua_stark::models::game_model::Game` struct
export interface Game {
	id: BigNumberish;
	created_by: BigNumberish;
	is_initialized: boolean;
	total_players: BigNumberish;
	total_aquariums: BigNumberish;
	total_fish: BigNumberish;
	total_decorations: BigNumberish;
	fish_genealogy_enabled: boolean;
	fish_genes_onchain: boolean;
	marketplace_enabled: boolean;
	auctions_enabled: boolean;
	active_events: Array<BigNumberish>;
	leaderboard: Array<[BigNumberish, BigNumberish]>;
	created_at: BigNumberish;
	last_updated: BigNumberish;
}

// Type definition for `aqua_stark::models::game_model::GameCounter` struct
export interface GameCounter {
	id: BigNumberish;
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::game_model::GameCounterValue` struct
export interface GameCounterValue {
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::game_model::GameValue` struct
export interface GameValue {
	created_by: BigNumberish;
	is_initialized: boolean;
	total_players: BigNumberish;
	total_aquariums: BigNumberish;
	total_fish: BigNumberish;
	total_decorations: BigNumberish;
	fish_genealogy_enabled: boolean;
	fish_genes_onchain: boolean;
	marketplace_enabled: boolean;
	auctions_enabled: boolean;
	active_events: Array<BigNumberish>;
	leaderboard: Array<[BigNumberish, BigNumberish]>;
	created_at: BigNumberish;
	last_updated: BigNumberish;
}

// Type definition for `aqua_stark::models::player_model::AddressToUsername` struct
export interface AddressToUsername {
	address: string;
	username: BigNumberish;
}

// Type definition for `aqua_stark::models::player_model::AddressToUsernameValue` struct
export interface AddressToUsernameValue {
	username: BigNumberish;
}

// Type definition for `aqua_stark::models::player_model::Player` struct
export interface Player {
	wallet: string;
	id: BigNumberish;
	username: BigNumberish;
	inventory_ref: string;
	is_verified: boolean;
	aquarium_count: BigNumberish;
	fish_count: BigNumberish;
	player_fishes: Array<BigNumberish>;
	player_aquariums: Array<BigNumberish>;
	player_decorations: Array<BigNumberish>;
	decoration_count: BigNumberish;
	registered_at: BigNumberish;
}

// Type definition for `aqua_stark::models::player_model::PlayerCounter` struct
export interface PlayerCounter {
	id: BigNumberish;
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::player_model::PlayerCounterValue` struct
export interface PlayerCounterValue {
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::player_model::PlayerValue` struct
export interface PlayerValue {
	id: BigNumberish;
	username: BigNumberish;
	inventory_ref: string;
	is_verified: boolean;
	aquarium_count: BigNumberish;
	fish_count: BigNumberish;
	player_fishes: Array<BigNumberish>;
	player_aquariums: Array<BigNumberish>;
	player_decorations: Array<BigNumberish>;
	decoration_count: BigNumberish;
	registered_at: BigNumberish;
}

// Type definition for `aqua_stark::models::player_model::UsernameToAddress` struct
export interface UsernameToAddress {
	username: BigNumberish;
	address: string;
}

// Type definition for `aqua_stark::models::player_model::UsernameToAddressValue` struct
export interface UsernameToAddressValue {
	address: string;
}

// Type definition for `achievement::events::index::TrophyCreation` struct
export interface TrophyCreation {
	id: BigNumberish;
	hidden: boolean;
	index: BigNumberish;
	points: BigNumberish;
	start: BigNumberish;
	end: BigNumberish;
	group: BigNumberish;
	icon: BigNumberish;
	title: BigNumberish;
	description: string;
	tasks: Array<Task>;
	data: string;
}

// Type definition for `achievement::events::index::TrophyCreationValue` struct
export interface TrophyCreationValue {
	hidden: boolean;
	index: BigNumberish;
	points: BigNumberish;
	start: BigNumberish;
	end: BigNumberish;
	group: BigNumberish;
	icon: BigNumberish;
	title: BigNumberish;
	description: string;
	tasks: Array<Task>;
	data: string;
}

// Type definition for `achievement::events::index::TrophyProgression` struct
export interface TrophyProgression {
	player_id: BigNumberish;
	task_id: BigNumberish;
	count: BigNumberish;
	time: BigNumberish;
}

// Type definition for `achievement::events::index::TrophyProgressionValue` struct
export interface TrophyProgressionValue {
	count: BigNumberish;
	time: BigNumberish;
}

// Type definition for `achievement::types::index::Task` struct
export interface Task {
	id: BigNumberish;
	total: BigNumberish;
	description: string;
}

// Define the missing interfaces locally
export interface DecorationAddedToAquarium {
	decoration_id: BigNumberish;
	aquarium_id: BigNumberish;
	timestamp: BigNumberish;
}

export interface DecorationAddedToAquariumValue {
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::DecorationCreated` struct
export interface DecorationCreated {
	id: BigNumberish;
	aquarium_id: BigNumberish;
	owner: string;
	name: BigNumberish;
	rarity: BigNumberish;
	price: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::DecorationCreatedValue` struct
export interface DecorationCreatedValue {
	owner: string;
	name: BigNumberish;
	rarity: BigNumberish;
	price: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::DecorationMoved` struct
export interface DecorationMoved {
	decoration_id: BigNumberish;
	from: BigNumberish;
	to: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::DecorationMovedValue` struct
export interface DecorationMovedValue {
	from: BigNumberish;
	to: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::FishAddedToAquarium` struct
export interface FishAddedToAquarium {
	fish_id: BigNumberish;
	aquarium_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::FishAddedToAquariumValue` struct
export interface FishAddedToAquariumValue {
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::FishBred` struct
export interface FishBred {
	offspring_id: BigNumberish;
	owner: string;
	parent1_id: BigNumberish;
	parent2_id: BigNumberish;
	aquarium_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::FishBredValue` struct
export interface FishBredValue {
	parent1_id: BigNumberish;
	parent2_id: BigNumberish;
	aquarium_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::FishCreated` struct
export interface FishCreated {
	fish_id: BigNumberish;
	owner: string;
	aquarium_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::FishCreatedValue` struct
export interface FishCreatedValue {
	aquarium_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::FishMoved` struct
export interface FishMoved {
	fish_id: BigNumberish;
	from: BigNumberish;
	to: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::FishMovedValue` struct
export interface FishMovedValue {
	from: BigNumberish;
	to: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::PlayerCreated` struct
export interface PlayerCreated {
	username: BigNumberish;
	player: string;
	player_id: BigNumberish;
	aquarium_id: BigNumberish;
	decoration_id: BigNumberish;
	fish_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::PlayerCreatedValue` struct
export interface PlayerCreatedValue {
	player_id: BigNumberish;
	aquarium_id: BigNumberish;
	decoration_id: BigNumberish;
	fish_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::models::fish_model::Pattern` enum
export const pattern = [
	'Plain',
	'Spotted',
	'Stripes',
] as const;
export type Pattern = { [key in typeof pattern[number]]: string };
export type PatternEnum = CairoCustomEnum;

// Type definition for `aqua_stark::models::fish_model::Species` enum
export const species = [
	'AngelFish',
	'GoldFish',
	'Betta',
	'NeonTetra',
	'Corydoras',
	'Hybrid',
] as const;
export type Species = { [key in typeof species[number]]: string };
export type SpeciesEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	aqua_stark: {
		Aquarium: Aquarium,
		AquariumCounter: AquariumCounter,
		AquariumCounterValue: AquariumCounterValue,
		AquariumFishes: AquariumFishes,
		AquariumFishesValue: AquariumFishesValue,
		AquariumOwner: AquariumOwner,
		AquariumOwnerValue: AquariumOwnerValue,
		AquariumValue: AquariumValue,
		Decoration: Decoration,
		DecorationCounter: DecorationCounter,
		DecorationCounterValue: DecorationCounterValue,
		DecorationValue: DecorationValue,
		DecorationAddedToAquarium: DecorationAddedToAquarium,
		DecorationAddedToAquariumValue: DecorationAddedToAquariumValue,
		DecorationCreated: DecorationCreated,
		DecorationCreatedValue: DecorationCreatedValue,
		DecorationMoved: DecorationMoved,
		DecorationMovedValue: DecorationMovedValue,
		Fish: Fish,
		FishCounter: FishCounter,
		FishCounterValue: FishCounterValue,
		FishOwner: FishOwner,
		FishOwnerValue: FishOwnerValue,
		FishParents: FishParents,
		FishValue: FishValue,
		FishAddedToAquarium: FishAddedToAquarium,
		FishAddedToAquariumValue: FishAddedToAquariumValue,
		FishBred: FishBred,
		FishBredValue: FishBredValue,
		FishCreated: FishCreated,
		FishCreatedValue: FishCreatedValue,
		FishMoved: FishMoved,
		FishMovedValue: FishMovedValue,
		Game: Game,
		GameCounter: GameCounter,
		GameCounterValue: GameCounterValue,
		GameValue: GameValue,
		AddressToUsername: AddressToUsername,
		AddressToUsernameValue: AddressToUsernameValue,
		Player: Player,
		PlayerCounter: PlayerCounter,
		PlayerCounterValue: PlayerCounterValue,
		PlayerValue: PlayerValue,
		PlayerCreated: PlayerCreated,
		PlayerCreatedValue: PlayerCreatedValue,
		UsernameToAddress: UsernameToAddress,
		UsernameToAddressValue: UsernameToAddressValue,
	},
	achievement: any,
}
export const schema: SchemaType = {
	aqua_stark: {
		Aquarium: {
		id: 0,
			owner: "",
		fish_count: 0,
		decoration_count: 0,
			max_capacity: 0,
			cleanliness: 0,
			housed_fish: [0],
			housed_decorations: [0],
			max_decorations: 0,
		},
		AquariumCounter: {
			id: 0,
		current_val: 0,
		},
		AquariumCounterValue: {
		current_val: 0,
		},
		AquariumFishes: {
		id: 0,
			owner: "",
		current_fish_count: 0,
		max_fish_count: 0,
		},
		AquariumFishesValue: {
			owner: "",
		current_fish_count: 0,
		max_fish_count: 0,
		},
		AquariumOwner: {
		id: 0,
			owner: "",
		},
		AquariumOwnerValue: {
			owner: "",
		},
		AquariumValue: {
			owner: "",
		fish_count: 0,
		decoration_count: 0,
			max_capacity: 0,
			cleanliness: 0,
			housed_fish: [0],
			housed_decorations: [0],
			max_decorations: 0,
		},
		Decoration: {
		id: 0,
			owner: "",
		aquarium_id: 0,
			name: 0,
			description: 0,
		price: 0,
			rarity: 0,
		},
		DecorationCounter: {
			id: 0,
		current_val: 0,
		},
		DecorationCounterValue: {
		current_val: 0,
		},
		DecorationValue: {
			owner: "",
		aquarium_id: 0,
			name: 0,
			description: 0,
		price: 0,
			rarity: 0,
		},
		Fish: {
		id: 0,
			fish_type: 0,
			age: 0,
			hunger_level: 0,
			health: 0,
			growth: 0,
			growth_rate: 0,
			owner: "",
		species: new CairoCustomEnum({ 
					AngelFish: "",
				GoldFish: undefined,
				Betta: undefined,
				NeonTetra: undefined,
				Corydoras: undefined,
				Hybrid: undefined, }),
			generation: 0,
			color: 0,
		pattern: new CairoCustomEnum({ 
					Plain: "",
				Spotted: undefined,
				Stripes: undefined, }),
			size: 0,
			speed: 0,
			birth_time: 0,
			parent_ids: [0, 0],
			mutation_rate: 0,
			growth_counter: 0,
			can_grow: false,
		aquarium_id: 0,
			offspings: [0],
			family_tree: [{ parent1: 0, parent2: 0, }],
		},
		FishCounter: {
			id: 0,
		current_val: 0,
		},
		FishCounterValue: {
		current_val: 0,
		},
		FishOwner: {
		id: 0,
			owner: "",
		},
		FishOwnerValue: {
			owner: "",
		},
		FishParents: {
		parent1: 0,
		parent2: 0,
		},
		FishValue: {
			fish_type: 0,
			age: 0,
			hunger_level: 0,
			health: 0,
			growth: 0,
			growth_rate: 0,
			owner: "",
		species: new CairoCustomEnum({ 
					AngelFish: "",
				GoldFish: undefined,
				Betta: undefined,
				NeonTetra: undefined,
				Corydoras: undefined,
				Hybrid: undefined, }),
			generation: 0,
			color: 0,
		pattern: new CairoCustomEnum({ 
					Plain: "",
				Spotted: undefined,
				Stripes: undefined, }),
			size: 0,
			speed: 0,
			birth_time: 0,
			parent_ids: [0, 0],
			mutation_rate: 0,
			growth_counter: 0,
			can_grow: false,
		aquarium_id: 0,
			offspings: [0],
			family_tree: [{ parent1: 0, parent2: 0, }],
		},
		Game: {
			id: 0,
			created_by: 0,
			is_initialized: false,
			total_players: 0,
			total_aquariums: 0,
			total_fish: 0,
			total_decorations: 0,
			fish_genealogy_enabled: false,
			fish_genes_onchain: false,
			marketplace_enabled: false,
			auctions_enabled: false,
			active_events: [0],
			leaderboard: [[0, 0]],
			created_at: 0,
			last_updated: 0,
		},
		GameCounter: {
			id: 0,
			current_val: 0,
		},
		GameCounterValue: {
			current_val: 0,
		},
		GameValue: {
			created_by: 0,
			is_initialized: false,
			total_players: 0,
			total_aquariums: 0,
			total_fish: 0,
			total_decorations: 0,
			fish_genealogy_enabled: false,
			fish_genes_onchain: false,
			marketplace_enabled: false,
			auctions_enabled: false,
			active_events: [0],
			leaderboard: [[0, 0]],
			created_at: 0,
			last_updated: 0,
		},
		AddressToUsername: {
			address: "",
			username: 0,
		},
		AddressToUsernameValue: {
			username: 0,
		},
		Player: {
			wallet: "",
		id: 0,
			username: 0,
			inventory_ref: "",
			is_verified: false,
			aquarium_count: 0,
			fish_count: 0,
			player_fishes: [0],
			player_aquariums: [0],
			player_decorations: [0],
			decoration_count: 0,
			registered_at: 0,
		},
		PlayerCounter: {
			id: 0,
		current_val: 0,
		},
		PlayerCounterValue: {
		current_val: 0,
		},
		PlayerValue: {
		id: 0,
			username: 0,
			inventory_ref: "",
			is_verified: false,
			aquarium_count: 0,
			fish_count: 0,
			player_fishes: [0],
			player_aquariums: [0],
			player_decorations: [0],
			decoration_count: 0,
			registered_at: 0,
		},
		UsernameToAddress: {
			username: 0,
			address: "",
		},
		UsernameToAddressValue: {
			address: "",
		},

		DecorationAddedToAquarium: {
		decoration_id: 0,
		aquarium_id: 0,
			timestamp: 0,
		},
		DecorationAddedToAquariumValue: {
			timestamp: 0,
		},
		DecorationCreated: {
		id: 0,
		aquarium_id: 0,
			owner: "",
			name: 0,
			rarity: 0,
		price: 0,
			timestamp: 0,
		},
		DecorationCreatedValue: {
			owner: "",
			name: 0,
			rarity: 0,
		price: 0,
			timestamp: 0,
		},
		DecorationMoved: {
		decoration_id: 0,
		from: 0,
		to: 0,
			timestamp: 0,
		},
		DecorationMovedValue: {
		from: 0,
		to: 0,
			timestamp: 0,
		},
		FishAddedToAquarium: {
		fish_id: 0,
		aquarium_id: 0,
			timestamp: 0,
		},
		FishAddedToAquariumValue: {
			timestamp: 0,
		},
		FishBred: {
		offspring_id: 0,
			owner: "",
		parent1_id: 0,
		parent2_id: 0,
		aquarium_id: 0,
			timestamp: 0,
		},
		FishBredValue: {
		parent1_id: 0,
		parent2_id: 0,
		aquarium_id: 0,
			timestamp: 0,
		},
		FishCreated: {
		fish_id: 0,
			owner: "",
		aquarium_id: 0,
			timestamp: 0,
		},
		FishCreatedValue: {
		aquarium_id: 0,
			timestamp: 0,
		},
		FishMoved: {
		fish_id: 0,
		from: 0,
		to: 0,
			timestamp: 0,
		},
		FishMovedValue: {
		from: 0,
		to: 0,
			timestamp: 0,
		},
		PlayerCreated: {
			username: 0,
			player: "",
		player_id: 0,
		aquarium_id: 0,
		decoration_id: 0,
		fish_id: 0,
			timestamp: 0,
		},
		PlayerCreatedValue: {
		player_id: 0,
		aquarium_id: 0,
		decoration_id: 0,
		fish_id: 0,
			timestamp: 0,
		},
	},
	achievement: {},
};
export enum ModelsMapping {
	Aquarium = 'aqua_stark-Aquarium',
	AquariumCounter = 'aqua_stark-AquariumCounter',
	AquariumCounterValue = 'aqua_stark-AquariumCounterValue',
	AquariumFishes = 'aqua_stark-AquariumFishes',
	AquariumFishesValue = 'aqua_stark-AquariumFishesValue',
	AquariumOwner = 'aqua_stark-AquariumOwner',
	AquariumOwnerValue = 'aqua_stark-AquariumOwnerValue',
	AquariumValue = 'aqua_stark-AquariumValue',
	Decoration = 'aqua_stark-Decoration',
	DecorationCounter = 'aqua_stark-DecorationCounter',
	DecorationCounterValue = 'aqua_stark-DecorationCounterValue',
	DecorationValue = 'aqua_stark-DecorationValue',
	Fish = 'aqua_stark-Fish',
	FishCounter = 'aqua_stark-FishCounter',
	FishCounterValue = 'aqua_stark-FishCounterValue',
	FishOwner = 'aqua_stark-FishOwner',
	FishOwnerValue = 'aqua_stark-FishOwnerValue',
	FishParents = 'aqua_stark-FishParents',
	FishValue = 'aqua_stark-FishValue',
	Pattern = 'aqua_stark-Pattern',
	Species = 'aqua_stark-Species',
	Game = 'aqua_stark-Game',
	GameCounter = 'aqua_stark-GameCounter',
	GameCounterValue = 'aqua_stark-GameCounterValue',
	GameValue = 'aqua_stark-GameValue',
	AddressToUsername = 'aqua_stark-AddressToUsername',
	AddressToUsernameValue = 'aqua_stark-AddressToUsernameValue',
	Player = 'aqua_stark-Player',
	PlayerCounter = 'aqua_stark-PlayerCounter',
	PlayerCounterValue = 'aqua_stark-PlayerCounterValue',
	PlayerValue = 'aqua_stark-PlayerValue',
	UsernameToAddress = 'aqua_stark-UsernameToAddress',
	UsernameToAddressValue = 'aqua_stark-UsernameToAddressValue',
	TrophyCreation = 'achievement-TrophyCreation',
	TrophyCreationValue = 'achievement-TrophyCreationValue',
	TrophyProgression = 'achievement-TrophyProgression',
	TrophyProgressionValue = 'achievement-TrophyProgressionValue',
	Task = 'achievement-Task',
	DecorationAddedToAquarium = 'aqua_stark-DecorationAddedToAquarium',
	DecorationAddedToAquariumValue = 'aqua_stark-DecorationAddedToAquariumValue',
	DecorationCreated = 'aqua_stark-DecorationCreated',
	DecorationCreatedValue = 'aqua_stark-DecorationCreatedValue',
	DecorationMoved = 'aqua_stark-DecorationMoved',
	DecorationMovedValue = 'aqua_stark-DecorationMovedValue',
	FishAddedToAquarium = 'aqua_stark-FishAddedToAquarium',
	FishAddedToAquariumValue = 'aqua_stark-FishAddedToAquariumValue',
	FishBred = 'aqua_stark-FishBred',
	FishBredValue = 'aqua_stark-FishBredValue',
	FishCreated = 'aqua_stark-FishCreated',
	FishCreatedValue = 'aqua_stark-FishCreatedValue',
	FishMoved = 'aqua_stark-FishMoved',
	FishMovedValue = 'aqua_stark-FishMovedValue',
	PlayerCreated = 'aqua_stark-PlayerCreated',
	PlayerCreatedValue = 'aqua_stark-PlayerCreatedValue',
}