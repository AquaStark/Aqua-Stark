# AquaStark Events & ABI Documentation

**Version**: 1.0.0  
**Date**: 2025-01-17  
**Project**: AquaStark - Aquarium Simulation Game on Starknet

## Overview

This document provides a comprehensive reference for all contract events, ABI structures, and their consumption by the frontend. This serves as the authoritative mapping between contract emissions and UI features to ensure alignment between contract changes and frontend expectations.

## Table of Contents

1. [Contract Events](#contract-events)
2. [ABI Structures (Data Models)](#abi-structures-data-models)
3. [Frontend Usage Cross-Reference](#frontend-usage-cross-reference)
4. [Contract Change Guidelines](#contract-change-guidelines)
5. [Version History](#version-history)

---

## Contract Events

### Core Game Events

#### PlayerCreated
**Emitted when**: A new player registers in the system  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Player onboarding, profile creation

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct PlayerCreated {
    #[key]
    pub username: felt252,          // Player's chosen username
    #[key]  
    pub player: ContractAddress,    // Player's wallet address
    pub player_id: u256,           // Unique player identifier
    pub aquarium_id: u256,         // Initial aquarium ID
    pub decoration_id: u256,       // Initial decoration ID  
    pub fish_id: u256,            // Initial fish ID
    pub timestamp: u64,           // Creation timestamp
}
```

#### FishCreated
**Emitted when**: A new fish is spawned/created  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Fish collection updates, breeding results

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event] 
pub struct FishCreated {
    #[key]
    pub fish_id: u256,            // Unique fish identifier
    #[key]
    pub owner: ContractAddress,   // Fish owner's address
    pub aquarium_id: u256,        // Destination aquarium
    pub timestamp: u64,           // Creation timestamp
}
```

#### FishBred
**Emitted when**: Two fish successfully breed and produce offspring  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Breeding laboratory, genetics tracking

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishBred {
    #[key]
    pub offspring_id: u256,       // New fish ID
    #[key] 
    pub owner: ContractAddress,   // Owner of breeding fish
    pub parent1_id: u256,         // First parent fish ID
    pub parent2_id: u256,         // Second parent fish ID  
    pub aquarium_id: u256,        // Breeding location
    pub timestamp: u64,           // Breeding timestamp
}
```

#### DecorationCreated
**Emitted when**: A new decoration item is created  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Store purchases, aquarium customization

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct DecorationCreated {
    #[key]
    pub id: u256,                 // Decoration ID
    #[key]
    pub aquarium_id: u256,        // Target aquarium
    pub owner: ContractAddress,   // Decoration owner
    pub name: felt252,            // Decoration name
    pub rarity: felt252,          // Rarity level
    pub price: u256,              // Purchase price
    pub timestamp: u64,           // Creation timestamp
}
```

### Movement & Placement Events

#### FishMoved
**Emitted when**: A fish is moved between aquariums  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Aquarium management interface

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishMoved {
    #[key]
    pub fish_id: u256,            // Fish being moved
    pub from: u256,               // Source aquarium ID
    pub to: u256,                 // Destination aquarium ID
    pub timestamp: u64,           // Move timestamp
}
```

#### DecorationMoved  
**Emitted when**: A decoration is moved between aquariums  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Aquarium customization interface

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct DecorationMoved {
    #[key]
    pub decoration_id: u256,      // Decoration being moved
    pub from: u256,               // Source aquarium ID
    pub to: u256,                 // Destination aquarium ID
    pub timestamp: u64,           // Move timestamp
}
```

#### FishAddedToAquarium
**Emitted when**: A fish is placed into an aquarium  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Aquarium population updates

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishAddedToAquarium {
    #[key]
    pub fish_id: u256,            // Fish ID
    #[key]
    pub aquarium_id: u256,        // Target aquarium  
    pub timestamp: u64,           // Placement timestamp
}
```

#### DecorationAddedToAquarium
**Emitted when**: A decoration is placed into an aquarium  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Aquarium decoration updates

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct DecorationAddedToAquarium {
    #[key]
    pub decoration_id: u256,      // Decoration ID
    #[key]
    pub aquarium_id: u256,        // Target aquarium
    pub timestamp: u64,           // Placement timestamp
}
```

### Market & Trading Events

#### FishPurchased
**Emitted when**: A fish is bought through direct sale  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Market transactions, purchase history

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishPurchased {
    #[key]
    pub buyer: ContractAddress,   // Purchaser address
    pub seller: ContractAddress,  // Seller address
    pub price: u256,              // Sale price
    pub fish_id: u256,            // Fish sold
    pub timestamp: u64,           // Transaction timestamp
}
```

#### AuctionStarted
**Emitted when**: A new auction is created  
**Contract**: `Auctions.cairo`  
**Frontend Usage**: Auction marketplace, active listings

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct AuctionStarted {
    #[key]
    pub auction_id: u256,         // Auction identifier
    #[key]
    pub seller: ContractAddress,  // Auction creator
    pub fish_id: u256,            // Fish being auctioned
    pub start_time: u64,          // Auction start time
    pub end_time: u64,            // Auction end time
    pub reserve_price: u256,      // Minimum bid amount
}
```

#### BidPlaced
**Emitted when**: A bid is placed on an auction  
**Contract**: `Auctions.cairo`  
**Frontend Usage**: Real-time bid updates, auction activity

```cairo
#[derive(Drop, Serde)]
#[dojo::event]
pub struct BidPlaced {
    #[key]
    pub auction_id: u256,         // Target auction
    pub bidder: ContractAddress,  // Bidder address
    pub amount: u256,             // Bid amount
}
```

#### AuctionEnded
**Emitted when**: An auction concludes  
**Contract**: `Auctions.cairo`  
**Frontend Usage**: Auction results, winner notifications

```cairo
#[derive(Drop, Serde)]
#[dojo::event]
pub struct AuctionEnded {
    #[key]
    pub auction_id: u256,         // Auction identifier
    pub winner: Option<ContractAddress>, // Winning bidder (if any)
    pub final_price: u256,        // Final sale price
}
```

### Trading System Events

#### TradeOfferCreated
**Emitted when**: A new trade offer is posted  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Trading marketplace, offer listings

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct TradeOfferCreated {
    #[key]
    pub offer_id: u256,           // Trade offer ID
    #[key]
    pub creator: ContractAddress, // Offer creator
    pub offered_fish_id: u256,    // Fish being offered
    pub criteria: MatchCriteria,  // Matching criteria
    pub requested_fish_id: Option<u256>,    // Specific fish wanted
    pub requested_species: Option<u8>,      // Species preference
    pub requested_generation: Option<u8>,   // Generation preference
    pub expires_at: u64,          // Offer expiration
}
```

#### TradeOfferAccepted
**Emitted when**: A trade offer is accepted and executed  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Trade confirmations, ownership updates

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct TradeOfferAccepted {
    #[key]
    pub offer_id: u256,           // Original offer ID
    #[key]
    pub acceptor: ContractAddress, // Trade acceptor
    #[key]
    pub creator: ContractAddress,  // Original creator
    pub creator_fish_id: u256,     // Fish from creator
    pub acceptor_fish_id: u256,    // Fish from acceptor
    pub timestamp: u64,            // Trade timestamp
}
```

#### TradeOfferCancelled
**Emitted when**: A trade offer is cancelled  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Marketplace updates, offer removals

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct TradeOfferCancelled {
    #[key]
    pub offer_id: u256,           // Cancelled offer
    #[key]
    pub creator: ContractAddress, // Offer creator
    pub offered_fish_id: u256,    // Fish in offer
    pub timestamp: u64,           // Cancellation timestamp
}
```

#### FishLocked/FishUnlocked
**Emitted when**: Fish are locked/unlocked for trading  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Trading status indicators

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishLocked {
    #[key]
    pub fish_id: u256,            // Locked fish
    #[key]
    pub owner: ContractAddress,   // Fish owner
    pub locked_by_offer: u256,    // Locking trade offer
    pub timestamp: u64,           // Lock timestamp
}

#[derive(Copy, Drop, Serde)]
#[dojo::event] 
pub struct FishUnlocked {
    #[key]
    pub fish_id: u256,            // Unlocked fish
    #[key]
    pub owner: ContractAddress,   // Fish owner
    pub timestamp: u64,           // Unlock timestamp
}
```

### Daily Challenge Events

#### ChallengeCreated
**Emitted when**: A new daily challenge is generated  
**Contract**: `daily_challenge.cairo`  
**Frontend Usage**: Challenge notifications, daily activities

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct ChallengeCreated {
    #[key]
    pub challenge_id: u64,        // Challenge identifier
    pub challenge_type: felt252,  // Challenge category
    pub param1: felt252,          // Challenge parameter 1
    pub param2: felt252,          // Challenge parameter 2
    pub value1: u64,              // Target value 1
    pub value2: u64,              // Target value 2
    pub difficulty: u8,           // Difficulty level (1-5)
}
```

#### ParticipantJoined
**Emitted when**: A player joins a daily challenge  
**Contract**: `daily_challenge.cairo`  
**Frontend Usage**: Challenge participation tracking

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct ParticipantJoined {
    #[key]
    pub challenge_id: u64,        // Challenge ID
    pub participant: ContractAddress, // Joining player
}
```

#### ChallengeCompleted
**Emitted when**: A player completes a challenge  
**Contract**: `daily_challenge.cairo`  
**Frontend Usage**: Achievement notifications, progress updates

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct ChallengeCompleted {
    #[key]
    pub challenge_id: u64,        // Completed challenge
    pub participant: ContractAddress, // Completing player
}
```

#### RewardClaimed
**Emitted when**: A player claims challenge rewards  
**Contract**: `daily_challenge.cairo`  
**Frontend Usage**: Reward notifications, inventory updates

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct RewardClaimed {
    #[key]
    pub challenge_id: u64,        // Challenge ID
    #[key]
    pub participant: ContractAddress, // Claiming player
    pub reward_amount: u256,       // Reward value
}
```

### Event System Events

#### PlayerEventLogged
**Emitted when**: A player event is recorded  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Activity tracking, analytics

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct PlayerEventLogged {
    #[key]
    pub id: u256,                 // Event ID
    #[key]
    pub event_type_id: u256,      // Event type
    pub player: ContractAddress,  // Player address
    pub timestamp: u64,           // Event timestamp
}
```

#### EventTypeRegistered
**Emitted when**: A new event type is registered  
**Contract**: `AquaStark.cairo`  
**Frontend Usage**: Event system setup

```cairo
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct EventTypeRegistered {
    #[key]
    pub event_type_id: u256,      // Event type ID
    pub timestamp: u64,           // Registration timestamp
}
```

---

## ABI Structures (Data Models)

### Core Game Models

#### Player
**Description**: Main player account data  
**Frontend Usage**: Profile display, authentication, player stats

```typescript
export interface Player {
    wallet: string,              // Player's wallet address
    id: BigNumberish,           // Unique player ID
    username: BigNumberish,     // Player username (felt252)
    inventory_ref: string,      // Inventory reference
    is_verified: boolean,       // Verification status
    aquarium_count: BigNumberish, // Number of aquariums owned
    fish_count: BigNumberish,   // Number of fish owned
    player_fishes: Array<BigNumberish>, // Fish IDs array
    player_aquariums: Array<BigNumberish>, // Aquarium IDs array
    player_decorations: Array<BigNumberish>, // Decoration IDs array
    decoration_count: BigNumberish, // Number of decorations
    registered_at: BigNumberish, // Registration timestamp
}
```

#### Fish
**Description**: Individual fish NFT data  
**Frontend Usage**: Fish display, breeding interface, marketplace

```typescript
export interface Fish {
    id: BigNumberish,           // Unique fish identifier
    fish_type: BigNumberish,    // Fish type classification
    age: BigNumberish,          // Fish age
    hunger_level: BigNumberish, // Current hunger (0-100)
    health: BigNumberish,       // Current health (0-100)
    growth: BigNumberish,       // Growth progress
    growth_rate: BigNumberish,  // Growth speed
    owner: string,              // Owner's wallet address
    species: SpeciesEnum,       // Fish species (AngelFish, GoldFish, etc.)
    generation: BigNumberish,   // Breeding generation
    color: BigNumberish,        // Color attribute
    pattern: PatternEnum,       // Pattern (Plain, Spotted, Stripes)
    size: BigNumberish,         // Fish size
    speed: BigNumberish,        // Swimming speed
    birth_time: BigNumberish,   // Birth timestamp
    parent_ids: [BigNumberish, BigNumberish], // Parent fish IDs
    mutation_rate: BigNumberish, // Genetic mutation rate
    growth_counter: BigNumberish, // Growth tracking
    can_grow: boolean,          // Growth eligibility
    aquarium_id: BigNumberish,  // Current aquarium
    offspings: Array<BigNumberish>, // Offspring fish IDs
    family_tree: Array<FishParents>, // Ancestry data
}
```

#### Aquarium
**Description**: Player aquarium container data  
**Frontend Usage**: Aquarium management, capacity tracking

```typescript
export interface Aquarium {
    id: BigNumberish,           // Unique aquarium ID
    owner: string,              // Owner's wallet address
    fish_count: BigNumberish,   // Current fish count
    decoration_count: BigNumberish, // Current decoration count
    max_capacity: BigNumberish, // Maximum fish capacity
    cleanliness: BigNumberish,  // Cleanliness level (0-100)
    housed_fish: Array<BigNumberish>, // Fish IDs in aquarium
    housed_decorations: Array<BigNumberish>, // Decoration IDs
    max_decorations: BigNumberish, // Maximum decoration capacity
}
```

#### Decoration
**Description**: Aquarium decoration item data  
**Frontend Usage**: Store interface, aquarium customization

```typescript
export interface Decoration {
    id: BigNumberish,           // Decoration identifier
    owner: string,              // Owner's wallet address
    aquarium_id: BigNumberish,  // Placed aquarium (0 = inventory)
    name: BigNumberish,         // Decoration name (felt252)
    description: BigNumberish,  // Description (felt252)
    price: BigNumberish,        // Purchase/sale price
    rarity: BigNumberish,       // Rarity level
}
```

#### Game
**Description**: Global game state and settings  
**Frontend Usage**: Feature toggles, global statistics

```typescript
export interface Game {
    id: BigNumberish,           // Game instance ID
    created_by: BigNumberish,   // Creator ID
    is_initialized: boolean,    // Initialization status
    total_players: BigNumberish, // Total registered players
    total_aquariums: BigNumberish, // Total aquariums created
    total_fish: BigNumberish,   // Total fish spawned
    total_decorations: BigNumberish, // Total decorations
    fish_genealogy_enabled: boolean, // Genealogy feature toggle
    fish_genes_onchain: boolean, // On-chain genetics toggle
    marketplace_enabled: boolean, // Market feature toggle
    auctions_enabled: boolean,  // Auction feature toggle
    active_events: Array<BigNumberish>, // Active event IDs
    leaderboard: Array<[BigNumberish, BigNumberish]>, // Player rankings
    created_at: BigNumberish,   // Game creation timestamp
    last_updated: BigNumberish, // Last update timestamp
}
```

### Trading System Models

#### TradeOffer
**Description**: Trade offer data structure  
**Frontend Usage**: Trading marketplace, offer management

```typescript
export interface TradeOffer {
    offer_id: BigNumberish,     // Offer identifier
    creator: string,            // Offer creator address
    offered_fish_id: BigNumberish, // Fish being offered
    criteria: MatchCriteria,    // Matching requirements
    requested_fish_id: Option<BigNumberish>, // Specific fish wanted
    requested_species: Option<u8>, // Species preference
    requested_generation: Option<u8>, // Generation preference
    is_locked: boolean,         // Lock status
    created_at: BigNumberish,   // Creation timestamp
    expires_at: BigNumberish,   // Expiration timestamp
    status: TradeOfferStatus,   // Current status
}
```

#### MatchCriteria
**Description**: Trade matching requirements  
**Frontend Usage**: Trade filtering, offer creation

```typescript
export interface MatchCriteria {
    species: Option<u8>,        // Required species
    min_generation: Option<u8>, // Minimum generation
    max_generation: Option<u8>, // Maximum generation
    traits: Array<BigNumberish>, // Required traits
}
```

### Daily Challenge Models

#### DailyChallenge
**Description**: Daily challenge configuration  
**Frontend Usage**: Challenge display, progress tracking

```typescript
export interface DailyChallenge {
    challenge_id: BigNumberish, // Challenge identifier
    challenge_type: BigNumberish, // Challenge category
    param1: BigNumberish,       // Challenge parameter 1
    param2: BigNumberish,       // Challenge parameter 2
    value1: BigNumberish,       // Target value 1
    value2: BigNumberish,       // Target value 2
    difficulty: u8,             // Difficulty level (1-5)
    active: boolean,            // Active status
}
```

#### ChallengeParticipation
**Description**: Player challenge participation data  
**Frontend Usage**: Progress tracking, reward status

```typescript
export interface ChallengeParticipation {
    challenge_id: BigNumberish, // Challenge ID
    participant: string,        // Player address
    joined: boolean,            // Participation status
    completed: boolean,         // Completion status
    reward_claimed: boolean,    // Reward claim status
}
```

### Auction Models

#### Auction
**Description**: Auction data structure  
**Frontend Usage**: Auction marketplace, bidding interface

```typescript
export interface Auction {
    auction_id: BigNumberish,   // Auction identifier
    fish_id: BigNumberish,      // Fish being auctioned
    seller: string,             // Seller address
    current_bid: BigNumberish,  // Current highest bid
    current_bidder: string,     // Current highest bidder
    reserve_price: BigNumberish, // Reserve price
    start_time: BigNumberish,   // Auction start time
    end_time: BigNumberish,     // Auction end time
    is_active: boolean,         // Active status
}
```

### Enum Types

#### SpeciesEnum
**Description**: Available fish species  
**Values**: `AngelFish`, `GoldFish`, `Betta`, `NeonTetra`, `Corydoras`, `Hybrid`

#### PatternEnum  
**Description**: Fish pattern types  
**Values**: `Plain`, `Spotted`, `Stripes`

#### TradeOfferStatus
**Description**: Trade offer states  
**Values**: `Active`, `Completed`, `Cancelled`, `Expired`

#### DailyChallengeType
**Description**: Daily challenge categories  
**Values**: `BreedTarget`, `FishCountGoal`, `DecorationMaster`, `SurvivalStreak`, `HealthAbove`, `NoDeaths`, `RareDecorations`

---

## Frontend Usage Cross-Reference

### Event Consumption by Components

#### Player & Authentication
- **Components**: `client/src/starknet-provider.tsx`, `client/src/pages/onboarding/`
- **Events Consumed**: `PlayerCreated`
- **Purpose**: User registration, profile creation, onboarding flow

#### Aquarium Management
- **Components**: `client/src/components/aquarium/`, `client/src/hooks/dojo/useAquarium.ts`
- **Events Consumed**: `FishAddedToAquarium`, `DecorationAddedToAquarium`, `FishMoved`, `DecorationMoved`
- **Purpose**: Real-time aquarium updates, fish/decoration placement

#### Fish Breeding
- **Components**: `client/src/components/laboratory/`, `client/src/hooks/dojo/useFish.ts`
- **Events Consumed**: `FishCreated`, `FishBred`
- **Purpose**: Breeding interface updates, new fish notifications

#### Marketplace
- **Components**: `client/src/components/market/`, `client/src/pages/trading-market.tsx`
- **Events Consumed**: `FishPurchased`, `AuctionStarted`, `BidPlaced`, `AuctionEnded`
- **Purpose**: Market activity, auction updates, transaction notifications

#### Trading System
- **Components**: `client/src/components/market/`, `client/src/store/market-store.ts`
- **Events Consumed**: `TradeOfferCreated`, `TradeOfferAccepted`, `TradeOfferCancelled`, `FishLocked`, `FishUnlocked`
- **Purpose**: Trade offer management, status updates

#### Daily Challenges
- **Components**: `client/src/components/achievements/`, `client/src/hooks/use-events-calendar.ts`
- **Events Consumed**: `ChallengeCreated`, `ParticipantJoined`, `ChallengeCompleted`, `RewardClaimed`
- **Purpose**: Challenge tracking, progress updates, reward notifications

### ABI Structure Usage by Hooks

#### Fish Management
- **Hook**: `client/src/hooks/dojo/useFish.ts`
- **Models Used**: `Fish`, `FishCounter`, `FishOwner`, `FishParents`
- **Methods**: `createFishId`, `getFish`, `newFish`, `breedFishes`, `getFishOwner`, `getFishParents`, `getFishOffspring`

#### Aquarium Management  
- **Hook**: `client/src/hooks/dojo/useAquarium.ts`
- **Models Used**: `Aquarium`, `AquariumCounter`, `AquariumOwner`
- **Methods**: `createAquariumId`, `getAquarium`, `newAquarium`, `addFishToAquarium`, `addDecorationToAquarium`

#### Player Management
- **Hook**: `client/src/dojoclient/index.tsx`
- **Models Used**: `Player`, `PlayerCounter`, `AddressToUsername`, `UsernameToAddress`
- **Methods**: `register`, `getPlayer`, `getUsernameFromAddress`

#### Game State
- **Hook**: `client/src/dojoclient/index.tsx`
- **Models Used**: `Game`, `GameCounter`
- **Methods**: Global game state queries and updates

### Event Subscription Patterns

#### Historical Events
- **Component**: `client/src/historical-events.tsx`
- **Purpose**: Query and display past events for a player
- **Implementation**: Uses Dojo SDK `subscribeEventQuery` with historical flag

#### Real-time Updates
- **Implementation**: Components use Dojo SDK subscriptions to listen for new events
- **Pattern**: Event listeners trigger state updates and UI re-renders

---

## Contract Change Guidelines

### Breaking Changes to Avoid

#### 1. Event Structure Changes
**❌ DON'T**:
- Remove fields from existing events
- Change field types or names
- Reorder event fields

**✅ DO**:
- Add new optional fields at the end
- Create new event types for new functionality
- Use versioned event names if major changes needed

#### 2. Model Structure Changes
**❌ DON'T**:
- Remove fields from existing models
- Change field types in breaking ways
- Rename model structures

**✅ DO**:
- Add new optional fields
- Create new model versions
- Use migration patterns for data structure updates

#### 3. Enum Value Changes
**❌ DON'T**:
- Remove enum values that are in use
- Change enum ordinal values
- Rename enum variants

**✅ DO**:
- Add new enum values at the end
- Create new enum types for new use cases
- Deprecate old values gracefully

### Safe Change Patterns

#### 1. Additive Changes
- New event types
- New model fields (optional)
- New enum values
- New contract methods

#### 2. Backward-Compatible Updates
- Internal optimizations
- Bug fixes that don't change interfaces
- Performance improvements
- Documentation updates

#### 3. Deprecation Strategy
1. Mark old interfaces as deprecated
2. Provide migration timeline
3. Support both old and new interfaces during transition
4. Update frontend progressively
5. Remove deprecated interfaces after transition

### Frontend Impact Assessment

Before making contract changes, assess impact on:

#### 1. Component Dependencies
- Check which components consume affected events/models
- Identify real-time vs batch update requirements
- Plan UI update strategies

#### 2. State Management
- Review store dependencies on contract data
- Plan state migration if structures change
- Consider caching implications

#### 3. User Experience
- Assess impact on active user sessions
- Plan graceful degradation for unsupported changes
- Consider backward compatibility requirements

### Change Validation Checklist

- [ ] All existing events maintain structure compatibility
- [ ] New fields are optional or have default values
- [ ] Frontend TypeScript types are updated
- [ ] Event subscriptions handle new event types
- [ ] Database migrations planned (if needed)
- [ ] Testing covers both old and new structures
- [ ] Documentation updated
- [ ] Stakeholders notified of changes

---

## Version History

### Version 1.0.0 (2025-01-17)
- **Initial Documentation**: Complete mapping of all contract events and ABI structures
- **Events Documented**: 23 event types across 6 contract categories
- **Models Documented**: 15+ core data structures
- **Frontend Cross-Reference**: Complete component and hook mapping
- **Guidelines Established**: Contract change patterns and safety guidelines

### Future Versions
Future updates to this document should:
1. Increment version number
2. Document all changes in this section
3. Update affected component mappings
4. Review and update change guidelines
5. Validate all cross-references remain accurate

---

## Maintenance Notes

- **Review Schedule**: Quarterly review recommended
- **Update Triggers**: Any contract deployment, new frontend features, breaking changes
- **Ownership**: Backend and Frontend teams jointly responsible
- **Validation**: Cross-team review required for all updates

This document serves as the single source of truth for contract-frontend integration. All contract changes should reference this document, and all frontend development should use this as the authoritative API reference.
