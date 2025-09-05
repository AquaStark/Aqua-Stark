import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_AquaAuction_endAuction_calldata = (auctionId: BigNumberish): DojoCall => {
		return {
			contractName: "AquaAuction",
			entrypoint: "end_auction",
			calldata: [auctionId],
		};
	};

	const AquaAuction_endAuction = async (snAccount: Account | AccountInterface, auctionId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaAuction_endAuction_calldata(auctionId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaAuction_getActiveAuctions_calldata = (): DojoCall => {
		return {
			contractName: "AquaAuction",
			entrypoint: "get_active_auctions",
			calldata: [],
		};
	};

	const AquaAuction_getActiveAuctions = async () => {
		try {
			return await provider.call("aqua_stark", build_AquaAuction_getActiveAuctions_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaAuction_getAuctionById_calldata = (auctionId: BigNumberish): DojoCall => {
		return {
			contractName: "AquaAuction",
			entrypoint: "get_auction_by_id",
			calldata: [auctionId],
		};
	};

	const AquaAuction_getAuctionById = async (auctionId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_AquaAuction_getAuctionById_calldata(auctionId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaAuction_placeBid_calldata = (auctionId: BigNumberish, amount: BigNumberish): DojoCall => {
		return {
			contractName: "AquaAuction",
			entrypoint: "place_bid",
			calldata: [auctionId, amount],
		};
	};

	const AquaAuction_placeBid = async (snAccount: Account | AccountInterface, auctionId: BigNumberish, amount: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaAuction_placeBid_calldata(auctionId, amount),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaAuction_startAuction_calldata = (fishId: BigNumberish, durationSecs: BigNumberish, reservePrice: BigNumberish): DojoCall => {
		return {
			contractName: "AquaAuction",
			entrypoint: "start_auction",
			calldata: [fishId, durationSecs, reservePrice],
		};
	};

	const AquaAuction_startAuction = async (snAccount: Account | AccountInterface, fishId: BigNumberish, durationSecs: BigNumberish, reservePrice: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaAuction_startAuction_calldata(fishId, durationSecs, reservePrice),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_confirmTransaction_calldata = (transactionId: BigNumberish, confirmationHash: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "confirm_transaction",
			calldata: [transactionId, confirmationHash],
		};
	};

	const AquaStark_confirmTransaction = async (snAccount: Account | AccountInterface, transactionId: BigNumberish, confirmationHash: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_confirmTransaction_calldata(transactionId, confirmationHash),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getAllEventTypes_calldata = (): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_all_event_types",
			calldata: [],
		};
	};

	const AquaStark_getAllEventTypes = async () => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getAllEventTypes_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getAquarium_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_aquarium",
			calldata: [id],
		};
	};

	const AquaStark_getAquarium = async (id: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getAquarium_calldata(id));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getAquariumOwner_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_aquarium_owner",
			calldata: [id],
		};
	};

	const AquaStark_getAquariumOwner = async (id: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getAquariumOwner_calldata(id));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getDecoration_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_decoration",
			calldata: [id],
		};
	};

	const AquaStark_getDecoration = async (id: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getDecoration_calldata(id));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getDecorationOwner_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_decoration_owner",
			calldata: [id],
		};
	};

	const AquaStark_getDecorationOwner = async (id: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getDecorationOwner_calldata(id));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getEventTypeDetails_calldata = (eventTypeId: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_event_type_details",
			calldata: [eventTypeId],
		};
	};

	const AquaStark_getEventTypeDetails = async (eventTypeId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getEventTypeDetails_calldata(eventTypeId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getEventTypesCount_calldata = (): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_event_types_count",
			calldata: [],
		};
	};

	const AquaStark_getEventTypesCount = async () => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getEventTypesCount_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getFishOwnerForAuction_calldata = (fishId: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_fish_owner_for_auction",
			calldata: [fishId],
		};
	};

	const AquaStark_getFishOwnerForAuction = async (fishId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getFishOwnerForAuction_calldata(fishId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getPlayer_calldata = (address: string): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_player",
			calldata: [address],
		};
	};

	const AquaStark_getPlayer = async (address: string) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getPlayer_calldata(address));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getPlayerAquariumCount_calldata = (player: string): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_player_aquarium_count",
			calldata: [player],
		};
	};

	const AquaStark_getPlayerAquariumCount = async (player: string) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getPlayerAquariumCount_calldata(player));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getPlayerAquariums_calldata = (player: string): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_player_aquariums",
			calldata: [player],
		};
	};

	const AquaStark_getPlayerAquariums = async (player: string) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getPlayerAquariums_calldata(player));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getPlayerDecorationCount_calldata = (player: string): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_player_decoration_count",
			calldata: [player],
		};
	};

	const AquaStark_getPlayerDecorationCount = async (player: string) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getPlayerDecorationCount_calldata(player));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getPlayerDecorations_calldata = (player: string): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_player_decorations",
			calldata: [player],
		};
	};

	const AquaStark_getPlayerDecorations = async (player: string) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getPlayerDecorations_calldata(player));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getTransactionCount_calldata = (): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_transaction_count",
			calldata: [],
		};
	};

	const AquaStark_getTransactionCount = async () => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getTransactionCount_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getTransactionHistory_calldata = (player: CairoOption<string>, eventTypeId: CairoOption<string>, start: CairoOption<string>, limit: CairoOption<string>, startTimestamp: CairoOption<string>, endTimestamp: CairoOption<string>): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_transaction_history",
			calldata: [player, eventTypeId, start, limit, startTimestamp, endTimestamp],
		};
	};

	const AquaStark_getTransactionHistory = async (player: CairoOption<string>, eventTypeId: CairoOption<string>, start: CairoOption<string>, limit: CairoOption<string>, startTimestamp: CairoOption<string>, endTimestamp: CairoOption<string>) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getTransactionHistory_calldata(player, eventTypeId, start, limit, startTimestamp, endTimestamp));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getTransactionStatus_calldata = (transactionId: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_transaction_status",
			calldata: [transactionId],
		};
	};

	const AquaStark_getTransactionStatus = async (transactionId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getTransactionStatus_calldata(transactionId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getUsernameFromAddress_calldata = (address: string): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_username_from_address",
			calldata: [address],
		};
	};

	const AquaStark_getUsernameFromAddress = async (address: string) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getUsernameFromAddress_calldata(address));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_initiateTransaction_calldata = (player: string, eventTypeId: BigNumberish, payload: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "initiate_transaction",
			calldata: [player, eventTypeId, payload],
		};
	};

	const AquaStark_initiateTransaction = async (snAccount: Account | AccountInterface, player: string, eventTypeId: BigNumberish, payload: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_initiateTransaction_calldata(player, eventTypeId, payload),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_isTransactionConfirmed_calldata = (transactionId: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "is_transaction_confirmed",
			calldata: [transactionId],
		};
	};

	const AquaStark_isTransactionConfirmed = async (transactionId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_isTransactionConfirmed_calldata(transactionId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_isVerified_calldata = (player: string): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "is_verified",
			calldata: [player],
		};
	};

	const AquaStark_isVerified = async (player: string) => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_isVerified_calldata(player));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_logEvent_calldata = (eventTypeId: BigNumberish, player: string, payload: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "log_event",
			calldata: [eventTypeId, player, payload],
		};
	};

	const AquaStark_logEvent = async (snAccount: Account | AccountInterface, eventTypeId: BigNumberish, player: string, payload: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_logEvent_calldata(eventTypeId, player, payload),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_newAquarium_calldata = (owner: string, maxCapacity: BigNumberish, maxDecorations: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "new_aquarium",
			calldata: [owner, maxCapacity, maxDecorations],
		};
	};

	const AquaStark_newAquarium = async (snAccount: Account | AccountInterface, owner: string, maxCapacity: BigNumberish, maxDecorations: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_newAquarium_calldata(owner, maxCapacity, maxDecorations),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_newDecoration_calldata = (aquariumId: BigNumberish, name: BigNumberish, description: BigNumberish, price: BigNumberish, rarity: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "new_decoration",
			calldata: [aquariumId, name, description, price, rarity],
		};
	};

	const AquaStark_newDecoration = async (snAccount: Account | AccountInterface, aquariumId: BigNumberish, name: BigNumberish, description: BigNumberish, price: BigNumberish, rarity: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_newDecoration_calldata(aquariumId, name, description, price, rarity),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_processTransaction_calldata = (transactionId: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "process_transaction",
			calldata: [transactionId],
		};
	};

	const AquaStark_processTransaction = async (snAccount: Account | AccountInterface, transactionId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_processTransaction_calldata(transactionId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_register_calldata = (username: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "register",
			calldata: [username],
		};
	};

	const AquaStark_register = async (snAccount: Account | AccountInterface, username: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_register_calldata(username),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_registerEventType_calldata = (eventName: ByteArray): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "register_event_type",
			calldata: [eventName],
		};
	};

	const AquaStark_registerEventType = async (snAccount: Account | AccountInterface, eventName: ByteArray) => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_registerEventType_calldata(eventName),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_addFishToAquarium_calldata = (fish: models.Fish, aquariumId: BigNumberish): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "add_fish_to_aquarium",
			calldata: [fish, aquariumId],
		};
	};

	const FishSystem_addFishToAquarium = async (snAccount: Account | AccountInterface, fish: models.Fish, aquariumId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_FishSystem_addFishToAquarium_calldata(fish, aquariumId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_breedFishes_calldata = (parent1Id: BigNumberish, parent2Id: BigNumberish): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "breed_fishes",
			calldata: [parent1Id, parent2Id],
		};
	};

	const FishSystem_breedFishes = async (snAccount: Account | AccountInterface, parent1Id: BigNumberish, parent2Id: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_FishSystem_breedFishes_calldata(parent1Id, parent2Id),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_getFish_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "get_fish",
			calldata: [id],
		};
	};

	const FishSystem_getFish = async (id: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_FishSystem_getFish_calldata(id));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_getFishAncestor_calldata = (fishId: BigNumberish, generation: BigNumberish): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "get_fish_ancestor",
			calldata: [fishId, generation],
		};
	};

	const FishSystem_getFishAncestor = async (fishId: BigNumberish, generation: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_FishSystem_getFishAncestor_calldata(fishId, generation));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_getFishFamilyTree_calldata = (fishId: BigNumberish): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "get_fish_family_tree",
			calldata: [fishId],
		};
	};

	const FishSystem_getFishFamilyTree = async (fishId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_FishSystem_getFishFamilyTree_calldata(fishId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_getFishOffspring_calldata = (fishId: BigNumberish): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "get_fish_offspring",
			calldata: [fishId],
		};
	};

	const FishSystem_getFishOffspring = async (fishId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_FishSystem_getFishOffspring_calldata(fishId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_getFishOwner_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "get_fish_owner",
			calldata: [id],
		};
	};

	const FishSystem_getFishOwner = async (id: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_FishSystem_getFishOwner_calldata(id));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_getParents_calldata = (fishId: BigNumberish): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "get_parents",
			calldata: [fishId],
		};
	};

	const FishSystem_getParents = async (fishId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_FishSystem_getParents_calldata(fishId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_getPlayerFishCount_calldata = (player: string): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "get_player_fish_count",
			calldata: [player],
		};
	};

	const FishSystem_getPlayerFishCount = async (player: string) => {
		try {
			return await provider.call("aqua_stark", build_FishSystem_getPlayerFishCount_calldata(player));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_getPlayerFishes_calldata = (player: string): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "get_player_fishes",
			calldata: [player],
		};
	};

	const FishSystem_getPlayerFishes = async (player: string) => {
		try {
			return await provider.call("aqua_stark", build_FishSystem_getPlayerFishes_calldata(player));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_listFish_calldata = (fishId: BigNumberish, price: BigNumberish): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "list_fish",
			calldata: [fishId, price],
		};
	};

	const FishSystem_listFish = async (fishId: BigNumberish, price: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_FishSystem_listFish_calldata(fishId, price));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_moveFishToAquarium_calldata = (fishId: BigNumberish, from: BigNumberish, to: BigNumberish): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "move_fish_to_aquarium",
			calldata: [fishId, from, to],
		};
	};

	const FishSystem_moveFishToAquarium = async (snAccount: Account | AccountInterface, fishId: BigNumberish, from: BigNumberish, to: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_FishSystem_moveFishToAquarium_calldata(fishId, from, to),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_newFish_calldata = (aquariumId: BigNumberish, species: CairoCustomEnum): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "new_fish",
			calldata: [aquariumId, species],
		};
	};

	const FishSystem_newFish = async (snAccount: Account | AccountInterface, aquariumId: BigNumberish, species: CairoCustomEnum) => {
		try {
			return await provider.execute(
				snAccount,
				build_FishSystem_newFish_calldata(aquariumId, species),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_FishSystem_purchaseFish_calldata = (listingId: BigNumberish): DojoCall => {
		return {
			contractName: "FishSystem",
			entrypoint: "purchase_fish",
			calldata: [listingId],
		};
	};

	const FishSystem_purchaseFish = async (snAccount: Account | AccountInterface, listingId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_FishSystem_purchaseFish_calldata(listingId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_ShopCatalog_addNewItem_calldata = (price: BigNumberish, stock: BigNumberish, description: BigNumberish): DojoCall => {
		return {
			contractName: "ShopCatalog",
			entrypoint: "add_new_item",
			calldata: [price, stock, description],
		};
	};

	const ShopCatalog_addNewItem = async (price: BigNumberish, stock: BigNumberish, description: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_ShopCatalog_addNewItem_calldata(price, stock, description));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_ShopCatalog_getAllItems_calldata = (): DojoCall => {
		return {
			contractName: "ShopCatalog",
			entrypoint: "get_all_items",
			calldata: [],
		};
	};

	const ShopCatalog_getAllItems = async () => {
		try {
			return await provider.call("aqua_stark", build_ShopCatalog_getAllItems_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_ShopCatalog_getItem_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: "ShopCatalog",
			entrypoint: "get_item",
			calldata: [id],
		};
	};

	const ShopCatalog_getItem = async (id: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_ShopCatalog_getItem_calldata(id));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_ShopCatalog_updateItem_calldata = (id: BigNumberish, price: BigNumberish, stock: BigNumberish, description: BigNumberish): DojoCall => {
		return {
			contractName: "ShopCatalog",
			entrypoint: "update_item",
			calldata: [id, price, stock, description],
		};
	};

	const ShopCatalog_updateItem = async (id: BigNumberish, price: BigNumberish, stock: BigNumberish, description: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_ShopCatalog_updateItem_calldata(id, price, stock, description));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Trade_acceptTradeOffer_calldata = (offerId: BigNumberish, offeredFishId: BigNumberish): DojoCall => {
		return {
			contractName: "Trade",
			entrypoint: "accept_trade_offer",
			calldata: [offerId, offeredFishId],
		};
	};

	const Trade_acceptTradeOffer = async (snAccount: Account | AccountInterface, offerId: BigNumberish, offeredFishId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Trade_acceptTradeOffer_calldata(offerId, offeredFishId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Trade_cancelTradeOffer_calldata = (offerId: BigNumberish): DojoCall => {
		return {
			contractName: "Trade",
			entrypoint: "cancel_trade_offer",
			calldata: [offerId],
		};
	};

	const Trade_cancelTradeOffer = async (snAccount: Account | AccountInterface, offerId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Trade_cancelTradeOffer_calldata(offerId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Trade_cleanupExpiredOffers_calldata = (): DojoCall => {
		return {
			contractName: "Trade",
			entrypoint: "cleanup_expired_offers",
			calldata: [],
		};
	};

	const Trade_cleanupExpiredOffers = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_Trade_cleanupExpiredOffers_calldata(),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Trade_createTradeOffer_calldata = (offeredFishId: BigNumberish, criteria: CairoCustomEnum, requestedFishId: CairoOption<BigNumberish>, requestedSpecies: CairoOption<BigNumberish>, requestedGeneration: CairoOption<BigNumberish>, requestedTraits: Array<BigNumberish>, durationHours: BigNumberish): DojoCall => {
		return {
			contractName: "Trade",
			entrypoint: "create_trade_offer",
			calldata: [offeredFishId, criteria, requestedFishId, requestedSpecies, requestedGeneration, requestedTraits, durationHours],
		};
	};

	const Trade_createTradeOffer = async (snAccount: Account | AccountInterface, offeredFishId: BigNumberish, criteria: CairoCustomEnum, requestedFishId: CairoOption<BigNumberish>, requestedSpecies: CairoOption<BigNumberish>, requestedGeneration: CairoOption<BigNumberish>, requestedTraits: Array<BigNumberish>, durationHours: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Trade_createTradeOffer_calldata(offeredFishId, criteria, requestedFishId, requestedSpecies, requestedGeneration, requestedTraits, durationHours),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Trade_getActiveTradeOffers_calldata = (creator: string): DojoCall => {
		return {
			contractName: "Trade",
			entrypoint: "get_active_trade_offers",
			calldata: [creator],
		};
	};

	const Trade_getActiveTradeOffers = async (creator: string) => {
		try {
			return await provider.call("aqua_stark", build_Trade_getActiveTradeOffers_calldata(creator));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Trade_getAllActiveOffers_calldata = (): DojoCall => {
		return {
			contractName: "Trade",
			entrypoint: "get_all_active_offers",
			calldata: [],
		};
	};

	const Trade_getAllActiveOffers = async () => {
		try {
			return await provider.call("aqua_stark", build_Trade_getAllActiveOffers_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Trade_getFishLockStatus_calldata = (fishId: BigNumberish): DojoCall => {
		return {
			contractName: "Trade",
			entrypoint: "get_fish_lock_status",
			calldata: [fishId],
		};
	};

	const Trade_getFishLockStatus = async (fishId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_Trade_getFishLockStatus_calldata(fishId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Trade_getOffersForFish_calldata = (fishId: BigNumberish): DojoCall => {
		return {
			contractName: "Trade",
			entrypoint: "get_offers_for_fish",
			calldata: [fishId],
		};
	};

	const Trade_getOffersForFish = async (fishId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_Trade_getOffersForFish_calldata(fishId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Trade_getTotalTradesCount_calldata = (): DojoCall => {
		return {
			contractName: "Trade",
			entrypoint: "get_total_trades_count",
			calldata: [],
		};
	};

	const Trade_getTotalTradesCount = async () => {
		try {
			return await provider.call("aqua_stark", build_Trade_getTotalTradesCount_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Trade_getTradeOffer_calldata = (offerId: BigNumberish): DojoCall => {
		return {
			contractName: "Trade",
			entrypoint: "get_trade_offer",
			calldata: [offerId],
		};
	};

	const Trade_getTradeOffer = async (offerId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_Trade_getTradeOffer_calldata(offerId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Trade_getUserTradeCount_calldata = (user: string): DojoCall => {
		return {
			contractName: "Trade",
			entrypoint: "get_user_trade_count",
			calldata: [user],
		};
	};

	const Trade_getUserTradeCount = async (user: string) => {
		try {
			return await provider.call("aqua_stark", build_Trade_getUserTradeCount_calldata(user));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Trade_isFishLocked_calldata = (fishId: BigNumberish): DojoCall => {
		return {
			contractName: "Trade",
			entrypoint: "is_fish_locked",
			calldata: [fishId],
		};
	};

	const Trade_isFishLocked = async (fishId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_Trade_isFishLocked_calldata(fishId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Transaction_confirmTransaction_calldata = (transactionId: BigNumberish, confirmationHash: BigNumberish): DojoCall => {
		return {
			contractName: "Transaction",
			entrypoint: "confirm_transaction",
			calldata: [transactionId, confirmationHash],
		};
	};

	const Transaction_confirmTransaction = async (snAccount: Account | AccountInterface, transactionId: BigNumberish, confirmationHash: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Transaction_confirmTransaction_calldata(transactionId, confirmationHash),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Transaction_getAllEventTypes_calldata = (): DojoCall => {
		return {
			contractName: "Transaction",
			entrypoint: "get_all_event_types",
			calldata: [],
		};
	};

	const Transaction_getAllEventTypes = async () => {
		try {
			return await provider.call("aqua_stark", build_Transaction_getAllEventTypes_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Transaction_getEventTypeDetails_calldata = (eventTypeId: BigNumberish): DojoCall => {
		return {
			contractName: "Transaction",
			entrypoint: "get_event_type_details",
			calldata: [eventTypeId],
		};
	};

	const Transaction_getEventTypeDetails = async (eventTypeId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_Transaction_getEventTypeDetails_calldata(eventTypeId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Transaction_getEventTypesCount_calldata = (): DojoCall => {
		return {
			contractName: "Transaction",
			entrypoint: "get_event_types_count",
			calldata: [],
		};
	};

	const Transaction_getEventTypesCount = async () => {
		try {
			return await provider.call("aqua_stark", build_Transaction_getEventTypesCount_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Transaction_getTransactionCount_calldata = (): DojoCall => {
		return {
			contractName: "Transaction",
			entrypoint: "get_transaction_count",
			calldata: [],
		};
	};

	const Transaction_getTransactionCount = async () => {
		try {
			return await provider.call("aqua_stark", build_Transaction_getTransactionCount_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Transaction_getTransactionHistory_calldata = (player: CairoOption<string>, eventTypeId: CairoOption<string>, start: CairoOption<string>, limit: CairoOption<string>, startTimestamp: CairoOption<string>, endTimestamp: CairoOption<string>): DojoCall => {
		return {
			contractName: "Transaction",
			entrypoint: "get_transaction_history",
			calldata: [player, eventTypeId, start, limit, startTimestamp, endTimestamp],
		};
	};

	const Transaction_getTransactionHistory = async (player: CairoOption<string>, eventTypeId: CairoOption<string>, start: CairoOption<string>, limit: CairoOption<string>, startTimestamp: CairoOption<string>, endTimestamp: CairoOption<string>) => {
		try {
			return await provider.call("aqua_stark", build_Transaction_getTransactionHistory_calldata(player, eventTypeId, start, limit, startTimestamp, endTimestamp));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Transaction_getTransactionStatus_calldata = (transactionId: BigNumberish): DojoCall => {
		return {
			contractName: "Transaction",
			entrypoint: "get_transaction_status",
			calldata: [transactionId],
		};
	};

	const Transaction_getTransactionStatus = async (transactionId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_Transaction_getTransactionStatus_calldata(transactionId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Transaction_initiateTransaction_calldata = (player: string, eventTypeId: BigNumberish, payload: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "Transaction",
			entrypoint: "initiate_transaction",
			calldata: [player, eventTypeId, payload],
		};
	};

	const Transaction_initiateTransaction = async (snAccount: Account | AccountInterface, player: string, eventTypeId: BigNumberish, payload: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_Transaction_initiateTransaction_calldata(player, eventTypeId, payload),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Transaction_isTransactionConfirmed_calldata = (transactionId: BigNumberish): DojoCall => {
		return {
			contractName: "Transaction",
			entrypoint: "is_transaction_confirmed",
			calldata: [transactionId],
		};
	};

	const Transaction_isTransactionConfirmed = async (transactionId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_Transaction_isTransactionConfirmed_calldata(transactionId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Transaction_logEvent_calldata = (eventTypeId: BigNumberish, player: string, payload: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "Transaction",
			entrypoint: "log_event",
			calldata: [eventTypeId, player, payload],
		};
	};

	const Transaction_logEvent = async (snAccount: Account | AccountInterface, eventTypeId: BigNumberish, player: string, payload: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_Transaction_logEvent_calldata(eventTypeId, player, payload),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Transaction_processTransaction_calldata = (transactionId: BigNumberish): DojoCall => {
		return {
			contractName: "Transaction",
			entrypoint: "process_transaction",
			calldata: [transactionId],
		};
	};

	const Transaction_processTransaction = async (snAccount: Account | AccountInterface, transactionId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Transaction_processTransaction_calldata(transactionId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Transaction_registerEventType_calldata = (eventName: ByteArray): DojoCall => {
		return {
			contractName: "Transaction",
			entrypoint: "register_event_type",
			calldata: [eventName],
		};
	};

	const Transaction_registerEventType = async (snAccount: Account | AccountInterface, eventName: ByteArray) => {
		try {
			return await provider.execute(
				snAccount,
				build_Transaction_registerEventType_calldata(eventName),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_daily_challenge_claimReward_calldata = (challengeId: BigNumberish): DojoCall => {
		return {
			contractName: "daily_challenge",
			entrypoint: "claim_reward",
			calldata: [challengeId],
		};
	};

	const daily_challenge_claimReward = async (snAccount: Account | AccountInterface, challengeId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_daily_challenge_claimReward_calldata(challengeId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_daily_challenge_completeChallenge_calldata = (challengeId: BigNumberish): DojoCall => {
		return {
			contractName: "daily_challenge",
			entrypoint: "complete_challenge",
			calldata: [challengeId],
		};
	};

	const daily_challenge_completeChallenge = async (snAccount: Account | AccountInterface, challengeId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_daily_challenge_completeChallenge_calldata(challengeId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_daily_challenge_createChallenge_calldata = (day: BigNumberish, seed: BigNumberish): DojoCall => {
		return {
			contractName: "daily_challenge",
			entrypoint: "create_challenge",
			calldata: [day, seed],
		};
	};

	const daily_challenge_createChallenge = async (snAccount: Account | AccountInterface, day: BigNumberish, seed: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_daily_challenge_createChallenge_calldata(day, seed),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_daily_challenge_joinChallenge_calldata = (challengeId: BigNumberish): DojoCall => {
		return {
			contractName: "daily_challenge",
			entrypoint: "join_challenge",
			calldata: [challengeId],
		};
	};

	const daily_challenge_joinChallenge = async (snAccount: Account | AccountInterface, challengeId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_daily_challenge_joinChallenge_calldata(challengeId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_session_calculateRemainingTransactions_calldata = (sessionId: BigNumberish): DojoCall => {
		return {
			contractName: "session",
			entrypoint: "calculate_remaining_transactions",
			calldata: [sessionId],
		};
	};

	const session_calculateRemainingTransactions = async (sessionId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_session_calculateRemainingTransactions_calldata(sessionId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_session_calculateSessionTimeRemaining_calldata = (sessionId: BigNumberish): DojoCall => {
		return {
			contractName: "session",
			entrypoint: "calculate_session_time_remaining",
			calldata: [sessionId],
		};
	};

	const session_calculateSessionTimeRemaining = async (sessionId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_session_calculateSessionTimeRemaining_calldata(sessionId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_session_checkSessionNeedsRenewal_calldata = (sessionId: BigNumberish): DojoCall => {
		return {
			contractName: "session",
			entrypoint: "check_session_needs_renewal",
			calldata: [sessionId],
		};
	};

	const session_checkSessionNeedsRenewal = async (sessionId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_session_checkSessionNeedsRenewal_calldata(sessionId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_session_createSessionKey_calldata = (duration: BigNumberish, maxTransactions: BigNumberish, sessionType: BigNumberish): DojoCall => {
		return {
			contractName: "session",
			entrypoint: "create_session_key",
			calldata: [duration, maxTransactions, sessionType],
		};
	};

	const session_createSessionKey = async (snAccount: Account | AccountInterface, duration: BigNumberish, maxTransactions: BigNumberish, sessionType: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_session_createSessionKey_calldata(duration, maxTransactions, sessionType),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_session_getSessionInfo_calldata = (sessionId: BigNumberish): DojoCall => {
		return {
			contractName: "session",
			entrypoint: "get_session_info",
			calldata: [sessionId],
		};
	};

	const session_getSessionInfo = async (sessionId: BigNumberish) => {
		try {
			return await provider.call("aqua_stark", build_session_getSessionInfo_calldata(sessionId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_session_renewSession_calldata = (sessionId: BigNumberish, newDuration: BigNumberish, newMaxTx: BigNumberish): DojoCall => {
		return {
			contractName: "session",
			entrypoint: "renew_session",
			calldata: [sessionId, newDuration, newMaxTx],
		};
	};

	const session_renewSession = async (snAccount: Account | AccountInterface, sessionId: BigNumberish, newDuration: BigNumberish, newMaxTx: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_session_renewSession_calldata(sessionId, newDuration, newMaxTx),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_session_revokeSession_calldata = (sessionId: BigNumberish): DojoCall => {
		return {
			contractName: "session",
			entrypoint: "revoke_session",
			calldata: [sessionId],
		};
	};

	const session_revokeSession = async (snAccount: Account | AccountInterface, sessionId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_session_revokeSession_calldata(sessionId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_session_validateSession_calldata = (sessionId: BigNumberish): DojoCall => {
		return {
			contractName: "session",
			entrypoint: "validate_session",
			calldata: [sessionId],
		};
	};

	const session_validateSession = async (snAccount: Account | AccountInterface, sessionId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_session_validateSession_calldata(sessionId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		AquaAuction: {
			endAuction: AquaAuction_endAuction,
			buildEndAuctionCalldata: build_AquaAuction_endAuction_calldata,
			getActiveAuctions: AquaAuction_getActiveAuctions,
			buildGetActiveAuctionsCalldata: build_AquaAuction_getActiveAuctions_calldata,
			getAuctionById: AquaAuction_getAuctionById,
			buildGetAuctionByIdCalldata: build_AquaAuction_getAuctionById_calldata,
			placeBid: AquaAuction_placeBid,
			buildPlaceBidCalldata: build_AquaAuction_placeBid_calldata,
			startAuction: AquaAuction_startAuction,
			buildStartAuctionCalldata: build_AquaAuction_startAuction_calldata,
		},
		AquaStark: {
			confirmTransaction: AquaStark_confirmTransaction,
			buildConfirmTransactionCalldata: build_AquaStark_confirmTransaction_calldata,
			getAllEventTypes: AquaStark_getAllEventTypes,
			buildGetAllEventTypesCalldata: build_AquaStark_getAllEventTypes_calldata,
			getAquarium: AquaStark_getAquarium,
			buildGetAquariumCalldata: build_AquaStark_getAquarium_calldata,
			getAquariumOwner: AquaStark_getAquariumOwner,
			buildGetAquariumOwnerCalldata: build_AquaStark_getAquariumOwner_calldata,
			getDecoration: AquaStark_getDecoration,
			buildGetDecorationCalldata: build_AquaStark_getDecoration_calldata,
			getDecorationOwner: AquaStark_getDecorationOwner,
			buildGetDecorationOwnerCalldata: build_AquaStark_getDecorationOwner_calldata,
			getEventTypeDetails: AquaStark_getEventTypeDetails,
			buildGetEventTypeDetailsCalldata: build_AquaStark_getEventTypeDetails_calldata,
			getEventTypesCount: AquaStark_getEventTypesCount,
			buildGetEventTypesCountCalldata: build_AquaStark_getEventTypesCount_calldata,
			getFishOwnerForAuction: AquaStark_getFishOwnerForAuction,
			buildGetFishOwnerForAuctionCalldata: build_AquaStark_getFishOwnerForAuction_calldata,
			getPlayer: AquaStark_getPlayer,
			buildGetPlayerCalldata: build_AquaStark_getPlayer_calldata,
			getPlayerAquariumCount: AquaStark_getPlayerAquariumCount,
			buildGetPlayerAquariumCountCalldata: build_AquaStark_getPlayerAquariumCount_calldata,
			getPlayerAquariums: AquaStark_getPlayerAquariums,
			buildGetPlayerAquariumsCalldata: build_AquaStark_getPlayerAquariums_calldata,
			getPlayerDecorationCount: AquaStark_getPlayerDecorationCount,
			buildGetPlayerDecorationCountCalldata: build_AquaStark_getPlayerDecorationCount_calldata,
			getPlayerDecorations: AquaStark_getPlayerDecorations,
			buildGetPlayerDecorationsCalldata: build_AquaStark_getPlayerDecorations_calldata,
			getTransactionCount: AquaStark_getTransactionCount,
			buildGetTransactionCountCalldata: build_AquaStark_getTransactionCount_calldata,
			getTransactionHistory: AquaStark_getTransactionHistory,
			buildGetTransactionHistoryCalldata: build_AquaStark_getTransactionHistory_calldata,
			getTransactionStatus: AquaStark_getTransactionStatus,
			buildGetTransactionStatusCalldata: build_AquaStark_getTransactionStatus_calldata,
			getUsernameFromAddress: AquaStark_getUsernameFromAddress,
			buildGetUsernameFromAddressCalldata: build_AquaStark_getUsernameFromAddress_calldata,
			initiateTransaction: AquaStark_initiateTransaction,
			buildInitiateTransactionCalldata: build_AquaStark_initiateTransaction_calldata,
			isTransactionConfirmed: AquaStark_isTransactionConfirmed,
			buildIsTransactionConfirmedCalldata: build_AquaStark_isTransactionConfirmed_calldata,
			isVerified: AquaStark_isVerified,
			buildIsVerifiedCalldata: build_AquaStark_isVerified_calldata,
			logEvent: AquaStark_logEvent,
			buildLogEventCalldata: build_AquaStark_logEvent_calldata,
			newAquarium: AquaStark_newAquarium,
			buildNewAquariumCalldata: build_AquaStark_newAquarium_calldata,
			newDecoration: AquaStark_newDecoration,
			buildNewDecorationCalldata: build_AquaStark_newDecoration_calldata,
			processTransaction: AquaStark_processTransaction,
			buildProcessTransactionCalldata: build_AquaStark_processTransaction_calldata,
			register: AquaStark_register,
			buildRegisterCalldata: build_AquaStark_register_calldata,
			registerEventType: AquaStark_registerEventType,
			buildRegisterEventTypeCalldata: build_AquaStark_registerEventType_calldata,
		},
		FishSystem: {
			addFishToAquarium: FishSystem_addFishToAquarium,
			buildAddFishToAquariumCalldata: build_FishSystem_addFishToAquarium_calldata,
			breedFishes: FishSystem_breedFishes,
			buildBreedFishesCalldata: build_FishSystem_breedFishes_calldata,
			getFish: FishSystem_getFish,
			buildGetFishCalldata: build_FishSystem_getFish_calldata,
			getFishAncestor: FishSystem_getFishAncestor,
			buildGetFishAncestorCalldata: build_FishSystem_getFishAncestor_calldata,
			getFishFamilyTree: FishSystem_getFishFamilyTree,
			buildGetFishFamilyTreeCalldata: build_FishSystem_getFishFamilyTree_calldata,
			getFishOffspring: FishSystem_getFishOffspring,
			buildGetFishOffspringCalldata: build_FishSystem_getFishOffspring_calldata,
			getFishOwner: FishSystem_getFishOwner,
			buildGetFishOwnerCalldata: build_FishSystem_getFishOwner_calldata,
			getParents: FishSystem_getParents,
			buildGetParentsCalldata: build_FishSystem_getParents_calldata,
			getPlayerFishCount: FishSystem_getPlayerFishCount,
			buildGetPlayerFishCountCalldata: build_FishSystem_getPlayerFishCount_calldata,
			getPlayerFishes: FishSystem_getPlayerFishes,
			buildGetPlayerFishesCalldata: build_FishSystem_getPlayerFishes_calldata,
			listFish: FishSystem_listFish,
			buildListFishCalldata: build_FishSystem_listFish_calldata,
			moveFishToAquarium: FishSystem_moveFishToAquarium,
			buildMoveFishToAquariumCalldata: build_FishSystem_moveFishToAquarium_calldata,
			newFish: FishSystem_newFish,
			buildNewFishCalldata: build_FishSystem_newFish_calldata,
			purchaseFish: FishSystem_purchaseFish,
			buildPurchaseFishCalldata: build_FishSystem_purchaseFish_calldata,
		},
		ShopCatalog: {
			addNewItem: ShopCatalog_addNewItem,
			buildAddNewItemCalldata: build_ShopCatalog_addNewItem_calldata,
			getAllItems: ShopCatalog_getAllItems,
			buildGetAllItemsCalldata: build_ShopCatalog_getAllItems_calldata,
			getItem: ShopCatalog_getItem,
			buildGetItemCalldata: build_ShopCatalog_getItem_calldata,
			updateItem: ShopCatalog_updateItem,
			buildUpdateItemCalldata: build_ShopCatalog_updateItem_calldata,
		},
		Trade: {
			acceptTradeOffer: Trade_acceptTradeOffer,
			buildAcceptTradeOfferCalldata: build_Trade_acceptTradeOffer_calldata,
			cancelTradeOffer: Trade_cancelTradeOffer,
			buildCancelTradeOfferCalldata: build_Trade_cancelTradeOffer_calldata,
			cleanupExpiredOffers: Trade_cleanupExpiredOffers,
			buildCleanupExpiredOffersCalldata: build_Trade_cleanupExpiredOffers_calldata,
			createTradeOffer: Trade_createTradeOffer,
			buildCreateTradeOfferCalldata: build_Trade_createTradeOffer_calldata,
			getActiveTradeOffers: Trade_getActiveTradeOffers,
			buildGetActiveTradeOffersCalldata: build_Trade_getActiveTradeOffers_calldata,
			getAllActiveOffers: Trade_getAllActiveOffers,
			buildGetAllActiveOffersCalldata: build_Trade_getAllActiveOffers_calldata,
			getFishLockStatus: Trade_getFishLockStatus,
			buildGetFishLockStatusCalldata: build_Trade_getFishLockStatus_calldata,
			getOffersForFish: Trade_getOffersForFish,
			buildGetOffersForFishCalldata: build_Trade_getOffersForFish_calldata,
			getTotalTradesCount: Trade_getTotalTradesCount,
			buildGetTotalTradesCountCalldata: build_Trade_getTotalTradesCount_calldata,
			getTradeOffer: Trade_getTradeOffer,
			buildGetTradeOfferCalldata: build_Trade_getTradeOffer_calldata,
			getUserTradeCount: Trade_getUserTradeCount,
			buildGetUserTradeCountCalldata: build_Trade_getUserTradeCount_calldata,
			isFishLocked: Trade_isFishLocked,
			buildIsFishLockedCalldata: build_Trade_isFishLocked_calldata,
		},
		Transaction: {
			confirmTransaction: Transaction_confirmTransaction,
			buildConfirmTransactionCalldata: build_Transaction_confirmTransaction_calldata,
			getAllEventTypes: Transaction_getAllEventTypes,
			buildGetAllEventTypesCalldata: build_Transaction_getAllEventTypes_calldata,
			getEventTypeDetails: Transaction_getEventTypeDetails,
			buildGetEventTypeDetailsCalldata: build_Transaction_getEventTypeDetails_calldata,
			getEventTypesCount: Transaction_getEventTypesCount,
			buildGetEventTypesCountCalldata: build_Transaction_getEventTypesCount_calldata,
			getTransactionCount: Transaction_getTransactionCount,
			buildGetTransactionCountCalldata: build_Transaction_getTransactionCount_calldata,
			getTransactionHistory: Transaction_getTransactionHistory,
			buildGetTransactionHistoryCalldata: build_Transaction_getTransactionHistory_calldata,
			getTransactionStatus: Transaction_getTransactionStatus,
			buildGetTransactionStatusCalldata: build_Transaction_getTransactionStatus_calldata,
			initiateTransaction: Transaction_initiateTransaction,
			buildInitiateTransactionCalldata: build_Transaction_initiateTransaction_calldata,
			isTransactionConfirmed: Transaction_isTransactionConfirmed,
			buildIsTransactionConfirmedCalldata: build_Transaction_isTransactionConfirmed_calldata,
			logEvent: Transaction_logEvent,
			buildLogEventCalldata: build_Transaction_logEvent_calldata,
			processTransaction: Transaction_processTransaction,
			buildProcessTransactionCalldata: build_Transaction_processTransaction_calldata,
			registerEventType: Transaction_registerEventType,
			buildRegisterEventTypeCalldata: build_Transaction_registerEventType_calldata,
		},
		daily_challenge: {
			claimReward: daily_challenge_claimReward,
			buildClaimRewardCalldata: build_daily_challenge_claimReward_calldata,
			completeChallenge: daily_challenge_completeChallenge,
			buildCompleteChallengeCalldata: build_daily_challenge_completeChallenge_calldata,
			createChallenge: daily_challenge_createChallenge,
			buildCreateChallengeCalldata: build_daily_challenge_createChallenge_calldata,
			joinChallenge: daily_challenge_joinChallenge,
			buildJoinChallengeCalldata: build_daily_challenge_joinChallenge_calldata,
		},
		session: {
			calculateRemainingTransactions: session_calculateRemainingTransactions,
			buildCalculateRemainingTransactionsCalldata: build_session_calculateRemainingTransactions_calldata,
			calculateSessionTimeRemaining: session_calculateSessionTimeRemaining,
			buildCalculateSessionTimeRemainingCalldata: build_session_calculateSessionTimeRemaining_calldata,
			checkSessionNeedsRenewal: session_checkSessionNeedsRenewal,
			buildCheckSessionNeedsRenewalCalldata: build_session_checkSessionNeedsRenewal_calldata,
			createSessionKey: session_createSessionKey,
			buildCreateSessionKeyCalldata: build_session_createSessionKey_calldata,
			getSessionInfo: session_getSessionInfo,
			buildGetSessionInfoCalldata: build_session_getSessionInfo_calldata,
			renewSession: session_renewSession,
			buildRenewSessionCalldata: build_session_renewSession_calldata,
			revokeSession: session_revokeSession,
			buildRevokeSessionCalldata: build_session_revokeSession_calldata,
			validateSession: session_validateSession,
			buildValidateSessionCalldata: build_session_validateSession_calldata,
		},
	};
}