import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoCustomEnum, InvokeFunctionResponse, Result } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_AquaStark_addDecorationToAquarium_calldata = (decoration: models.Decoration, aquariumId: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "add_decoration_to_aquarium",
			calldata: [decoration, aquariumId],
		};
	};

	const AquaStark_addDecorationToAquarium = async (snAccount: Account | AccountInterface, decoration: models.Decoration, aquariumId: BigNumberish) : Promise<InvokeFunctionResponse> => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_addDecorationToAquarium_calldata(decoration, aquariumId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_addFishToAquarium_calldata = (fish: models.Fish, aquariumId: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "add_fish_to_aquarium",
			calldata: [fish, aquariumId],
		};
	};

	const AquaStark_addFishToAquarium = async (snAccount: Account | AccountInterface, fish: models.Fish, aquariumId: BigNumberish) : Promise<InvokeFunctionResponse> => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_addFishToAquarium_calldata(fish, aquariumId),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_breedFishes_calldata = (parent1Id: BigNumberish, parent2Id: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "breed_fishes",
			calldata: [parent1Id, parent2Id],
		};
	};

	const AquaStark_breedFishes = async (snAccount: Account | AccountInterface, parent1Id: BigNumberish, parent2Id: BigNumberish) : Promise<InvokeFunctionResponse> => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_breedFishes_calldata(parent1Id, parent2Id),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_createAquariumId_calldata = (): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "create_aquarium_id",
			calldata: [],
		};
	};

	const AquaStark_createAquariumId = async (snAccount: Account | AccountInterface) : Promise<InvokeFunctionResponse> => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_createAquariumId_calldata(),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_createDecorationId_calldata = (): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "create_decoration_id",
			calldata: [],
		};
	};

	const AquaStark_createDecorationId = async (snAccount: Account | AccountInterface) : Promise<InvokeFunctionResponse> => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_createDecorationId_calldata(),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_createFishId_calldata = (): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "create_fish_id",
			calldata: [],
		};
	};

	const AquaStark_createFishId = async (snAccount: Account | AccountInterface) : Promise<InvokeFunctionResponse> => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_createFishId_calldata(),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_createNewPlayerId_calldata = (): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "create_new_player_id",
			calldata: [],
		};
	};

	const AquaStark_createNewPlayerId = async (snAccount: Account | AccountInterface) : Promise<InvokeFunctionResponse> => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_createNewPlayerId_calldata(),
				"aqua_stark",
			);
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

	const AquaStark_getAquarium = async (id: BigNumberish) : Promise<Result> => {
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

	const AquaStark_getAquariumOwner = async (id: BigNumberish) : Promise<Result> => {
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

	const AquaStark_getDecoration = async (id: BigNumberish) : Promise<Result> => {
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

	const AquaStark_getDecorationOwner = async (id: BigNumberish) : Promise<Result> => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getDecorationOwner_calldata(id));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getFish_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_fish",
			calldata: [id],
		};
	};

	const AquaStark_getFish = async (id: BigNumberish) : Promise<Result> => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getFish_calldata(id));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getFishAncestor_calldata = (fishId: BigNumberish, generation: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_fish_ancestor",
			calldata: [fishId, generation],
		};
	};

	const AquaStark_getFishAncestor = async (fishId: BigNumberish, generation: BigNumberish) : Promise<Result> => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getFishAncestor_calldata(fishId, generation));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getFishFamilyTree_calldata = (fishId: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_fish_family_tree",
			calldata: [fishId],
		};
	};

	const AquaStark_getFishFamilyTree = async (fishId: BigNumberish) : Promise<Result> => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getFishFamilyTree_calldata(fishId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getFishOffspring_calldata = (fishId: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_fish_offspring",
			calldata: [fishId],
		};
	};

	const AquaStark_getFishOffspring = async (fishId: BigNumberish) : Promise<Result> => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getFishOffspring_calldata(fishId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getFishOwner_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_fish_owner",
			calldata: [id],
		};
	};

	const AquaStark_getFishOwner = async (id: BigNumberish) : Promise<Result> => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getFishOwner_calldata(id));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getParents_calldata = (fishId: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_parents",
			calldata: [fishId],
		};
	};

	const AquaStark_getParents = async (fishId: BigNumberish) : Promise<Result> => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getParents_calldata(fishId));
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

	const AquaStark_getPlayer = async (address: string) : Promise<Result> => {
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

	const AquaStark_getPlayerAquariumCount = async (player: string) : Promise<Result> => {
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

	const AquaStark_getPlayerAquariums = async (player: string) : Promise<Result> => {
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

	const AquaStark_getPlayerDecorationCount = async (player: string) : Promise<Result> => {
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

	const AquaStark_getPlayerDecorations = async (player: string) : Promise<Result> => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getPlayerDecorations_calldata(player));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getPlayerFishCount_calldata = (player: string): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_player_fish_count",
			calldata: [player],
		};
	};

	const AquaStark_getPlayerFishCount = async (player: string) : Promise<Result> => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getPlayerFishCount_calldata(player));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_getPlayerFishes_calldata = (player: string): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "get_player_fishes",
			calldata: [player],
		};
	};

	const AquaStark_getPlayerFishes = async (player: string) : Promise<Result> => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getPlayerFishes_calldata(player));
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

	const AquaStark_getUsernameFromAddress = async (address: string) : Promise<Result> => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_getUsernameFromAddress_calldata(address));
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

	const AquaStark_isVerified = async (player: string) : Promise<Result> => {
		try {
			return await provider.call("aqua_stark", build_AquaStark_isVerified_calldata(player));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_moveDecorationToAquarium_calldata = (decorationId: BigNumberish, from: BigNumberish, to: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "move_decoration_to_aquarium",
			calldata: [decorationId, from, to],
		};
	};

	const AquaStark_moveDecorationToAquarium = async (snAccount: Account | AccountInterface, decorationId: BigNumberish, from: BigNumberish, to: BigNumberish) : Promise<InvokeFunctionResponse> => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_moveDecorationToAquarium_calldata(decorationId, from, to),
				"aqua_stark",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_AquaStark_moveFishToAquarium_calldata = (fishId: BigNumberish, from: BigNumberish, to: BigNumberish): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "move_fish_to_aquarium",
			calldata: [fishId, from, to],
		};
	};

	const AquaStark_moveFishToAquarium = async (snAccount: Account | AccountInterface, fishId: BigNumberish, from: BigNumberish, to: BigNumberish) : Promise<InvokeFunctionResponse> => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_moveFishToAquarium_calldata(fishId, from, to),
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

	const AquaStark_newAquarium = async (snAccount: Account | AccountInterface, owner: string, maxCapacity: BigNumberish, maxDecorations: BigNumberish) : Promise<InvokeFunctionResponse> => {
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

	const AquaStark_newDecoration = async (snAccount: Account | AccountInterface, aquariumId: BigNumberish, name: BigNumberish, description: BigNumberish, price: BigNumberish, rarity: BigNumberish) : Promise<InvokeFunctionResponse> => {
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

	const build_AquaStark_newFish_calldata = (aquariumId: BigNumberish, species: CairoCustomEnum): DojoCall => {
		return {
			contractName: "AquaStark",
			entrypoint: "new_fish",
			calldata: [aquariumId, species],
		};
	};

	const AquaStark_newFish = async (snAccount: Account | AccountInterface, aquariumId: BigNumberish, species: CairoCustomEnum) : Promise<InvokeFunctionResponse> => {
		try {
			return await provider.execute(
				snAccount,
				build_AquaStark_newFish_calldata(aquariumId, species),
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

	const AquaStark_register = async (snAccount: Account | AccountInterface, username: BigNumberish) : Promise<InvokeFunctionResponse> => {
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



	return {
		AquaStark: {
			addDecorationToAquarium: AquaStark_addDecorationToAquarium,
			buildAddDecorationToAquariumCalldata: build_AquaStark_addDecorationToAquarium_calldata,
			addFishToAquarium: AquaStark_addFishToAquarium,
			buildAddFishToAquariumCalldata: build_AquaStark_addFishToAquarium_calldata,
			breedFishes: AquaStark_breedFishes,
			buildBreedFishesCalldata: build_AquaStark_breedFishes_calldata,
			createAquariumId: AquaStark_createAquariumId,
			buildCreateAquariumIdCalldata: build_AquaStark_createAquariumId_calldata,
			createDecorationId: AquaStark_createDecorationId,
			buildCreateDecorationIdCalldata: build_AquaStark_createDecorationId_calldata,
			createFishId: AquaStark_createFishId,
			buildCreateFishIdCalldata: build_AquaStark_createFishId_calldata,
			createNewPlayerId: AquaStark_createNewPlayerId,
			buildCreateNewPlayerIdCalldata: build_AquaStark_createNewPlayerId_calldata,
			getAquarium: AquaStark_getAquarium,
			buildGetAquariumCalldata: build_AquaStark_getAquarium_calldata,
			getAquariumOwner: AquaStark_getAquariumOwner,
			buildGetAquariumOwnerCalldata: build_AquaStark_getAquariumOwner_calldata,
			getDecoration: AquaStark_getDecoration,
			buildGetDecorationCalldata: build_AquaStark_getDecoration_calldata,
			getDecorationOwner: AquaStark_getDecorationOwner,
			buildGetDecorationOwnerCalldata: build_AquaStark_getDecorationOwner_calldata,
			getFish: AquaStark_getFish,
			buildGetFishCalldata: build_AquaStark_getFish_calldata,
			getFishAncestor: AquaStark_getFishAncestor,
			buildGetFishAncestorCalldata: build_AquaStark_getFishAncestor_calldata,
			getFishFamilyTree: AquaStark_getFishFamilyTree,
			buildGetFishFamilyTreeCalldata: build_AquaStark_getFishFamilyTree_calldata,
			getFishOffspring: AquaStark_getFishOffspring,
			buildGetFishOffspringCalldata: build_AquaStark_getFishOffspring_calldata,
			getFishOwner: AquaStark_getFishOwner,
			buildGetFishOwnerCalldata: build_AquaStark_getFishOwner_calldata,
			getParents: AquaStark_getParents,
			buildGetParentsCalldata: build_AquaStark_getParents_calldata,
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
			getPlayerFishCount: AquaStark_getPlayerFishCount,
			buildGetPlayerFishCountCalldata: build_AquaStark_getPlayerFishCount_calldata,
			getPlayerFishes: AquaStark_getPlayerFishes,
			buildGetPlayerFishesCalldata: build_AquaStark_getPlayerFishes_calldata,
			getUsernameFromAddress: AquaStark_getUsernameFromAddress,
			buildGetUsernameFromAddressCalldata: build_AquaStark_getUsernameFromAddress_calldata,
			isVerified: AquaStark_isVerified,
			buildIsVerifiedCalldata: build_AquaStark_isVerified_calldata,
			moveDecorationToAquarium: AquaStark_moveDecorationToAquarium,
			buildMoveDecorationToAquariumCalldata: build_AquaStark_moveDecorationToAquarium_calldata,
			moveFishToAquarium: AquaStark_moveFishToAquarium,
			buildMoveFishToAquariumCalldata: build_AquaStark_moveFishToAquarium_calldata,
			newAquarium: AquaStark_newAquarium,
			buildNewAquariumCalldata: build_AquaStark_newAquarium_calldata,
			newDecoration: AquaStark_newDecoration,
			buildNewDecorationCalldata: build_AquaStark_newDecoration_calldata,
			newFish: AquaStark_newFish,
			buildNewFishCalldata: build_AquaStark_newFish_calldata,
			register: AquaStark_register,
			buildRegisterCalldata: build_AquaStark_register_calldata,
		},
	};
}