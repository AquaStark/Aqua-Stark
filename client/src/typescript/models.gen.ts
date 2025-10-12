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

// Type definition for `aqua_stark::models::aquarium_model::AquariumFishes` struct
export interface AquariumFishes {
	id: BigNumberish;
	owner: string;
	current_fish_count: BigNumberish;
	max_fish_count: BigNumberish;
}

// Type definition for `aqua_stark::models::aquarium_model::AquariumOwner` struct
export interface AquariumOwner {
	id: BigNumberish;
	owner: string;
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

// Type definition for `aqua_stark::models::auctions_model::FishOwnerA` struct
export interface FishOwnerA {
	fish_id: BigNumberish;
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

// Type definition for `aqua_stark::models::daily_challange::Challenge_Counter` struct
export interface ChallengeCounter {
	id: BigNumberish;
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

// Type definition for `aqua_stark::models::fish_model::FishOwner` struct
export interface FishOwner {
	id: BigNumberish;
	owner: string;
	locked: boolean;
}

// Type definition for `aqua_stark::models::fish_model::FishParents` struct
export interface FishParents {
	parent1: BigNumberish;
	parent2: BigNumberish;
}

// Type definition for `aqua_stark::models::fish_model::Listing` struct
export interface Listing {
	id: BigNumberish;
	fish_id: BigNumberish;
	price: BigNumberish;
	is_active: boolean;
}

// Type definition for `aqua_stark::models::game_model::GameCounter` struct
export interface GameCounter {
	id: BigNumberish;
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::player_model::AddressToUsername` struct
export interface AddressToUsername {
	address: string;
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

// Type definition for `aqua_stark::models::player_model::UsernameToAddress` struct
export interface UsernameToAddress {
	username: BigNumberish;
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

// Type definition for `aqua_stark::models::shop_model::ShopCatalogModel` struct
export interface ShopCatalogModel {
	id: string;
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

// Type definition for `aqua_stark::models::trade_model::ActiveTradeOffers` struct
export interface ActiveTradeOffers {
	creator: string;
	offers: Array<BigNumberish>;
}

// Type definition for `aqua_stark::models::trade_model::FishLock` struct
export interface FishLock {
	fish_id: BigNumberish;
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

// Type definition for `aqua_stark::models::transaction_model::EventCounter` struct
export interface EventCounter {
	target: BigNumberish;
	current_val: BigNumberish;
}

// Type definition for `aqua_stark::models::transaction_model::EventTypeDetails` struct
export interface EventTypeDetails {
	type_id: BigNumberish;
	name: string;
	total_logged: BigNumberish;
	transaction_history: Array<BigNumberish>;
}

// Type definition for `aqua_stark::models::transaction_model::TransactionCounter` struct
export interface TransactionCounter {
	target: BigNumberish;
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

// Type definition for `aqua_stark::base::events::AquariumCleaned` struct
export interface AquariumCleaned {
	aquarium_id: BigNumberish;
	owner: string;
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

// Type definition for `aqua_stark::base::events::AuctionStarted` struct
export interface AuctionStarted {
	auction_id: BigNumberish;
	seller: string;
	fish_id: BigNumberish;
	start_time: BigNumberish;
	end_time: BigNumberish;
	reserve_price: BigNumberish;
}

// Type definition for `aqua_stark::base::events::DecorationAddedToAquarium` struct
export interface DecorationAddedToAquarium {
	decoration_id: BigNumberish;
	aquarium_id: BigNumberish;
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

// Type definition for `aqua_stark::base::events::DecorationMoved` struct
export interface DecorationMoved {
	decoration_id: BigNumberish;
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

// Type definition for `aqua_stark::base::events::EventTypeRegistered` struct
export interface EventTypeRegistered {
	event_type_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::ExperienceConfigUpdated` struct
export interface ExperienceConfigUpdated {
	base_experience: BigNumberish;
	experience_multiplier: BigNumberish;
	max_level: BigNumberish;
}

// Type definition for `aqua_stark::base::events::ExperienceEarned` struct
export interface ExperienceEarned {
	player: string;
	amount: BigNumberish;
	total_experience: BigNumberish;
}

// Type definition for `aqua_stark::base::events::FishAddedToAquarium` struct
export interface FishAddedToAquarium {
	fish_id: BigNumberish;
	aquarium_id: BigNumberish;
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

// Type definition for `aqua_stark::base::events::FishCreated` struct
export interface FishCreated {
	fish_id: BigNumberish;
	owner: string;
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

// Type definition for `aqua_stark::base::events::FishMoved` struct
export interface FishMoved {
	fish_id: BigNumberish;
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

// Type definition for `aqua_stark::base::events::FishUnlocked` struct
export interface FishUnlocked {
	fish_id: BigNumberish;
	owner: string;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::LevelUp` struct
export interface LevelUp {
	player: string;
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

// Type definition for `aqua_stark::base::events::PlayerEventLogged` struct
export interface PlayerEventLogged {
	id: BigNumberish;
	event_type_id: BigNumberish;
	player: string;
	timestamp: BigNumberish;
}

// Type definition for `aqua_stark::base::events::RewardClaimed` struct
export interface RewardClaimed {
	player: string;
	level: BigNumberish;
	reward_type: BigNumberish;
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

// Type definition for `aqua_stark::base::events::TradeOfferCancelled` struct
export interface TradeOfferCancelled {
	offer_id: BigNumberish;
	creator: string;
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

// Type definition for `aqua_stark::base::events::TradeOfferExpired` struct
export interface TradeOfferExpired {
	offer_id: BigNumberish;
	creator: string;
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

// Type definition for `aqua_stark::base::events::TransactionInitiated` struct
export interface TransactionInitiated {
	transaction_id: BigNumberish;
	player: string;
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

// Type definition for `aqua_stark::base::game_events::DecorationGameMoved` struct
export interface DecorationGameMoved {
	decoration_id: BigNumberish;
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

// Type definition for `aqua_stark::base::game_events::FishGameCreated` struct
export interface FishGameCreated {
	fish_id: BigNumberish;
	owner: string;
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

// Type definition for `aqua_stark::base::game_events::FishGameMoved` struct
export interface FishGameMoved {
	fish_id: BigNumberish;
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

// Type definition for `aqua_stark::base::game_events::GameExperienceEarned` struct
export interface GameExperienceEarned {
	player: string;
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

// Type definition for `aqua_stark::base::game_events::GameOperationCompleted` struct
export interface GameOperationCompleted {
	player: string;
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

// Type definition for `aqua_stark::models::auctions_model::AuctionEnded` struct
export interface AuctionEnded {
	auction_id: BigNumberish;
	winner: CairoOption<string>;
	final_price: BigNumberish;
}

// Type definition for `aqua_stark::models::auctions_model::BidPlaced` struct
export interface BidPlaced {
	auction_id: BigNumberish;
	bidder: string;
	amount: BigNumberish;
}

// Type definition for `aqua_stark::models::daily_challange::ChallengeCompleted` struct
export interface ChallengeCompleted {
	challenge_id: BigNumberish;
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

// Type definition for `aqua_stark::models::daily_challange::ParticipantJoined` struct
export interface ParticipantJoined {
	challenge_id: BigNumberish;
	participant: string;
}

// Type definition for `aqua_stark::systems::session::session::SessionAutoRenewed` struct
export interface SessionAutoRenewed {
	session_id: BigNumberish;
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

// Type definition for `aqua_stark::systems::session::session::SessionKeyRevoked` struct
export interface SessionKeyRevoked {
	session_id: BigNumberish;
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

// Type definition for `aqua_stark::systems::session::session::SessionOperationTracked` struct
export interface SessionOperationTracked {
	session_id: BigNumberish;
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
		AquariumFishes: AquariumFishes,
		AquariumOwner: AquariumOwner,
		Auction: Auction,
		AuctionCounter: AuctionCounter,
		FishOwnerA: FishOwnerA,
		ChallengeParticipation: ChallengeParticipation,
		ChallengeCounter: ChallengeCounter,
		DailyChallenge: DailyChallenge,
		Decoration: Decoration,
		DecorationCounter: DecorationCounter,
		Fish: Fish,
		FishCounter: FishCounter,
		FishOwner: FishOwner,
		FishParents: FishParents,
		Listing: Listing,
		GameCounter: GameCounter,
		AddressToUsername: AddressToUsername,
		Player: Player,
		PlayerCounter: PlayerCounter,
		UsernameToAddress: UsernameToAddress,
		SessionAnalytics: SessionAnalytics,
		SessionKey: SessionKey,
		SessionOperation: SessionOperation,
		ShopCatalogModel: ShopCatalogModel,
		ShopItemModel: ShopItemModel,
		ActiveTradeOffers: ActiveTradeOffers,
		FishLock: FishLock,
		TradeOffer: TradeOffer,
		TradeOfferCounter: TradeOfferCounter,
		EventCounter: EventCounter,
		EventTypeDetails: EventTypeDetails,
		TransactionCounter: TransactionCounter,
		TransactionLog: TransactionLog,
		AquariumCleaned: AquariumCleaned,
		AquariumCreated: AquariumCreated,
		AuctionStarted: AuctionStarted,
		DecorationAddedToAquarium: DecorationAddedToAquarium,
		DecorationCreated: DecorationCreated,
		DecorationMoved: DecorationMoved,
		DecorationRemovedFromAquarium: DecorationRemovedFromAquarium,
		EventTypeRegistered: EventTypeRegistered,
		ExperienceConfigUpdated: ExperienceConfigUpdated,
		ExperienceEarned: ExperienceEarned,
		FishAddedToAquarium: FishAddedToAquarium,
		FishBred: FishBred,
		FishCreated: FishCreated,
		FishLocked: FishLocked,
		FishMoved: FishMoved,
		FishPurchased: FishPurchased,
		FishUnlocked: FishUnlocked,
		LevelUp: LevelUp,
		PlayerCreated: PlayerCreated,
		PlayerEventLogged: PlayerEventLogged,
		RewardClaimed: RewardClaimed,
		TradeOfferAccepted: TradeOfferAccepted,
		TradeOfferCancelled: TradeOfferCancelled,
		TradeOfferCreated: TradeOfferCreated,
		TradeOfferExpired: TradeOfferExpired,
		TransactionConfirmed: TransactionConfirmed,
		TransactionInitiated: TransactionInitiated,
		TransactionProcessed: TransactionProcessed,
		DecorationGameMoved: DecorationGameMoved,
		FishGameBred: FishGameBred,
		FishGameCreated: FishGameCreated,
		FishGameListed: FishGameListed,
		FishGameMoved: FishGameMoved,
		FishGamePurchased: FishGamePurchased,
		GameExperienceEarned: GameExperienceEarned,
		GameLevelUp: GameLevelUp,
		GameOperationCompleted: GameOperationCompleted,
		GameStateChanged: GameStateChanged,
		AuctionEnded: AuctionEnded,
		BidPlaced: BidPlaced,
		ChallengeCompleted: ChallengeCompleted,
		ChallengeCreated: ChallengeCreated,
		ParticipantJoined: ParticipantJoined,
		SessionAutoRenewed: SessionAutoRenewed,
		SessionKeyCreated: SessionKeyCreated,
		SessionKeyRevoked: SessionKeyRevoked,
		SessionKeyUsed: SessionKeyUsed,
		SessionOperationTracked: SessionOperationTracked,
		SessionPerformanceMetrics: SessionPerformanceMetrics,
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
		AquariumFishes: {
		id: 0,
			owner: "",
		current_fish_count: 0,
		max_fish_count: 0,
		},
		AquariumOwner: {
		id: 0,
			owner: "",
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
		FishOwnerA: {
		fish_id: 0,
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
		Challenge_Counter: {
			id: 0,
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
		FishOwner: {
		id: 0,
			owner: "",
			locked: false,
		},
		FishParents: {
		parent1: 0,
		parent2: 0,
		},
		Listing: {
			id: 0,
		fish_id: 0,
		price: 0,
			is_active: false,
		},
		GameCounter: {
			id: 0,
			current_val: 0,
		},
		AddressToUsername: {
			address: "",
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
		UsernameToAddress: {
			username: 0,
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
		SessionOperation: {
			session_id: 0,
			operation_id: 0,
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
		ShopItemModel: {
		id: 0,
		price: 0,
		stock: 0,
			description: 0,
		},
		ActiveTradeOffers: {
			creator: "",
			offers: [0],
		},
		FishLock: {
		fish_id: 0,
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
		EventCounter: {
			target: 0,
		current_val: 0,
		},
		EventTypeDetails: {
		type_id: 0,
		name: "",
			total_logged: 0,
			transaction_history: [0],
		},
		TransactionCounter: {
			target: 0,
		current_val: 0,
		},
		TransactionLog: {
		id: 0,
		event_type_id: 0,
			player: "",
			payload: [0],
			timestamp: 0,
		},
		AquariumCleaned: {
		aquarium_id: 0,
			owner: "",
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
		AuctionStarted: {
		auction_id: 0,
			seller: "",
		fish_id: 0,
			start_time: 0,
			end_time: 0,
		reserve_price: 0,
		},
		DecorationAddedToAquarium: {
		decoration_id: 0,
		aquarium_id: 0,
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
		DecorationMoved: {
		decoration_id: 0,
		from: 0,
		to: 0,
			timestamp: 0,
		},
		DecorationRemovedFromAquarium: {
		aquarium_id: 0,
		decoration_id: 0,
			timestamp: 0,
		},
		EventTypeRegistered: {
		event_type_id: 0,
			timestamp: 0,
		},
		ExperienceConfigUpdated: {
			base_experience: 0,
			experience_multiplier: 0,
			max_level: 0,
		},
		ExperienceEarned: {
			player: "",
			amount: 0,
			total_experience: 0,
		},
		FishAddedToAquarium: {
		fish_id: 0,
		aquarium_id: 0,
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
		FishCreated: {
		fish_id: 0,
			owner: "",
		aquarium_id: 0,
			timestamp: 0,
		},
		FishLocked: {
		fish_id: 0,
			owner: "",
		locked_by_offer: 0,
			timestamp: 0,
		},
		FishMoved: {
		fish_id: 0,
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
		FishUnlocked: {
		fish_id: 0,
			owner: "",
			timestamp: 0,
		},
		LevelUp: {
			player: "",
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
		PlayerEventLogged: {
		id: 0,
		event_type_id: 0,
			player: "",
			timestamp: 0,
		},
		RewardClaimed: {
			player: "",
			level: 0,
			reward_type: 0,
		},
		TradeOfferAccepted: {
		offer_id: 0,
			acceptor: "",
			creator: "",
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
		TradeOfferExpired: {
		offer_id: 0,
			creator: "",
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
		TransactionInitiated: {
		transaction_id: 0,
			player: "",
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
		DecorationGameMoved: {
		decoration_id: 0,
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
		FishGameListed: {
		fish_id: 0,
			owner: "",
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
		FishGamePurchased: {
		fish_id: 0,
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
		GameLevelUp: {
			player: "",
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
		GameStateChanged: {
			player: "",
			state_type: 0,
		state_value: 0,
			timestamp: 0,
		},
		AuctionEnded: {
		auction_id: 0,
		winner: new CairoOption(CairoOptionVariant.None),
		final_price: 0,
		},
		BidPlaced: {
		auction_id: 0,
			bidder: "",
		amount: 0,
		},
		ChallengeCompleted: {
			challenge_id: 0,
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
		ParticipantJoined: {
			challenge_id: 0,
			participant: "",
		},
		SessionAutoRenewed: {
			session_id: 0,
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
		SessionKeyRevoked: {
			session_id: 0,
			player_address: "",
			reason: 0,
		},
		SessionKeyUsed: {
			session_id: 0,
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
		SessionPerformanceMetrics: {
			session_id: 0,
			average_gas_per_tx: 0,
			success_rate: 0,
			last_activity: 0,
		},
	},
};
export enum ModelsMapping {
	Aquarium = 'aqua_stark-Aquarium',
	AquariumCounter = 'aqua_stark-AquariumCounter',
	AquariumFishes = 'aqua_stark-AquariumFishes',
	AquariumOwner = 'aqua_stark-AquariumOwner',
	Auction = 'aqua_stark-Auction',
	AuctionCounter = 'aqua_stark-AuctionCounter',
	FishOwnerA = 'aqua_stark-FishOwnerA',
	ChallengeParticipation = 'aqua_stark-ChallengeParticipation',
	Challenge_Counter = 'aqua_stark-Challenge_Counter',
	DailyChallenge = 'aqua_stark-DailyChallenge',
	Decoration = 'aqua_stark-Decoration',
	DecorationCounter = 'aqua_stark-DecorationCounter',
	Fish = 'aqua_stark-Fish',
	FishCounter = 'aqua_stark-FishCounter',
	FishOwner = 'aqua_stark-FishOwner',
	FishParents = 'aqua_stark-FishParents',
	Listing = 'aqua_stark-Listing',
	Pattern = 'aqua_stark-Pattern',
	Species = 'aqua_stark-Species',
	GameCounter = 'aqua_stark-GameCounter',
	AddressToUsername = 'aqua_stark-AddressToUsername',
	Player = 'aqua_stark-Player',
	PlayerCounter = 'aqua_stark-PlayerCounter',
	UsernameToAddress = 'aqua_stark-UsernameToAddress',
	SessionAnalytics = 'aqua_stark-SessionAnalytics',
	SessionKey = 'aqua_stark-SessionKey',
	SessionOperation = 'aqua_stark-SessionOperation',
	ShopCatalogModel = 'aqua_stark-ShopCatalogModel',
	ShopItemModel = 'aqua_stark-ShopItemModel',
	ActiveTradeOffers = 'aqua_stark-ActiveTradeOffers',
	FishLock = 'aqua_stark-FishLock',
	MatchCriteria = 'aqua_stark-MatchCriteria',
	TradeOffer = 'aqua_stark-TradeOffer',
	TradeOfferCounter = 'aqua_stark-TradeOfferCounter',
	TradeOfferStatus = 'aqua_stark-TradeOfferStatus',
	EventCounter = 'aqua_stark-EventCounter',
	EventTypeDetails = 'aqua_stark-EventTypeDetails',
	TransactionCounter = 'aqua_stark-TransactionCounter',
	TransactionLog = 'aqua_stark-TransactionLog',
	AquariumCleaned = 'aqua_stark-AquariumCleaned',
	AquariumCreated = 'aqua_stark-AquariumCreated',
	AuctionStarted = 'aqua_stark-AuctionStarted',
	DecorationAddedToAquarium = 'aqua_stark-DecorationAddedToAquarium',
	DecorationCreated = 'aqua_stark-DecorationCreated',
	DecorationMoved = 'aqua_stark-DecorationMoved',
	DecorationRemovedFromAquarium = 'aqua_stark-DecorationRemovedFromAquarium',
	EventTypeRegistered = 'aqua_stark-EventTypeRegistered',
	ExperienceConfigUpdated = 'aqua_stark-ExperienceConfigUpdated',
	ExperienceEarned = 'aqua_stark-ExperienceEarned',
	FishAddedToAquarium = 'aqua_stark-FishAddedToAquarium',
	FishBred = 'aqua_stark-FishBred',
	FishCreated = 'aqua_stark-FishCreated',
	FishLocked = 'aqua_stark-FishLocked',
	FishMoved = 'aqua_stark-FishMoved',
	FishPurchased = 'aqua_stark-FishPurchased',
	FishUnlocked = 'aqua_stark-FishUnlocked',
	LevelUp = 'aqua_stark-LevelUp',
	PlayerCreated = 'aqua_stark-PlayerCreated',
	PlayerEventLogged = 'aqua_stark-PlayerEventLogged',
	RewardClaimed = 'aqua_stark-RewardClaimed',
	TradeOfferAccepted = 'aqua_stark-TradeOfferAccepted',
	TradeOfferCancelled = 'aqua_stark-TradeOfferCancelled',
	TradeOfferCreated = 'aqua_stark-TradeOfferCreated',
	TradeOfferExpired = 'aqua_stark-TradeOfferExpired',
	TransactionConfirmed = 'aqua_stark-TransactionConfirmed',
	TransactionInitiated = 'aqua_stark-TransactionInitiated',
	TransactionProcessed = 'aqua_stark-TransactionProcessed',
	DecorationGameMoved = 'aqua_stark-DecorationGameMoved',
	FishGameBred = 'aqua_stark-FishGameBred',
	FishGameCreated = 'aqua_stark-FishGameCreated',
	FishGameListed = 'aqua_stark-FishGameListed',
	FishGameMoved = 'aqua_stark-FishGameMoved',
	FishGamePurchased = 'aqua_stark-FishGamePurchased',
	GameExperienceEarned = 'aqua_stark-GameExperienceEarned',
	GameLevelUp = 'aqua_stark-GameLevelUp',
	GameOperationCompleted = 'aqua_stark-GameOperationCompleted',
	GameStateChanged = 'aqua_stark-GameStateChanged',
	AuctionEnded = 'aqua_stark-AuctionEnded',
	BidPlaced = 'aqua_stark-BidPlaced',
	ChallengeCompleted = 'aqua_stark-ChallengeCompleted',
	ChallengeCreated = 'aqua_stark-ChallengeCreated',
	ParticipantJoined = 'aqua_stark-ParticipantJoined',
	SessionAutoRenewed = 'aqua_stark-SessionAutoRenewed',
	SessionKeyCreated = 'aqua_stark-SessionKeyCreated',
	SessionKeyRevoked = 'aqua_stark-SessionKeyRevoked',
	SessionKeyUsed = 'aqua_stark-SessionKeyUsed',
	SessionOperationTracked = 'aqua_stark-SessionOperationTracked',
	SessionPerformanceMetrics = 'aqua_stark-SessionPerformanceMetrics',
}