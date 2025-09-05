import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, CairoOption, CairoOptionVariant, BigNumberish } from 'starknet';

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

// Type definition for `aqua_stark::models::auctions_model::Auction` struct
export interface Auction {
	auction_id: BigNumberish;
	seller: string;
	fish_id: BigNumberish;
	start_time: BigNumberish;
	end_time: BigNumberish;
	reserve_price: BigNumberish;
	highest_bid: BigNumberish;
	highest_bidder: CairoOption<string>;
	active: boolean;
}

// Type definition for `aqua_stark::models::auctions_model::AuctionCounter` struct
export interface AuctionCounter {
	id: BigNumberish;
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::auctions_model::AuctionCounterValue` struct
export interface AuctionCounterValue {
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::auctions_model::AuctionValue` struct
export interface AuctionValue {
	seller: string;
	fish_id: BigNumberish;
	start_time: BigNumberish;
	end_time: BigNumberish;
	reserve_price: BigNumberish;
	highest_bid: BigNumberish;
	highest_bidder: CairoOption<string>;
	active: boolean;
}

// Type definition for `aqua_stark::models::auctions_model::FishOwnerA` struct
export interface FishOwnerA {
	fish_id: BigNumberish;
	owner: string;
	locked: boolean;
}

// Type definition for `aqua_stark::models::auctions_model::FishOwnerAValue` struct
export interface FishOwnerAValue {
	owner: string;
	locked: boolean;
}

// Type definition for `aqua_stark::models::daily_challange::ChallengeParticipation` struct
export interface ChallengeParticipation {
	challenge_id: BigNumberish;
	participant: string;
	joined: boolean;
	completed: boolean;
	reward_claimed: boolean;
}

// Type definition for `aqua_stark::models::daily_challange::ChallengeParticipationValue` struct
export interface ChallengeParticipationValue {
	joined: boolean;
	completed: boolean;
	reward_claimed: boolean;
}

// Type definition for `aqua_stark::models::daily_challange::Challenge_Counter` struct
export interface ChallengeCounter {
	id: BigNumberish;
	counter: BigNumberish;
}

// Type definition for `aqua_stark::models::daily_challange::Challenge_CounterValue` struct
export interface ChallengeCounterValue {
	counter: BigNumberish;
}

// Type definition for `aqua_stark::models::daily_challange::DailyChallenge` struct
export interface DailyChallenge {
	challenge_id: BigNumberish;
	challenge_type: BigNumberish;
	param1: BigNumberish;
	param2: BigNumberish;
	value1: BigNumberish;
	value2: BigNumberish;
	difficulty: BigNumberish;
	active: boolean;
}

// Type definition for `aqua_stark::models::daily_challange::DailyChallengeValue` struct
export interface DailyChallengeValue {
	challenge_type: BigNumberish;
	param1: BigNumberish;
	param2: BigNumberish;
	value1: BigNumberish;
	value2: BigNumberish;
	difficulty: BigNumberish;
	active: boolean;
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
	locked: boolean;
}

// Type definition for `aqua_stark::models::fish_model::FishOwnerValue` struct
export interface FishOwnerValue {
	owner: string;
	locked: boolean;
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

// Type definition for `aqua_stark::models::fish_model::Listing` struct
export interface Listing {
	id: BigNumberish;
	fish_id: BigNumberish;
	price: BigNumberish;
	is_active: boolean;
}

// Type definition for `aqua_stark::models::fish_model::ListingValue` struct
export interface ListingValue {
	fish_id: BigNumberish;
	price: BigNumberish;
	is_active: boolean;
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
	experience_points: BigNumberish;
	decoration_count: BigNumberish;
	transaction_count: BigNumberish;
	registered_at: BigNumberish;
	player_fishes: Array<BigNumberish>;
	player_aquariums: Array<BigNumberish>;
	player_decorations: Array<BigNumberish>;
	transaction_history: Array<BigNumberish>;
	last_action_reset: BigNumberish;
	daily_fish_creations: BigNumberish;
	daily_decoration_creations: BigNumberish;
	daily_aquarium_creations: BigNumberish;
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
	experience_points: BigNumberish;
	decoration_count: BigNumberish;
	transaction_count: BigNumberish;
	registered_at: BigNumberish;
	player_fishes: Array<BigNumberish>;
	player_aquariums: Array<BigNumberish>;
	player_decorations: Array<BigNumberish>;
	transaction_history: Array<BigNumberish>;
	last_action_reset: BigNumberish;
	daily_fish_creations: BigNumberish;
	daily_decoration_creations: BigNumberish;
	daily_aquarium_creations: BigNumberish;
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

// Type definition for `aqua_stark::models::session::SessionAnalytics` struct
export interface SessionAnalytics {
	session_id: BigNumberish;
	total_transactions: BigNumberish;
	successful_transactions: BigNumberish;
	failed_transactions: BigNumberish;
	total_gas_used: BigNumberish;
	average_gas_per_tx: BigNumberish;
	last_activity: BigNumberish;
	created_at: BigNumberish;
}

// Type definition for `aqua_stark::models::session::SessionAnalyticsValue` struct
export interface SessionAnalyticsValue {
	total_transactions: BigNumberish;
	successful_transactions: BigNumberish;
	failed_transactions: BigNumberish;
	total_gas_used: BigNumberish;
	average_gas_per_tx: BigNumberish;
	last_activity: BigNumberish;
	created_at: BigNumberish;
}

// Type definition for `aqua_stark::models::session::SessionKey` struct
export interface SessionKey {
	session_id: BigNumberish;
	player_address: string;
	created_at: BigNumberish;
	expires_at: BigNumberish;
	last_used: BigNumberish;
	max_transactions: BigNumberish;
	used_transactions: BigNumberish;
	status: BigNumberish;
	is_valid: boolean;
	auto_renewal_enabled: boolean;
	session_type: BigNumberish;
	permissions: Array<BigNumberish>;
}

// Type definition for `aqua_stark::models::session::SessionKeyValue` struct
export interface SessionKeyValue {
	created_at: BigNumberish;
	expires_at: BigNumberish;
	last_used: BigNumberish;
	max_transactions: BigNumberish;
	used_transactions: BigNumberish;
	status: BigNumberish;
	is_valid: boolean;
	auto_renewal_enabled: boolean;
	session_type: BigNumberish;
	permissions: Array<BigNumberish>;
}

// Type definition for `aqua_stark::models::session::SessionOperation` struct
export interface SessionOperation {
	session_id: BigNumberish;
	operation_id: BigNumberish;
	operation_type: BigNumberish;
	timestamp: BigNumberish;
	gas_used: BigNumberish;
	success: boolean;
	error_code: CairoOption<BigNumberish>;
}

// Type definition for `aqua_stark::models::session::SessionOperationValue` struct
export interface SessionOperationValue {
	operation_type: BigNumberish;
	timestamp: BigNumberish;
	gas_used: BigNumberish;
	success: boolean;
	error_code: CairoOption<BigNumberish>;
}

// Type definition for `aqua_stark::models::shop_model::ShopCatalogModel` struct
export interface ShopCatalogModel {
	id: string;
	owner: string;
	shopItems: BigNumberish;
	latest_item_id: BigNumberish;
}

// Type definition for `aqua_stark::models::shop_model::ShopCatalogModelValue` struct
export interface ShopCatalogModelValue {
	owner: string;
	shopItems: BigNumberish;
	latest_item_id: BigNumberish;
}

// Type definition for `aqua_stark::models::shop_model::ShopItemModel` struct
export interface ShopItemModel {
	id: BigNumberish;
	price: BigNumberish;
	stock: BigNumberish;
	description: BigNumberish;
}

// Type definition for `aqua_stark::models::shop_model::ShopItemModelValue` struct
export interface ShopItemModelValue {
	price: BigNumberish;
	stock: BigNumberish;
	description: BigNumberish;
}

// Type definition for `aqua_stark::models::trade_model::ActiveTradeOffers` struct
export interface ActiveTradeOffers {
	creator: string;
	offers: Array<BigNumberish>;
}

// Type definition for `aqua_stark::models::trade_model::ActiveTradeOffersValue` struct
export interface ActiveTradeOffersValue {
	offers: Array<BigNumberish>;
}

// Type definition for `aqua_stark::models::trade_model::FishLock` struct
export interface FishLock {
	fish_id: BigNumberish;
	is_locked: boolean;
	locked_by_offer: BigNumberish;
	locked_at: BigNumberish;
}

// Type definition for `aqua_stark::models::trade_model::FishLockValue` struct
export interface FishLockValue {
	is_locked: boolean;
	locked_by_offer: BigNumberish;
	locked_at: BigNumberish;
}

// Type definition for `aqua_stark::models::trade_model::TradeOffer` struct
export interface TradeOffer {
	id: BigNumberish;
	creator: string;
	offered_fish_id: BigNumberish;
	requested_fish_criteria: MatchCriteriaEnum;
	requested_fish_id: CairoOption<BigNumberish>;
	requested_species: CairoOption<BigNumberish>;
	requested_generation: CairoOption<BigNumberish>;
	requested_traits: Array<BigNumberish>;
	status: TradeOfferStatusEnum;
	created_at: BigNumberish;
	expires_at: BigNumberish;
	is_locked: boolean;
}

// Type definition for `aqua_stark::models::trade_model::TradeOfferCounter` struct
export interface TradeOfferCounter {
	id: BigNumberish;
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::trade_model::TradeOfferCounterValue` struct
export interface TradeOfferCounterValue {
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::trade_model::TradeOfferValue` struct
export interface TradeOfferValue {
	creator: string;
	offered_fish_id: BigNumberish;
	requested_fish_criteria: MatchCriteriaEnum;
	requested_fish_id: CairoOption<BigNumberish>;
	requested_species: CairoOption<BigNumberish>;
	requested_generation: CairoOption<BigNumberish>;
	requested_traits: Array<BigNumberish>;
	status: TradeOfferStatusEnum;
	created_at: BigNumberish;
	expires_at: BigNumberish;
	is_locked: boolean;
}

// Type definition for `aqua_stark::models::transaction_model::EventCounter` struct
export interface EventCounter {
	target: BigNumberish;
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::transaction_model::EventCounterValue` struct
export interface EventCounterValue {
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::transaction_model::EventTypeDetails` struct
export interface EventTypeDetails {
	type_id: BigNumberish;
	name: string;
	total_logged: BigNumberish;
	transaction_history: Array<BigNumberish>;
}

// Type definition for `aqua_stark::models::transaction_model::EventTypeDetailsValue` struct
export interface EventTypeDetailsValue {
	name: string;
	total_logged: BigNumberish;
	transaction_history: Array<BigNumberish>;
}

// Type definition for `aqua_stark::models::transaction_model::TransactionCounter` struct
export interface TransactionCounter {
	target: BigNumberish;
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::transaction_model::TransactionCounterValue` struct
export interface TransactionCounterValue {
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::transaction_model::TransactionLog` struct
export interface TransactionLog {
	id: BigNumberish;
	event_type_id: BigNumberish;
	player: string;
	payload: Array<BigNumberish>;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::models::transaction_model::TransactionLogValue` struct
export interface TransactionLogValue {
	event_type_id: BigNumberish;
	player: string;
	payload: Array<BigNumberish>;
	timestamp: BigNumberish;
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

// Type definition for `aqua_stark::base::events::AquariumCleaned` struct
export interface AquariumCleaned {
	aquarium_id: BigNumberish;
	owner: string;
	amount_cleaned: BigNumberish;
	old_cleanliness: BigNumberish;
	new_cleanliness: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::AquariumCleanedValue` struct
export interface AquariumCleanedValue {
	amount_cleaned: BigNumberish;
	old_cleanliness: BigNumberish;
	new_cleanliness: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::AquariumCreated` struct
export interface AquariumCreated {
	aquarium_id: BigNumberish;
	owner: string;
	max_capacity: BigNumberish;
	max_decorations: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::AquariumCreatedValue` struct
export interface AquariumCreatedValue {
	max_capacity: BigNumberish;
	max_decorations: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::DecorationAddedToAquarium` struct
export interface DecorationAddedToAquarium {
	decoration_id: BigNumberish;
	aquarium_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::DecorationAddedToAquariumValue` struct
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

// Type definition for `aqua_stark::base::events::DecorationRemovedFromAquarium` struct
export interface DecorationRemovedFromAquarium {
	aquarium_id: BigNumberish;
	decoration_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::DecorationRemovedFromAquariumValue` struct
export interface DecorationRemovedFromAquariumValue {
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::EventTypeRegistered` struct
export interface EventTypeRegistered {
	event_type_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::EventTypeRegisteredValue` struct
export interface EventTypeRegisteredValue {
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::ExperienceConfigUpdated` struct
export interface ExperienceConfigUpdated {
	base_experience: BigNumberish;
	experience_multiplier: BigNumberish;
	max_level: BigNumberish;
}

// Type definition for `aqua_stark::base::events::ExperienceConfigUpdatedValue` struct
export interface ExperienceConfigUpdatedValue {
	experience_multiplier: BigNumberish;
	max_level: BigNumberish;
}

// Type definition for `aqua_stark::base::events::ExperienceEarned` struct
export interface ExperienceEarned {
	player: string;
	amount: BigNumberish;
	total_experience: BigNumberish;
}

// Type definition for `aqua_stark::base::events::ExperienceEarnedValue` struct
export interface ExperienceEarnedValue {
	amount: BigNumberish;
	total_experience: BigNumberish;
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

// Type definition for `aqua_stark::base::events::FishLocked` struct
export interface FishLocked {
	fish_id: BigNumberish;
	owner: string;
	locked_by_offer: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::FishLockedValue` struct
export interface FishLockedValue {
	locked_by_offer: BigNumberish;
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

// Type definition for `aqua_stark::base::events::FishPurchased` struct
export interface FishPurchased {
	buyer: string;
	seller: string;
	price: BigNumberish;
	fish_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::FishPurchasedValue` struct
export interface FishPurchasedValue {
	seller: string;
	price: BigNumberish;
	fish_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::FishUnlocked` struct
export interface FishUnlocked {
	fish_id: BigNumberish;
	owner: string;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::FishUnlockedValue` struct
export interface FishUnlockedValue {
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::LevelUp` struct
export interface LevelUp {
	player: string;
	old_level: BigNumberish;
	new_level: BigNumberish;
	total_experience: BigNumberish;
}

// Type definition for `aqua_stark::base::events::LevelUpValue` struct
export interface LevelUpValue {
	old_level: BigNumberish;
	new_level: BigNumberish;
	total_experience: BigNumberish;
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

// Type definition for `aqua_stark::base::events::PlayerEventLogged` struct
export interface PlayerEventLogged {
	id: BigNumberish;
	event_type_id: BigNumberish;
	player: string;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::PlayerEventLoggedValue` struct
export interface PlayerEventLoggedValue {
	player: string;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TradeOfferAccepted` struct
export interface TradeOfferAccepted {
	offer_id: BigNumberish;
	acceptor: string;
	creator: string;
	creator_fish_id: BigNumberish;
	acceptor_fish_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TradeOfferAcceptedValue` struct
export interface TradeOfferAcceptedValue {
	creator_fish_id: BigNumberish;
	acceptor_fish_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TradeOfferCancelled` struct
export interface TradeOfferCancelled {
	offer_id: BigNumberish;
	creator: string;
	offered_fish_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TradeOfferCancelledValue` struct
export interface TradeOfferCancelledValue {
	offered_fish_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TradeOfferCreated` struct
export interface TradeOfferCreated {
	offer_id: BigNumberish;
	creator: string;
	offered_fish_id: BigNumberish;
	criteria: MatchCriteriaEnum;
	requested_fish_id: CairoOption<BigNumberish>;
	requested_species: CairoOption<BigNumberish>;
	requested_generation: CairoOption<BigNumberish>;
	expires_at: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TradeOfferCreatedValue` struct
export interface TradeOfferCreatedValue {
	offered_fish_id: BigNumberish;
	criteria: MatchCriteriaEnum;
	requested_fish_id: CairoOption<BigNumberish>;
	requested_species: CairoOption<BigNumberish>;
	requested_generation: CairoOption<BigNumberish>;
	expires_at: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TradeOfferExpired` struct
export interface TradeOfferExpired {
	offer_id: BigNumberish;
	creator: string;
	offered_fish_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TradeOfferExpiredValue` struct
export interface TradeOfferExpiredValue {
	offered_fish_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TransactionConfirmed` struct
export interface TransactionConfirmed {
	transaction_id: BigNumberish;
	player: string;
	event_type_id: BigNumberish;
	confirmation_hash: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TransactionConfirmedValue` struct
export interface TransactionConfirmedValue {
	event_type_id: BigNumberish;
	confirmation_hash: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TransactionInitiated` struct
export interface TransactionInitiated {
	transaction_id: BigNumberish;
	player: string;
	event_type_id: BigNumberish;
	payload_size: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TransactionInitiatedValue` struct
export interface TransactionInitiatedValue {
	event_type_id: BigNumberish;
	payload_size: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TransactionProcessed` struct
export interface TransactionProcessed {
	transaction_id: BigNumberish;
	player: string;
	event_type_id: BigNumberish;
	processing_time: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::TransactionProcessedValue` struct
export interface TransactionProcessedValue {
	event_type_id: BigNumberish;
	processing_time: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::DecorationGameMoved` struct
export interface DecorationGameMoved {
	decoration_id: BigNumberish;
	from_aquarium: BigNumberish;
	to_aquarium: BigNumberish;
	owner: string;
	experience_earned: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::DecorationGameMovedValue` struct
export interface DecorationGameMovedValue {
	from_aquarium: BigNumberish;
	to_aquarium: BigNumberish;
	owner: string;
	experience_earned: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::FishGameBred` struct
export interface FishGameBred {
	offspring_id: BigNumberish;
	owner: string;
	parent1_id: BigNumberish;
	parent2_id: BigNumberish;
	aquarium_id: BigNumberish;
	experience_earned: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::FishGameBredValue` struct
export interface FishGameBredValue {
	parent1_id: BigNumberish;
	parent2_id: BigNumberish;
	aquarium_id: BigNumberish;
	experience_earned: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::FishGameCreated` struct
export interface FishGameCreated {
	fish_id: BigNumberish;
	owner: string;
	aquarium_id: BigNumberish;
	species: SpeciesEnum;
	experience_earned: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::FishGameCreatedValue` struct
export interface FishGameCreatedValue {
	aquarium_id: BigNumberish;
	species: SpeciesEnum;
	experience_earned: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::FishGameListed` struct
export interface FishGameListed {
	fish_id: BigNumberish;
	owner: string;
	price: BigNumberish;
	experience_earned: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::FishGameListedValue` struct
export interface FishGameListedValue {
	price: BigNumberish;
	experience_earned: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::FishGameMoved` struct
export interface FishGameMoved {
	fish_id: BigNumberish;
	from_aquarium: BigNumberish;
	to_aquarium: BigNumberish;
	owner: string;
	experience_earned: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::FishGameMovedValue` struct
export interface FishGameMovedValue {
	from_aquarium: BigNumberish;
	to_aquarium: BigNumberish;
	owner: string;
	experience_earned: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::FishGamePurchased` struct
export interface FishGamePurchased {
	fish_id: BigNumberish;
	buyer: string;
	seller: string;
	price: BigNumberish;
	experience_earned: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::FishGamePurchasedValue` struct
export interface FishGamePurchasedValue {
	buyer: string;
	seller: string;
	price: BigNumberish;
	experience_earned: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::GameExperienceEarned` struct
export interface GameExperienceEarned {
	player: string;
	amount: BigNumberish;
	total_experience: BigNumberish;
	action_type: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::GameExperienceEarnedValue` struct
export interface GameExperienceEarnedValue {
	amount: BigNumberish;
	total_experience: BigNumberish;
	action_type: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::GameLevelUp` struct
export interface GameLevelUp {
	player: string;
	old_level: BigNumberish;
	new_level: BigNumberish;
	total_experience: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::GameLevelUpValue` struct
export interface GameLevelUpValue {
	old_level: BigNumberish;
	new_level: BigNumberish;
	total_experience: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::GameOperationCompleted` struct
export interface GameOperationCompleted {
	player: string;
	operation_type: BigNumberish;
	success: boolean;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::GameOperationCompletedValue` struct
export interface GameOperationCompletedValue {
	operation_type: BigNumberish;
	success: boolean;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::GameStateChanged` struct
export interface GameStateChanged {
	player: string;
	state_type: BigNumberish;
	state_value: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::game_events::GameStateChangedValue` struct
export interface GameStateChangedValue {
	state_type: BigNumberish;
	state_value: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::models::auctions_model::AuctionEnded` struct
export interface AuctionEnded {
	auction_id: BigNumberish;
	winner: CairoOption<string>;
	final_price: BigNumberish;
}

// Type definition for `aqua_stark::models::auctions_model::AuctionEndedValue` struct
export interface AuctionEndedValue {
	winner: CairoOption<string>;
	final_price: BigNumberish;
}

// Type definition for `aqua_stark::models::auctions_model::AuctionStarted` struct
export interface AuctionStarted {
	auction_id: BigNumberish;
	seller: string;
	fish_id: BigNumberish;
	start_time: BigNumberish;
	end_time: BigNumberish;
	reserve_price: BigNumberish;
}

// Type definition for `aqua_stark::models::auctions_model::AuctionStartedValue` struct
export interface AuctionStartedValue {
	fish_id: BigNumberish;
	start_time: BigNumberish;
	end_time: BigNumberish;
	reserve_price: BigNumberish;
}

// Type definition for `aqua_stark::models::auctions_model::BidPlaced` struct
export interface BidPlaced {
	auction_id: BigNumberish;
	bidder: string;
	amount: BigNumberish;
}

// Type definition for `aqua_stark::models::auctions_model::BidPlacedValue` struct
export interface BidPlacedValue {
	bidder: string;
	amount: BigNumberish;
}

// Type definition for `aqua_stark::models::daily_challange::ChallengeCompleted` struct
export interface ChallengeCompleted {
	challenge_id: BigNumberish;
	participant: string;
}

// Type definition for `aqua_stark::models::daily_challange::ChallengeCompletedValue` struct
export interface ChallengeCompletedValue {
	participant: string;
}

// Type definition for `aqua_stark::models::daily_challange::ChallengeCreated` struct
export interface ChallengeCreated {
	challenge_id: BigNumberish;
	challenge_type: BigNumberish;
	param1: BigNumberish;
	param2: BigNumberish;
	value1: BigNumberish;
	value2: BigNumberish;
	difficulty: BigNumberish;
}

// Type definition for `aqua_stark::models::daily_challange::ChallengeCreatedValue` struct
export interface ChallengeCreatedValue {
	challenge_type: BigNumberish;
	param1: BigNumberish;
	param2: BigNumberish;
	value1: BigNumberish;
	value2: BigNumberish;
	difficulty: BigNumberish;
}

// Type definition for `aqua_stark::models::daily_challange::ParticipantJoined` struct
export interface ParticipantJoined {
	challenge_id: BigNumberish;
	participant: string;
}

// Type definition for `aqua_stark::models::daily_challange::ParticipantJoinedValue` struct
export interface ParticipantJoinedValue {
	participant: string;
}

// Type definition for `aqua_stark::models::daily_challange::RewardClaimed` struct
export interface RewardClaimed {
	challenge_id: BigNumberish;
	participant: string;
	reward_amount: BigNumberish;
}

// Type definition for `aqua_stark::models::daily_challange::RewardClaimedValue` struct
export interface RewardClaimedValue {
	reward_amount: BigNumberish;
}

// Type definition for `aqua_stark::systems::session::session::SessionAutoRenewed` struct
export interface SessionAutoRenewed {
	session_id: BigNumberish;
	player_address: string;
	new_expires_at: BigNumberish;
	new_max_transactions: BigNumberish;
}

// Type definition for `aqua_stark::systems::session::session::SessionAutoRenewedValue` struct
export interface SessionAutoRenewedValue {
	player_address: string;
	new_expires_at: BigNumberish;
	new_max_transactions: BigNumberish;
}

// Type definition for `aqua_stark::systems::session::session::SessionKeyCreated` struct
export interface SessionKeyCreated {
	session_id: BigNumberish;
	player_address: string;
	duration: BigNumberish;
	max_transactions: BigNumberish;
	session_type: BigNumberish;
}

// Type definition for `aqua_stark::systems::session::session::SessionKeyCreatedValue` struct
export interface SessionKeyCreatedValue {
	player_address: string;
	duration: BigNumberish;
	max_transactions: BigNumberish;
	session_type: BigNumberish;
}

// Type definition for `aqua_stark::systems::session::session::SessionKeyRevoked` struct
export interface SessionKeyRevoked {
	session_id: BigNumberish;
	player_address: string;
	reason: BigNumberish;
}

// Type definition for `aqua_stark::systems::session::session::SessionKeyRevokedValue` struct
export interface SessionKeyRevokedValue {
	player_address: string;
	reason: BigNumberish;
}

// Type definition for `aqua_stark::systems::session::session::SessionKeyUsed` struct
export interface SessionKeyUsed {
	session_id: BigNumberish;
	player_address: string;
	operation_type: BigNumberish;
	gas_used: BigNumberish;
}

// Type definition for `aqua_stark::systems::session::session::SessionKeyUsedValue` struct
export interface SessionKeyUsedValue {
	player_address: string;
	operation_type: BigNumberish;
	gas_used: BigNumberish;
}

// Type definition for `aqua_stark::systems::session::session::SessionOperationTracked` struct
export interface SessionOperationTracked {
	session_id: BigNumberish;
	operation_id: BigNumberish;
	operation_type: BigNumberish;
	timestamp: BigNumberish;
	gas_used: BigNumberish;
	success: boolean;
}

// Type definition for `aqua_stark::systems::session::session::SessionOperationTrackedValue` struct
export interface SessionOperationTrackedValue {
	operation_id: BigNumberish;
	operation_type: BigNumberish;
	timestamp: BigNumberish;
	gas_used: BigNumberish;
	success: boolean;
}

// Type definition for `aqua_stark::systems::session::session::SessionPerformanceMetrics` struct
export interface SessionPerformanceMetrics {
	session_id: BigNumberish;
	average_gas_per_tx: BigNumberish;
	success_rate: BigNumberish;
	last_activity: BigNumberish;
}

// Type definition for `aqua_stark::systems::session::session::SessionPerformanceMetricsValue` struct
export interface SessionPerformanceMetricsValue {
	average_gas_per_tx: BigNumberish;
	success_rate: BigNumberish;
	last_activity: BigNumberish;
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

// Type definition for `aqua_stark::models::trade_model::MatchCriteria` enum
export const matchCriteria = [
	'ExactId',
	'Species',
	'SpeciesAndGen',
	'Traits',
] as const;
export type MatchCriteria = { [key in typeof matchCriteria[number]]: string };
export type MatchCriteriaEnum = CairoCustomEnum;

// Type definition for `aqua_stark::models::trade_model::TradeOfferStatus` enum
export const tradeOfferStatus = [
	'Active',
	'Completed',
	'Cancelled',
	'Expired',
] as const;
export type TradeOfferStatus = { [key in typeof tradeOfferStatus[number]]: string };
export type TradeOfferStatusEnum = CairoCustomEnum;

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
		Auction: Auction,
		AuctionCounter: AuctionCounter,
		AuctionCounterValue: AuctionCounterValue,
		AuctionValue: AuctionValue,
		FishOwnerA: FishOwnerA,
		FishOwnerAValue: FishOwnerAValue,
		ChallengeParticipation: ChallengeParticipation,
		ChallengeParticipationValue: ChallengeParticipationValue,
		Challenge_Counter: Challenge_Counter,
		Challenge_CounterValue: Challenge_CounterValue,
		DailyChallenge: DailyChallenge,
		DailyChallengeValue: DailyChallengeValue,
		Decoration: Decoration,
		DecorationCounter: DecorationCounter,
		DecorationCounterValue: DecorationCounterValue,
		DecorationValue: DecorationValue,
		Fish: Fish,
		FishCounter: FishCounter,
		FishCounterValue: FishCounterValue,
		FishOwner: FishOwner,
		FishOwnerValue: FishOwnerValue,
		FishParents: FishParents,
		FishValue: FishValue,
		Listing: Listing,
		ListingValue: ListingValue,
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
		UsernameToAddress: UsernameToAddress,
		UsernameToAddressValue: UsernameToAddressValue,
		SessionAnalytics: SessionAnalytics,
		SessionAnalyticsValue: SessionAnalyticsValue,
		SessionKey: SessionKey,
		SessionKeyValue: SessionKeyValue,
		SessionOperation: SessionOperation,
		SessionOperationValue: SessionOperationValue,
		ShopCatalogModel: ShopCatalogModel,
		ShopCatalogModelValue: ShopCatalogModelValue,
		ShopItemModel: ShopItemModel,
		ShopItemModelValue: ShopItemModelValue,
		ActiveTradeOffers: ActiveTradeOffers,
		ActiveTradeOffersValue: ActiveTradeOffersValue,
		FishLock: FishLock,
		FishLockValue: FishLockValue,
		TradeOffer: TradeOffer,
		TradeOfferCounter: TradeOfferCounter,
		TradeOfferCounterValue: TradeOfferCounterValue,
		TradeOfferValue: TradeOfferValue,
		EventCounter: EventCounter,
		EventCounterValue: EventCounterValue,
		EventTypeDetails: EventTypeDetails,
		EventTypeDetailsValue: EventTypeDetailsValue,
		TransactionCounter: TransactionCounter,
		TransactionCounterValue: TransactionCounterValue,
		TransactionLog: TransactionLog,
		TransactionLogValue: TransactionLogValue,
	},
	achievement: {
		TrophyCreation: TrophyCreation,
		TrophyCreationValue: TrophyCreationValue,
		TrophyProgression: TrophyProgression,
		TrophyProgressionValue: TrophyProgressionValue,
		Task: Task,
		AquariumCleaned: AquariumCleaned,
		AquariumCleanedValue: AquariumCleanedValue,
		AquariumCreated: AquariumCreated,
		AquariumCreatedValue: AquariumCreatedValue,
		DecorationAddedToAquarium: DecorationAddedToAquarium,
		DecorationAddedToAquariumValue: DecorationAddedToAquariumValue,
		DecorationCreated: DecorationCreated,
		DecorationCreatedValue: DecorationCreatedValue,
		DecorationMoved: DecorationMoved,
		DecorationMovedValue: DecorationMovedValue,
		DecorationRemovedFromAquarium: DecorationRemovedFromAquarium,
		DecorationRemovedFromAquariumValue: DecorationRemovedFromAquariumValue,
		EventTypeRegistered: EventTypeRegistered,
		EventTypeRegisteredValue: EventTypeRegisteredValue,
		ExperienceConfigUpdated: ExperienceConfigUpdated,
		ExperienceConfigUpdatedValue: ExperienceConfigUpdatedValue,
		ExperienceEarned: ExperienceEarned,
		ExperienceEarnedValue: ExperienceEarnedValue,
		FishAddedToAquarium: FishAddedToAquarium,
		FishAddedToAquariumValue: FishAddedToAquariumValue,
		FishBred: FishBred,
		FishBredValue: FishBredValue,
		FishCreated: FishCreated,
		FishCreatedValue: FishCreatedValue,
		FishLocked: FishLocked,
		FishLockedValue: FishLockedValue,
		FishMoved: FishMoved,
		FishMovedValue: FishMovedValue,
		FishPurchased: FishPurchased,
		FishPurchasedValue: FishPurchasedValue,
		FishUnlocked: FishUnlocked,
		FishUnlockedValue: FishUnlockedValue,
		LevelUp: LevelUp,
		LevelUpValue: LevelUpValue,
		PlayerCreated: PlayerCreated,
		PlayerCreatedValue: PlayerCreatedValue,
		PlayerEventLogged: PlayerEventLogged,
		PlayerEventLoggedValue: PlayerEventLoggedValue,
		TradeOfferAccepted: TradeOfferAccepted,
		TradeOfferAcceptedValue: TradeOfferAcceptedValue,
		TradeOfferCancelled: TradeOfferCancelled,
		TradeOfferCancelledValue: TradeOfferCancelledValue,
		TradeOfferCreated: TradeOfferCreated,
		TradeOfferCreatedValue: TradeOfferCreatedValue,
		TradeOfferExpired: TradeOfferExpired,
		TradeOfferExpiredValue: TradeOfferExpiredValue,
		TransactionConfirmed: TransactionConfirmed,
		TransactionConfirmedValue: TransactionConfirmedValue,
		TransactionInitiated: TransactionInitiated,
		TransactionInitiatedValue: TransactionInitiatedValue,
		TransactionProcessed: TransactionProcessed,
		TransactionProcessedValue: TransactionProcessedValue,
		DecorationGameMoved: DecorationGameMoved,
		DecorationGameMovedValue: DecorationGameMovedValue,
		FishGameBred: FishGameBred,
		FishGameBredValue: FishGameBredValue,
		FishGameCreated: FishGameCreated,
		FishGameCreatedValue: FishGameCreatedValue,
		FishGameListed: FishGameListed,
		FishGameListedValue: FishGameListedValue,
		FishGameMoved: FishGameMoved,
		FishGameMovedValue: FishGameMovedValue,
		FishGamePurchased: FishGamePurchased,
		FishGamePurchasedValue: FishGamePurchasedValue,
		GameExperienceEarned: GameExperienceEarned,
		GameExperienceEarnedValue: GameExperienceEarnedValue,
		GameLevelUp: GameLevelUp,
		GameLevelUpValue: GameLevelUpValue,
		GameOperationCompleted: GameOperationCompleted,
		GameOperationCompletedValue: GameOperationCompletedValue,
		GameStateChanged: GameStateChanged,
		GameStateChangedValue: GameStateChangedValue,
		AuctionEnded: AuctionEnded,
		AuctionEndedValue: AuctionEndedValue,
		AuctionStarted: AuctionStarted,
		AuctionStartedValue: AuctionStartedValue,
		BidPlaced: BidPlaced,
		BidPlacedValue: BidPlacedValue,
		ChallengeCompleted: ChallengeCompleted,
		ChallengeCompletedValue: ChallengeCompletedValue,
		ChallengeCreated: ChallengeCreated,
		ChallengeCreatedValue: ChallengeCreatedValue,
		ParticipantJoined: ParticipantJoined,
		ParticipantJoinedValue: ParticipantJoinedValue,
		RewardClaimed: RewardClaimed,
		RewardClaimedValue: RewardClaimedValue,
		SessionAutoRenewed: SessionAutoRenewed,
		SessionAutoRenewedValue: SessionAutoRenewedValue,
		SessionKeyCreated: SessionKeyCreated,
		SessionKeyCreatedValue: SessionKeyCreatedValue,
		SessionKeyRevoked: SessionKeyRevoked,
		SessionKeyRevokedValue: SessionKeyRevokedValue,
		SessionKeyUsed: SessionKeyUsed,
		SessionKeyUsedValue: SessionKeyUsedValue,
		SessionOperationTracked: SessionOperationTracked,
		SessionOperationTrackedValue: SessionOperationTrackedValue,
		SessionPerformanceMetrics: SessionPerformanceMetrics,
		SessionPerformanceMetricsValue: SessionPerformanceMetricsValue,
	},
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
		Auction: {
		auction_id: 0,
			seller: "",
		fish_id: 0,
			start_time: 0,
			end_time: 0,
		reserve_price: 0,
		highest_bid: 0,
		highest_bidder: new CairoOption(CairoOptionVariant.None),
			active: false,
		},
		AuctionCounter: {
			id: 0,
		current_val: 0,
		},
		AuctionCounterValue: {
		current_val: 0,
		},
		AuctionValue: {
			seller: "",
		fish_id: 0,
			start_time: 0,
			end_time: 0,
		reserve_price: 0,
		highest_bid: 0,
		highest_bidder: new CairoOption(CairoOptionVariant.None),
			active: false,
		},
		FishOwnerA: {
		fish_id: 0,
			owner: "",
			locked: false,
		},
		FishOwnerAValue: {
			owner: "",
			locked: false,
		},
		ChallengeParticipation: {
			challenge_id: 0,
			participant: "",
			joined: false,
			completed: false,
			reward_claimed: false,
		},
		ChallengeParticipationValue: {
			joined: false,
			completed: false,
			reward_claimed: false,
		},
		Challenge_Counter: {
			id: 0,
			counter: 0,
		},
		Challenge_CounterValue: {
			counter: 0,
		},
		DailyChallenge: {
			challenge_id: 0,
			challenge_type: 0,
			param1: 0,
			param2: 0,
			value1: 0,
			value2: 0,
			difficulty: 0,
			active: false,
		},
		DailyChallengeValue: {
			challenge_type: 0,
			param1: 0,
			param2: 0,
			value1: 0,
			value2: 0,
			difficulty: 0,
			active: false,
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
			locked: false,
		},
		FishOwnerValue: {
			owner: "",
			locked: false,
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
		Listing: {
			id: 0,
		fish_id: 0,
		price: 0,
			is_active: false,
		},
		ListingValue: {
		fish_id: 0,
		price: 0,
			is_active: false,
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
		experience_points: 0,
			decoration_count: 0,
			transaction_count: 0,
			registered_at: 0,
			player_fishes: [0],
			player_aquariums: [0],
			player_decorations: [0],
			transaction_history: [0],
			last_action_reset: 0,
			daily_fish_creations: 0,
			daily_decoration_creations: 0,
			daily_aquarium_creations: 0,
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
		experience_points: 0,
			decoration_count: 0,
			transaction_count: 0,
			registered_at: 0,
			player_fishes: [0],
			player_aquariums: [0],
			player_decorations: [0],
			transaction_history: [0],
			last_action_reset: 0,
			daily_fish_creations: 0,
			daily_decoration_creations: 0,
			daily_aquarium_creations: 0,
		},
		UsernameToAddress: {
			username: 0,
			address: "",
		},
		UsernameToAddressValue: {
			address: "",
		},
		SessionAnalytics: {
			session_id: 0,
			total_transactions: 0,
			successful_transactions: 0,
			failed_transactions: 0,
			total_gas_used: 0,
			average_gas_per_tx: 0,
			last_activity: 0,
			created_at: 0,
		},
		SessionAnalyticsValue: {
			total_transactions: 0,
			successful_transactions: 0,
			failed_transactions: 0,
			total_gas_used: 0,
			average_gas_per_tx: 0,
			last_activity: 0,
			created_at: 0,
		},
		SessionKey: {
			session_id: 0,
			player_address: "",
			created_at: 0,
			expires_at: 0,
			last_used: 0,
			max_transactions: 0,
			used_transactions: 0,
			status: 0,
			is_valid: false,
			auto_renewal_enabled: false,
			session_type: 0,
			permissions: [0],
		},
		SessionKeyValue: {
			created_at: 0,
			expires_at: 0,
			last_used: 0,
			max_transactions: 0,
			used_transactions: 0,
			status: 0,
			is_valid: false,
			auto_renewal_enabled: false,
			session_type: 0,
			permissions: [0],
		},
		SessionOperation: {
			session_id: 0,
			operation_id: 0,
			operation_type: 0,
			timestamp: 0,
			gas_used: 0,
			success: false,
		error_code: new CairoOption(CairoOptionVariant.None),
		},
		SessionOperationValue: {
			operation_type: 0,
			timestamp: 0,
			gas_used: 0,
			success: false,
		error_code: new CairoOption(CairoOptionVariant.None),
		},
		ShopCatalogModel: {
			id: "",
			owner: "",
		shopItems: 0,
		latest_item_id: 0,
		},
		ShopCatalogModelValue: {
			owner: "",
		shopItems: 0,
		latest_item_id: 0,
		},
		ShopItemModel: {
		id: 0,
		price: 0,
		stock: 0,
			description: 0,
		},
		ShopItemModelValue: {
		price: 0,
		stock: 0,
			description: 0,
		},
		ActiveTradeOffers: {
			creator: "",
			offers: [0],
		},
		ActiveTradeOffersValue: {
			offers: [0],
		},
		FishLock: {
		fish_id: 0,
			is_locked: false,
		locked_by_offer: 0,
			locked_at: 0,
		},
		FishLockValue: {
			is_locked: false,
		locked_by_offer: 0,
			locked_at: 0,
		},
		TradeOffer: {
		id: 0,
			creator: "",
		offered_fish_id: 0,
		requested_fish_criteria: new CairoCustomEnum({ 
					ExactId: "",
				Species: undefined,
				SpeciesAndGen: undefined,
				Traits: undefined, }),
		requested_fish_id: new CairoOption(CairoOptionVariant.None),
		requested_species: new CairoOption(CairoOptionVariant.None),
		requested_generation: new CairoOption(CairoOptionVariant.None),
			requested_traits: [0],
		status: new CairoCustomEnum({ 
					Active: "",
				Completed: undefined,
				Cancelled: undefined,
				Expired: undefined, }),
			created_at: 0,
			expires_at: 0,
			is_locked: false,
		},
		TradeOfferCounter: {
			id: 0,
		current_val: 0,
		},
		TradeOfferCounterValue: {
		current_val: 0,
		},
		TradeOfferValue: {
			creator: "",
		offered_fish_id: 0,
		requested_fish_criteria: new CairoCustomEnum({ 
					ExactId: "",
				Species: undefined,
				SpeciesAndGen: undefined,
				Traits: undefined, }),
		requested_fish_id: new CairoOption(CairoOptionVariant.None),
		requested_species: new CairoOption(CairoOptionVariant.None),
		requested_generation: new CairoOption(CairoOptionVariant.None),
			requested_traits: [0],
		status: new CairoCustomEnum({ 
					Active: "",
				Completed: undefined,
				Cancelled: undefined,
				Expired: undefined, }),
			created_at: 0,
			expires_at: 0,
			is_locked: false,
		},
		EventCounter: {
			target: 0,
		current_val: 0,
		},
		EventCounterValue: {
		current_val: 0,
		},
		EventTypeDetails: {
		type_id: 0,
		name: "",
			total_logged: 0,
			transaction_history: [0],
		},
		EventTypeDetailsValue: {
		name: "",
			total_logged: 0,
			transaction_history: [0],
		},
		TransactionCounter: {
			target: 0,
		current_val: 0,
		},
		TransactionCounterValue: {
		current_val: 0,
		},
		TransactionLog: {
		id: 0,
		event_type_id: 0,
			player: "",
			payload: [0],
			timestamp: 0,
		},
		TransactionLogValue: {
		event_type_id: 0,
			player: "",
			payload: [0],
			timestamp: 0,
		},
		TrophyCreation: {
			id: 0,
			hidden: false,
			index: 0,
			points: 0,
			start: 0,
			end: 0,
			group: 0,
			icon: 0,
			title: 0,
		description: "",
			tasks: [{ id: 0, total: 0, description: "", }],
		data: "",
		},
		TrophyCreationValue: {
			hidden: false,
			index: 0,
			points: 0,
			start: 0,
			end: 0,
			group: 0,
			icon: 0,
			title: 0,
		description: "",
			tasks: [{ id: 0, total: 0, description: "", }],
		data: "",
		},
		TrophyProgression: {
			player_id: 0,
			task_id: 0,
			count: 0,
			time: 0,
		},
		TrophyProgressionValue: {
			count: 0,
			time: 0,
		},
		Task: {
			id: 0,
			total: 0,
		description: "",
		},
		AquariumCleaned: {
		aquarium_id: 0,
			owner: "",
			amount_cleaned: 0,
			old_cleanliness: 0,
			new_cleanliness: 0,
			timestamp: 0,
		},
		AquariumCleanedValue: {
			amount_cleaned: 0,
			old_cleanliness: 0,
			new_cleanliness: 0,
			timestamp: 0,
		},
		AquariumCreated: {
		aquarium_id: 0,
			owner: "",
			max_capacity: 0,
			max_decorations: 0,
			timestamp: 0,
		},
		AquariumCreatedValue: {
			max_capacity: 0,
			max_decorations: 0,
			timestamp: 0,
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
		DecorationRemovedFromAquarium: {
		aquarium_id: 0,
		decoration_id: 0,
			timestamp: 0,
		},
		DecorationRemovedFromAquariumValue: {
			timestamp: 0,
		},
		EventTypeRegistered: {
		event_type_id: 0,
			timestamp: 0,
		},
		EventTypeRegisteredValue: {
			timestamp: 0,
		},
		ExperienceConfigUpdated: {
			base_experience: 0,
			experience_multiplier: 0,
			max_level: 0,
		},
		ExperienceConfigUpdatedValue: {
			experience_multiplier: 0,
			max_level: 0,
		},
		ExperienceEarned: {
			player: "",
			amount: 0,
			total_experience: 0,
		},
		ExperienceEarnedValue: {
			amount: 0,
			total_experience: 0,
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
		FishLocked: {
		fish_id: 0,
			owner: "",
		locked_by_offer: 0,
			timestamp: 0,
		},
		FishLockedValue: {
		locked_by_offer: 0,
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
		FishPurchased: {
			buyer: "",
			seller: "",
		price: 0,
		fish_id: 0,
			timestamp: 0,
		},
		FishPurchasedValue: {
			seller: "",
		price: 0,
		fish_id: 0,
			timestamp: 0,
		},
		FishUnlocked: {
		fish_id: 0,
			owner: "",
			timestamp: 0,
		},
		FishUnlockedValue: {
			timestamp: 0,
		},
		LevelUp: {
			player: "",
			old_level: 0,
			new_level: 0,
			total_experience: 0,
		},
		LevelUpValue: {
			old_level: 0,
			new_level: 0,
			total_experience: 0,
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
		PlayerEventLogged: {
		id: 0,
		event_type_id: 0,
			player: "",
			timestamp: 0,
		},
		PlayerEventLoggedValue: {
			player: "",
			timestamp: 0,
		},
		TradeOfferAccepted: {
		offer_id: 0,
			acceptor: "",
			creator: "",
		creator_fish_id: 0,
		acceptor_fish_id: 0,
			timestamp: 0,
		},
		TradeOfferAcceptedValue: {
		creator_fish_id: 0,
		acceptor_fish_id: 0,
			timestamp: 0,
		},
		TradeOfferCancelled: {
		offer_id: 0,
			creator: "",
		offered_fish_id: 0,
			timestamp: 0,
		},
		TradeOfferCancelledValue: {
		offered_fish_id: 0,
			timestamp: 0,
		},
		TradeOfferCreated: {
		offer_id: 0,
			creator: "",
		offered_fish_id: 0,
		criteria: new CairoCustomEnum({ 
					ExactId: "",
				Species: undefined,
				SpeciesAndGen: undefined,
				Traits: undefined, }),
		requested_fish_id: new CairoOption(CairoOptionVariant.None),
		requested_species: new CairoOption(CairoOptionVariant.None),
		requested_generation: new CairoOption(CairoOptionVariant.None),
			expires_at: 0,
		},
		TradeOfferCreatedValue: {
		offered_fish_id: 0,
		criteria: new CairoCustomEnum({ 
					ExactId: "",
				Species: undefined,
				SpeciesAndGen: undefined,
				Traits: undefined, }),
		requested_fish_id: new CairoOption(CairoOptionVariant.None),
		requested_species: new CairoOption(CairoOptionVariant.None),
		requested_generation: new CairoOption(CairoOptionVariant.None),
			expires_at: 0,
		},
		TradeOfferExpired: {
		offer_id: 0,
			creator: "",
		offered_fish_id: 0,
			timestamp: 0,
		},
		TradeOfferExpiredValue: {
		offered_fish_id: 0,
			timestamp: 0,
		},
		TransactionConfirmed: {
		transaction_id: 0,
			player: "",
		event_type_id: 0,
			confirmation_hash: 0,
			timestamp: 0,
		},
		TransactionConfirmedValue: {
		event_type_id: 0,
			confirmation_hash: 0,
			timestamp: 0,
		},
		TransactionInitiated: {
		transaction_id: 0,
			player: "",
		event_type_id: 0,
			payload_size: 0,
			timestamp: 0,
		},
		TransactionInitiatedValue: {
		event_type_id: 0,
			payload_size: 0,
			timestamp: 0,
		},
		TransactionProcessed: {
		transaction_id: 0,
			player: "",
		event_type_id: 0,
			processing_time: 0,
			timestamp: 0,
		},
		TransactionProcessedValue: {
		event_type_id: 0,
			processing_time: 0,
			timestamp: 0,
		},
		DecorationGameMoved: {
		decoration_id: 0,
		from_aquarium: 0,
		to_aquarium: 0,
			owner: "",
		experience_earned: 0,
			timestamp: 0,
		},
		DecorationGameMovedValue: {
		from_aquarium: 0,
		to_aquarium: 0,
			owner: "",
		experience_earned: 0,
			timestamp: 0,
		},
		FishGameBred: {
		offspring_id: 0,
			owner: "",
		parent1_id: 0,
		parent2_id: 0,
		aquarium_id: 0,
		experience_earned: 0,
			timestamp: 0,
		},
		FishGameBredValue: {
		parent1_id: 0,
		parent2_id: 0,
		aquarium_id: 0,
		experience_earned: 0,
			timestamp: 0,
		},
		FishGameCreated: {
		fish_id: 0,
			owner: "",
		aquarium_id: 0,
		species: new CairoCustomEnum({ 
					AngelFish: "",
				GoldFish: undefined,
				Betta: undefined,
				NeonTetra: undefined,
				Corydoras: undefined,
				Hybrid: undefined, }),
		experience_earned: 0,
			timestamp: 0,
		},
		FishGameCreatedValue: {
		aquarium_id: 0,
		species: new CairoCustomEnum({ 
					AngelFish: "",
				GoldFish: undefined,
				Betta: undefined,
				NeonTetra: undefined,
				Corydoras: undefined,
				Hybrid: undefined, }),
		experience_earned: 0,
			timestamp: 0,
		},
		FishGameListed: {
		fish_id: 0,
			owner: "",
		price: 0,
		experience_earned: 0,
			timestamp: 0,
		},
		FishGameListedValue: {
		price: 0,
		experience_earned: 0,
			timestamp: 0,
		},
		FishGameMoved: {
		fish_id: 0,
		from_aquarium: 0,
		to_aquarium: 0,
			owner: "",
		experience_earned: 0,
			timestamp: 0,
		},
		FishGameMovedValue: {
		from_aquarium: 0,
		to_aquarium: 0,
			owner: "",
		experience_earned: 0,
			timestamp: 0,
		},
		FishGamePurchased: {
		fish_id: 0,
			buyer: "",
			seller: "",
		price: 0,
		experience_earned: 0,
			timestamp: 0,
		},
		FishGamePurchasedValue: {
			buyer: "",
			seller: "",
		price: 0,
		experience_earned: 0,
			timestamp: 0,
		},
		GameExperienceEarned: {
			player: "",
		amount: 0,
		total_experience: 0,
			action_type: 0,
			timestamp: 0,
		},
		GameExperienceEarnedValue: {
		amount: 0,
		total_experience: 0,
			action_type: 0,
			timestamp: 0,
		},
		GameLevelUp: {
			player: "",
			old_level: 0,
			new_level: 0,
		total_experience: 0,
			timestamp: 0,
		},
		GameLevelUpValue: {
			old_level: 0,
			new_level: 0,
		total_experience: 0,
			timestamp: 0,
		},
		GameOperationCompleted: {
			player: "",
			operation_type: 0,
			success: false,
			timestamp: 0,
		},
		GameOperationCompletedValue: {
			operation_type: 0,
			success: false,
			timestamp: 0,
		},
		GameStateChanged: {
			player: "",
			state_type: 0,
		state_value: 0,
			timestamp: 0,
		},
		GameStateChangedValue: {
			state_type: 0,
		state_value: 0,
			timestamp: 0,
		},
		AuctionEnded: {
		auction_id: 0,
		winner: new CairoOption(CairoOptionVariant.None),
		final_price: 0,
		},
		AuctionEndedValue: {
		winner: new CairoOption(CairoOptionVariant.None),
		final_price: 0,
		},
		AuctionStarted: {
		auction_id: 0,
			seller: "",
		fish_id: 0,
			start_time: 0,
			end_time: 0,
		reserve_price: 0,
		},
		AuctionStartedValue: {
		fish_id: 0,
			start_time: 0,
			end_time: 0,
		reserve_price: 0,
		},
		BidPlaced: {
		auction_id: 0,
			bidder: "",
		amount: 0,
		},
		BidPlacedValue: {
			bidder: "",
		amount: 0,
		},
		ChallengeCompleted: {
			challenge_id: 0,
			participant: "",
		},
		ChallengeCompletedValue: {
			participant: "",
		},
		ChallengeCreated: {
			challenge_id: 0,
			challenge_type: 0,
			param1: 0,
			param2: 0,
			value1: 0,
			value2: 0,
			difficulty: 0,
		},
		ChallengeCreatedValue: {
			challenge_type: 0,
			param1: 0,
			param2: 0,
			value1: 0,
			value2: 0,
			difficulty: 0,
		},
		ParticipantJoined: {
			challenge_id: 0,
			participant: "",
		},
		ParticipantJoinedValue: {
			participant: "",
		},
		RewardClaimed: {
			challenge_id: 0,
			participant: "",
		reward_amount: 0,
		},
		RewardClaimedValue: {
		reward_amount: 0,
		},
		SessionAutoRenewed: {
			session_id: 0,
			player_address: "",
			new_expires_at: 0,
			new_max_transactions: 0,
		},
		SessionAutoRenewedValue: {
			player_address: "",
			new_expires_at: 0,
			new_max_transactions: 0,
		},
		SessionKeyCreated: {
			session_id: 0,
			player_address: "",
			duration: 0,
			max_transactions: 0,
			session_type: 0,
		},
		SessionKeyCreatedValue: {
			player_address: "",
			duration: 0,
			max_transactions: 0,
			session_type: 0,
		},
		SessionKeyRevoked: {
			session_id: 0,
			player_address: "",
			reason: 0,
		},
		SessionKeyRevokedValue: {
			player_address: "",
			reason: 0,
		},
		SessionKeyUsed: {
			session_id: 0,
			player_address: "",
			operation_type: 0,
			gas_used: 0,
		},
		SessionKeyUsedValue: {
			player_address: "",
			operation_type: 0,
			gas_used: 0,
		},
		SessionOperationTracked: {
			session_id: 0,
			operation_id: 0,
			operation_type: 0,
			timestamp: 0,
			gas_used: 0,
			success: false,
		},
		SessionOperationTrackedValue: {
			operation_id: 0,
			operation_type: 0,
			timestamp: 0,
			gas_used: 0,
			success: false,
		},
		SessionPerformanceMetrics: {
			session_id: 0,
			average_gas_per_tx: 0,
			success_rate: 0,
			last_activity: 0,
		},
		SessionPerformanceMetricsValue: {
			average_gas_per_tx: 0,
			success_rate: 0,
			last_activity: 0,
		},
	},
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
	Auction = 'aqua_stark-Auction',
	AuctionCounter = 'aqua_stark-AuctionCounter',
	AuctionCounterValue = 'aqua_stark-AuctionCounterValue',
	AuctionValue = 'aqua_stark-AuctionValue',
	FishOwnerA = 'aqua_stark-FishOwnerA',
	FishOwnerAValue = 'aqua_stark-FishOwnerAValue',
	ChallengeParticipation = 'aqua_stark-ChallengeParticipation',
	ChallengeParticipationValue = 'aqua_stark-ChallengeParticipationValue',
	Challenge_Counter = 'aqua_stark-Challenge_Counter',
	Challenge_CounterValue = 'aqua_stark-Challenge_CounterValue',
	DailyChallenge = 'aqua_stark-DailyChallenge',
	DailyChallengeValue = 'aqua_stark-DailyChallengeValue',
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
	Listing = 'aqua_stark-Listing',
	ListingValue = 'aqua_stark-ListingValue',
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
	SessionAnalytics = 'aqua_stark-SessionAnalytics',
	SessionAnalyticsValue = 'aqua_stark-SessionAnalyticsValue',
	SessionKey = 'aqua_stark-SessionKey',
	SessionKeyValue = 'aqua_stark-SessionKeyValue',
	SessionOperation = 'aqua_stark-SessionOperation',
	SessionOperationValue = 'aqua_stark-SessionOperationValue',
	ShopCatalogModel = 'aqua_stark-ShopCatalogModel',
	ShopCatalogModelValue = 'aqua_stark-ShopCatalogModelValue',
	ShopItemModel = 'aqua_stark-ShopItemModel',
	ShopItemModelValue = 'aqua_stark-ShopItemModelValue',
	ActiveTradeOffers = 'aqua_stark-ActiveTradeOffers',
	ActiveTradeOffersValue = 'aqua_stark-ActiveTradeOffersValue',
	FishLock = 'aqua_stark-FishLock',
	FishLockValue = 'aqua_stark-FishLockValue',
	MatchCriteria = 'aqua_stark-MatchCriteria',
	TradeOffer = 'aqua_stark-TradeOffer',
	TradeOfferCounter = 'aqua_stark-TradeOfferCounter',
	TradeOfferCounterValue = 'aqua_stark-TradeOfferCounterValue',
	TradeOfferStatus = 'aqua_stark-TradeOfferStatus',
	TradeOfferValue = 'aqua_stark-TradeOfferValue',
	EventCounter = 'aqua_stark-EventCounter',
	EventCounterValue = 'aqua_stark-EventCounterValue',
	EventTypeDetails = 'aqua_stark-EventTypeDetails',
	EventTypeDetailsValue = 'aqua_stark-EventTypeDetailsValue',
	TransactionCounter = 'aqua_stark-TransactionCounter',
	TransactionCounterValue = 'aqua_stark-TransactionCounterValue',
	TransactionLog = 'aqua_stark-TransactionLog',
	TransactionLogValue = 'aqua_stark-TransactionLogValue',
	TrophyCreation = 'achievement-TrophyCreation',
	TrophyCreationValue = 'achievement-TrophyCreationValue',
	TrophyProgression = 'achievement-TrophyProgression',
	TrophyProgressionValue = 'achievement-TrophyProgressionValue',
	Task = 'achievement-Task',
	AquariumCleaned = 'aqua_stark-AquariumCleaned',
	AquariumCleanedValue = 'aqua_stark-AquariumCleanedValue',
	AquariumCreated = 'aqua_stark-AquariumCreated',
	AquariumCreatedValue = 'aqua_stark-AquariumCreatedValue',
	DecorationAddedToAquarium = 'aqua_stark-DecorationAddedToAquarium',
	DecorationAddedToAquariumValue = 'aqua_stark-DecorationAddedToAquariumValue',
	DecorationCreated = 'aqua_stark-DecorationCreated',
	DecorationCreatedValue = 'aqua_stark-DecorationCreatedValue',
	DecorationMoved = 'aqua_stark-DecorationMoved',
	DecorationMovedValue = 'aqua_stark-DecorationMovedValue',
	DecorationRemovedFromAquarium = 'aqua_stark-DecorationRemovedFromAquarium',
	DecorationRemovedFromAquariumValue = 'aqua_stark-DecorationRemovedFromAquariumValue',
	EventTypeRegistered = 'aqua_stark-EventTypeRegistered',
	EventTypeRegisteredValue = 'aqua_stark-EventTypeRegisteredValue',
	ExperienceConfigUpdated = 'aqua_stark-ExperienceConfigUpdated',
	ExperienceConfigUpdatedValue = 'aqua_stark-ExperienceConfigUpdatedValue',
	ExperienceEarned = 'aqua_stark-ExperienceEarned',
	ExperienceEarnedValue = 'aqua_stark-ExperienceEarnedValue',
	FishAddedToAquarium = 'aqua_stark-FishAddedToAquarium',
	FishAddedToAquariumValue = 'aqua_stark-FishAddedToAquariumValue',
	FishBred = 'aqua_stark-FishBred',
	FishBredValue = 'aqua_stark-FishBredValue',
	FishCreated = 'aqua_stark-FishCreated',
	FishCreatedValue = 'aqua_stark-FishCreatedValue',
	FishLocked = 'aqua_stark-FishLocked',
	FishLockedValue = 'aqua_stark-FishLockedValue',
	FishMoved = 'aqua_stark-FishMoved',
	FishMovedValue = 'aqua_stark-FishMovedValue',
	FishPurchased = 'aqua_stark-FishPurchased',
	FishPurchasedValue = 'aqua_stark-FishPurchasedValue',
	FishUnlocked = 'aqua_stark-FishUnlocked',
	FishUnlockedValue = 'aqua_stark-FishUnlockedValue',
	LevelUp = 'aqua_stark-LevelUp',
	LevelUpValue = 'aqua_stark-LevelUpValue',
	PlayerCreated = 'aqua_stark-PlayerCreated',
	PlayerCreatedValue = 'aqua_stark-PlayerCreatedValue',
	PlayerEventLogged = 'aqua_stark-PlayerEventLogged',
	PlayerEventLoggedValue = 'aqua_stark-PlayerEventLoggedValue',
	TradeOfferAccepted = 'aqua_stark-TradeOfferAccepted',
	TradeOfferAcceptedValue = 'aqua_stark-TradeOfferAcceptedValue',
	TradeOfferCancelled = 'aqua_stark-TradeOfferCancelled',
	TradeOfferCancelledValue = 'aqua_stark-TradeOfferCancelledValue',
	TradeOfferCreated = 'aqua_stark-TradeOfferCreated',
	TradeOfferCreatedValue = 'aqua_stark-TradeOfferCreatedValue',
	TradeOfferExpired = 'aqua_stark-TradeOfferExpired',
	TradeOfferExpiredValue = 'aqua_stark-TradeOfferExpiredValue',
	TransactionConfirmed = 'aqua_stark-TransactionConfirmed',
	TransactionConfirmedValue = 'aqua_stark-TransactionConfirmedValue',
	TransactionInitiated = 'aqua_stark-TransactionInitiated',
	TransactionInitiatedValue = 'aqua_stark-TransactionInitiatedValue',
	TransactionProcessed = 'aqua_stark-TransactionProcessed',
	TransactionProcessedValue = 'aqua_stark-TransactionProcessedValue',
	DecorationGameMoved = 'aqua_stark-DecorationGameMoved',
	DecorationGameMovedValue = 'aqua_stark-DecorationGameMovedValue',
	FishGameBred = 'aqua_stark-FishGameBred',
	FishGameBredValue = 'aqua_stark-FishGameBredValue',
	FishGameCreated = 'aqua_stark-FishGameCreated',
	FishGameCreatedValue = 'aqua_stark-FishGameCreatedValue',
	FishGameListed = 'aqua_stark-FishGameListed',
	FishGameListedValue = 'aqua_stark-FishGameListedValue',
	FishGameMoved = 'aqua_stark-FishGameMoved',
	FishGameMovedValue = 'aqua_stark-FishGameMovedValue',
	FishGamePurchased = 'aqua_stark-FishGamePurchased',
	FishGamePurchasedValue = 'aqua_stark-FishGamePurchasedValue',
	GameExperienceEarned = 'aqua_stark-GameExperienceEarned',
	GameExperienceEarnedValue = 'aqua_stark-GameExperienceEarnedValue',
	GameLevelUp = 'aqua_stark-GameLevelUp',
	GameLevelUpValue = 'aqua_stark-GameLevelUpValue',
	GameOperationCompleted = 'aqua_stark-GameOperationCompleted',
	GameOperationCompletedValue = 'aqua_stark-GameOperationCompletedValue',
	GameStateChanged = 'aqua_stark-GameStateChanged',
	GameStateChangedValue = 'aqua_stark-GameStateChangedValue',
	AuctionEnded = 'aqua_stark-AuctionEnded',
	AuctionEndedValue = 'aqua_stark-AuctionEndedValue',
	AuctionStarted = 'aqua_stark-AuctionStarted',
	AuctionStartedValue = 'aqua_stark-AuctionStartedValue',
	BidPlaced = 'aqua_stark-BidPlaced',
	BidPlacedValue = 'aqua_stark-BidPlacedValue',
	ChallengeCompleted = 'aqua_stark-ChallengeCompleted',
	ChallengeCompletedValue = 'aqua_stark-ChallengeCompletedValue',
	ChallengeCreated = 'aqua_stark-ChallengeCreated',
	ChallengeCreatedValue = 'aqua_stark-ChallengeCreatedValue',
	ParticipantJoined = 'aqua_stark-ParticipantJoined',
	ParticipantJoinedValue = 'aqua_stark-ParticipantJoinedValue',
	RewardClaimed = 'aqua_stark-RewardClaimed',
	RewardClaimedValue = 'aqua_stark-RewardClaimedValue',
	SessionAutoRenewed = 'aqua_stark-SessionAutoRenewed',
	SessionAutoRenewedValue = 'aqua_stark-SessionAutoRenewedValue',
	SessionKeyCreated = 'aqua_stark-SessionKeyCreated',
	SessionKeyCreatedValue = 'aqua_stark-SessionKeyCreatedValue',
	SessionKeyRevoked = 'aqua_stark-SessionKeyRevoked',
	SessionKeyRevokedValue = 'aqua_stark-SessionKeyRevokedValue',
	SessionKeyUsed = 'aqua_stark-SessionKeyUsed',
	SessionKeyUsedValue = 'aqua_stark-SessionKeyUsedValue',
	SessionOperationTracked = 'aqua_stark-SessionOperationTracked',
	SessionOperationTrackedValue = 'aqua_stark-SessionOperationTrackedValue',
	SessionPerformanceMetrics = 'aqua_stark-SessionPerformanceMetrics',
	SessionPerformanceMetricsValue = 'aqua_stark-SessionPerformanceMetricsValue',
}