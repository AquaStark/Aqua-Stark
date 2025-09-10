import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoCustomEnum, InvokeFunctionResponse, Result } from "starknet";
import * as models from "./models.gen";

interface AquaStarkModule {
  addDecorationToAquarium(snAccount: Account | AccountInterface, decoration: models.Decoration, aquariumId: BigNumberish): Promise<ExecuteResult>;
  buildAddDecorationToAquariumCalldata(decoration: models.Decoration, aquariumId: BigNumberish): DojoCall;
  addFishToAquarium(snAccount: Account | AccountInterface, fish: models.Fish, aquariumId: BigNumberish): Promise<ExecuteResult>;
  buildAddFishToAquariumCalldata(fish: models.Fish, aquariumId: BigNumberish): DojoCall;
  breedFishes(snAccount: Account | AccountInterface, parent1Id: BigNumberish, parent2Id: BigNumberish): Promise<ExecuteResult>;
  buildBreedFishesCalldata(parent1Id: BigNumberish, parent2Id: BigNumberish): DojoCall;
  createAquariumId(snAccount: Account | AccountInterface): Promise<ExecuteResult>;
  buildCreateAquariumIdCalldata(): DojoCall;
  createDecorationId(snAccount: Account | AccountInterface): Promise<ExecuteResult>;
  buildCreateDecorationIdCalldata(): DojoCall;
  createFishId(snAccount: Account | AccountInterface): Promise<ExecuteResult>;
  buildCreateFishIdCalldata(): DojoCall;
  createNewPlayerId(snAccount: Account | AccountInterface): Promise<ExecuteResult>;
  buildCreateNewPlayerIdCalldata(): DojoCall;
  getAquarium(id: BigNumberish): Promise<CallResult>;
  buildGetAquariumCalldata(id: BigNumberish): DojoCall;
  getAquariumOwner(id: BigNumberish): Promise<CallResult>;
  buildGetAquariumOwnerCalldata(id: BigNumberish): DojoCall;
  getDecoration(id: BigNumberish): Promise<CallResult>;
  buildGetDecorationCalldata(id: BigNumberish): DojoCall;
  getDecorationOwner(id: BigNumberish): Promise<CallResult>;
  buildGetDecorationOwnerCalldata(id: BigNumberish): DojoCall;
  getFish(id: BigNumberish): Promise<CallResult>;
  buildGetFishCalldata(id: BigNumberish): DojoCall;
  getFishAncestor(fishId: BigNumberish, generation: BigNumberish): Promise<CallResult>;
  buildGetFishAncestorCalldata(fishId: BigNumberish, generation: BigNumberish): DojoCall;
  getFishFamilyTree(fishId: BigNumberish): Promise<CallResult>;
  buildGetFishFamilyTreeCalldata(fishId: BigNumberish): DojoCall;
  getFishOffspring(fishId: BigNumberish): Promise<CallResult>;
  buildGetFishOffspringCalldata(fishId: BigNumberish): DojoCall;
  getFishOwner(id: BigNumberish): Promise<CallResult>;
  buildGetFishOwnerCalldata(id: BigNumberish): DojoCall;
  getParents(fishId: BigNumberish): Promise<CallResult>;
  buildGetParentsCalldata(fishId: BigNumberish): DojoCall;
  getPlayer(address: string): Promise<CallResult>;
  buildGetPlayerCalldata(address: string): DojoCall;
  getPlayerAquariumCount(player: string): Promise<CallResult>;
  buildGetPlayerAquariumCountCalldata(player: string): DojoCall;
  getPlayerAquariums(player: string): Promise<CallResult>;
  buildGetPlayerAquariumsCalldata(player: string): DojoCall;
  getPlayerDecorationCount(player: string): Promise<CallResult>;
  buildGetPlayerDecorationCountCalldata(player: string): DojoCall;
  getPlayerDecorations(player: string): Promise<CallResult>;
  buildGetPlayerDecorationsCalldata(player: string): DojoCall;
  getPlayerFishCount(player: string): Promise<CallResult>;
  buildGetPlayerFishCountCalldata(player: string): DojoCall;
  getPlayerFishes(player: string): Promise<CallResult>;
  buildGetPlayerFishesCalldata(player: string): DojoCall;
  getUsernameFromAddress(address: string): Promise<CallResult>;
  buildGetUsernameFromAddressCalldata(address: string): DojoCall;
  isVerified(player: string): Promise<CallResult>;
  buildIsVerifiedCalldata(player: string): DojoCall;
  moveDecorationToAquarium(snAccount: Account | AccountInterface, decorationId: BigNumberish, from: BigNumberish, to: BigNumberish): Promise<ExecuteResult>;
  buildMoveDecorationToAquariumCalldata(decorationId: BigNumberish, from: BigNumberish, to: BigNumberish): DojoCall;
  moveFishToAquarium(snAccount: Account | AccountInterface, fishId: BigNumberish, from: BigNumberish, to: BigNumberish): Promise<ExecuteResult>;
  buildMoveFishToAquariumCalldata(fishId: BigNumberish, from: BigNumberish, to: BigNumberish): DojoCall;
  newAquarium(snAccount: Account | AccountInterface, owner: string, maxCapacity: BigNumberish, maxDecorations: BigNumberish): Promise<ExecuteResult>;
  buildNewAquariumCalldata(owner: string, maxCapacity: BigNumberish, maxDecorations: BigNumberish): DojoCall;
  newDecoration(snAccount: Account | AccountInterface, aquariumId: BigNumberish, name: BigNumberish, description: BigNumberish, price: BigNumberish, rarity: BigNumberish): Promise<ExecuteResult>;
  buildNewDecorationCalldata(aquariumId: BigNumberish, name: BigNumberish, description: BigNumberish, price: BigNumberish, rarity: BigNumberish): DojoCall;
  newFish(snAccount: Account | AccountInterface, aquariumId: BigNumberish, species: CairoCustomEnum): Promise<ExecuteResult>;
  buildNewFishCalldata(aquariumId: BigNumberish, species: CairoCustomEnum): DojoCall;
  register(snAccount: Account | AccountInterface, username: BigNumberish): Promise<ExecuteResult>;
  buildRegisterCalldata(username: BigNumberish): DojoCall;
}

// Type definitions
export type Signer = Account | AccountInterface;
export type ExecuteResult = InvokeFunctionResponse;
export type CallResult = Result;

// Error typing
export interface ContractError {
  message: string;
  code?: string;
  details?: unknown;
}

export type ExecuteResultWithError = ExecuteResult | { error: ContractError };
export type CallResultWithError = CallResult | { error: ContractError };

const NAMESPACE = "aqua_stark" as const;

export function setupWorld(provider: DojoProvider): { AquaStark: AquaStarkModule } {

	const build_AquaStark_addDecorationToAquarium_calldata = (decoration: models.Decoration, aquariumId: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "add_decoration_to_aquarium",
			calldata: [decoration, aquariumId],
		};
	};

	const AquaStark_addDecorationToAquarium = async (snAccount: Account | AccountInterface, decoration: models.Decoration, aquariumId: BigNumberish) : Promise<ExecuteResult> => {
		return provider.execute(
				snAccount,
				build_AquaStark_addDecorationToAquarium_calldata(decoration, aquariumId),
				NAMESPACE,
			);
	};

	const build_AquaStark_addFishToAquarium_calldata = (fish: models.Fish, aquariumId: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "add_fish_to_aquarium",
			calldata: [fish, aquariumId],
		};
	};

	const AquaStark_addFishToAquarium = async (snAccount: Account | AccountInterface, fish: models.Fish, aquariumId: BigNumberish) : Promise<ExecuteResult> => {
		return provider.execute(
				snAccount,
				build_AquaStark_addFishToAquarium_calldata(fish, aquariumId),
				NAMESPACE,
			);
	};

	const build_AquaStark_breedFishes_calldata = (parent1Id: BigNumberish, parent2Id: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE,
			entrypoint: "breed_fishes",
			calldata: [parent1Id, parent2Id],
		};
	};

	const AquaStark_breedFishes = async (snAccount: Account | AccountInterface, parent1Id: BigNumberish, parent2Id: BigNumberish) : Promise<ExecuteResult> => {
		return provider.execute(
				snAccount,
				build_AquaStark_breedFishes_calldata(parent1Id, parent2Id),
				NAMESPACE,
			);
	};

	const build_AquaStark_createAquariumId_calldata = (): DojoCall => {
		return {
			contractName: NAMESPACE,
			entrypoint: "create_aquarium_id",
			calldata: [],
		};
	};

	const AquaStark_createAquariumId = async (snAccount: Account | AccountInterface) : Promise<ExecuteResult> => {
		return provider.execute(
				snAccount,
				build_AquaStark_createAquariumId_calldata(),
				NAMESPACE,
			);
	};

	const build_AquaStark_createDecorationId_calldata = (): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "create_decoration_id",
			calldata: [],
		};
	};

	const AquaStark_createDecorationId = async (snAccount: Account | AccountInterface) : Promise<ExecuteResult> => {
		return provider.execute(
				snAccount,
				build_AquaStark_createDecorationId_calldata(),
				NAMESPACE,
			);
	};

	const build_AquaStark_createFishId_calldata = (): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "create_fish_id",
			calldata: [],
		};
	};

	const AquaStark_createFishId = async (snAccount: Account | AccountInterface) : Promise<ExecuteResult> => {
		return provider.execute(
				snAccount,
				build_AquaStark_createFishId_calldata(),
				NAMESPACE,
			);
	};

	const build_AquaStark_createNewPlayerId_calldata = (): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "create_new_player_id",
			calldata: [],
		};
	};

	const AquaStark_createNewPlayerId = async (snAccount: Account | AccountInterface) : Promise<ExecuteResult> => {
		return provider.execute(
				snAccount,
				build_AquaStark_createNewPlayerId_calldata(),
				NAMESPACE,
			);
	};

	const build_AquaStark_getAquarium_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_aquarium",
			calldata: [id],
		};
	};

	const AquaStark_getAquarium = async (id: BigNumberish) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getAquarium_calldata(id));
	};

	const build_AquaStark_getAquariumOwner_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_aquarium_owner",
			calldata: [id],
		};
	};

	const AquaStark_getAquariumOwner = async (id: BigNumberish) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getAquariumOwner_calldata(id));
	};

	const build_AquaStark_getDecoration_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_decoration",
			calldata: [id],
		};
	};

	const AquaStark_getDecoration = async (id: BigNumberish) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getDecoration_calldata(id));
	};

	const build_AquaStark_getDecorationOwner_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_decoration_owner",
			calldata: [id],
		};
	};

	const AquaStark_getDecorationOwner = async (id: BigNumberish) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getDecorationOwner_calldata(id));
	};

	const build_AquaStark_getFish_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_fish",
			calldata: [id],
		};
	};

	const AquaStark_getFish = async (id: BigNumberish) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getFish_calldata(id));
	};

	const build_AquaStark_getFishAncestor_calldata = (fishId: BigNumberish, generation: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_fish_ancestor",
			calldata: [fishId, generation],
		};
	};

	const AquaStark_getFishAncestor = async (fishId: BigNumberish, generation: BigNumberish) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getFishAncestor_calldata(fishId, generation));
	};

	const build_AquaStark_getFishFamilyTree_calldata = (fishId: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE,
			entrypoint: "get_fish_family_tree",
			calldata: [fishId],
		};
	};

	const AquaStark_getFishFamilyTree = async (fishId: BigNumberish) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getFishFamilyTree_calldata(fishId));
	};

	const build_AquaStark_getFishOffspring_calldata = (fishId: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_fish_offspring",
			calldata: [fishId],
		};
	};

	const AquaStark_getFishOffspring = async (fishId: BigNumberish) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getFishOffspring_calldata(fishId));
	};

	const build_AquaStark_getFishOwner_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_fish_owner",
			calldata: [id],
		};
	};

	const AquaStark_getFishOwner = async (id: BigNumberish) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getFishOwner_calldata(id));
	};

	const build_AquaStark_getParents_calldata = (fishId: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_parents",
			calldata: [fishId],
		};
	};

	const AquaStark_getParents = async (fishId: BigNumberish) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getParents_calldata(fishId));
	};

	const build_AquaStark_getPlayer_calldata = (address: string): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_player",
			calldata: [address],
		};
	};

	const AquaStark_getPlayer = async (address: string) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getPlayer_calldata(address));
	};

	const build_AquaStark_getPlayerAquariumCount_calldata = (player: string): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_player_aquarium_count",
			calldata: [player],
		};
	};

	const AquaStark_getPlayerAquariumCount = async (player: string) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getPlayerAquariumCount_calldata(player));
	};

	const build_AquaStark_getPlayerAquariums_calldata = (player: string): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_player_aquariums",
			calldata: [player],
		};
	};

	const AquaStark_getPlayerAquariums = async (player: string) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getPlayerAquariums_calldata(player));
	};

	const build_AquaStark_getPlayerDecorationCount_calldata = (player: string): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_player_decoration_count",
			calldata: [player],
		};
	};

	const AquaStark_getPlayerDecorationCount = async (player: string) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getPlayerDecorationCount_calldata(player));
	};

	const build_AquaStark_getPlayerDecorations_calldata = (player: string): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_player_decorations",
			calldata: [player],
		};
	};

	const AquaStark_getPlayerDecorations = async (player: string) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getPlayerDecorations_calldata(player));
	};

	const build_AquaStark_getPlayerFishCount_calldata = (player: string): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_player_fish_count",
			calldata: [player],
		};
	};

	const AquaStark_getPlayerFishCount = async (player: string) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getPlayerFishCount_calldata(player));
	};

	const build_AquaStark_getPlayerFishes_calldata = (player: string): DojoCall => {
		return {
			contractName: NAMESPACE,
			entrypoint: "get_player_fishes",
			calldata: [player],
		};
	};

	const AquaStark_getPlayerFishes = async (player: string) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getPlayerFishes_calldata(player));
	};

	const build_AquaStark_getUsernameFromAddress_calldata = (address: string): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "get_username_from_address",
			calldata: [address],
		};
	};

	const AquaStark_getUsernameFromAddress = async (address: string) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_getUsernameFromAddress_calldata(address));
	};

	const build_AquaStark_isVerified_calldata = (player: string): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "is_verified",
			calldata: [player],
		};
	};

	const AquaStark_isVerified = async (player: string) : Promise<CallResult> => {
		return provider.call(NAMESPACE, build_AquaStark_isVerified_calldata(player));
	};

	const build_AquaStark_moveDecorationToAquarium_calldata = (decorationId: BigNumberish, from: BigNumberish, to: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "move_decoration_to_aquarium",
			calldata: [decorationId, from, to],
		};
	};

	const AquaStark_moveDecorationToAquarium = async (snAccount: Account | AccountInterface, decorationId: BigNumberish, from: BigNumberish, to: BigNumberish) : Promise<ExecuteResult> => {
		return provider.execute(
				snAccount,
				build_AquaStark_moveDecorationToAquarium_calldata(decorationId, from, to),
				NAMESPACE,
			);
	};

	const build_AquaStark_moveFishToAquarium_calldata = (fishId: BigNumberish, from: BigNumberish, to: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "move_fish_to_aquarium",
			calldata: [fishId, from, to],
		};
	};

	const AquaStark_moveFishToAquarium = async (snAccount: Account | AccountInterface, fishId: BigNumberish, from: BigNumberish, to: BigNumberish) : Promise<ExecuteResult> => {
		return provider.execute(
				snAccount,
				build_AquaStark_moveFishToAquarium_calldata(fishId, from, to),
				NAMESPACE,
			);
	};

	const build_AquaStark_newAquarium_calldata = (owner: string, maxCapacity: BigNumberish, maxDecorations: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "new_aquarium",
			calldata: [owner, maxCapacity, maxDecorations],
		};
	};

	const AquaStark_newAquarium = async (snAccount: Account | AccountInterface, owner: string, maxCapacity: BigNumberish, maxDecorations: BigNumberish) : Promise<ExecuteResult> => {
		return provider.execute(
				snAccount,
				build_AquaStark_newAquarium_calldata(owner, maxCapacity, maxDecorations),
				NAMESPACE,
			);
	};

	const build_AquaStark_newDecoration_calldata = (aquariumId: BigNumberish, name: BigNumberish, description: BigNumberish, price: BigNumberish, rarity: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "new_decoration",
			calldata: [aquariumId, name, description, price, rarity],
		};
	};

	const AquaStark_newDecoration = async (snAccount: Account | AccountInterface, aquariumId: BigNumberish, name: BigNumberish, description: BigNumberish, price: BigNumberish, rarity: BigNumberish) : Promise<ExecuteResult> => {
		return provider.execute(
				snAccount,
				build_AquaStark_newDecoration_calldata(aquariumId, name, description, price, rarity),
				NAMESPACE,
			);
	};

	const build_AquaStark_newFish_calldata = (aquariumId: BigNumberish, species: CairoCustomEnum): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "new_fish",
			calldata: [aquariumId, species],
		};
	};

	const AquaStark_newFish = async (snAccount: Account | AccountInterface, aquariumId: BigNumberish, species: CairoCustomEnum) : Promise<ExecuteResult> => {
		return provider.execute(
				snAccount,
				build_AquaStark_newFish_calldata(aquariumId, species),
				NAMESPACE,
			);
	};

	const build_AquaStark_register_calldata = (username: BigNumberish): DojoCall => {
		return {
			contractName: NAMESPACE, 
			entrypoint: "register",
			calldata: [username],
		};
	};

	const AquaStark_register = async (snAccount: Account | AccountInterface, username: BigNumberish) : Promise<ExecuteResult> => {
		return provider.execute(
				snAccount,
				build_AquaStark_register_calldata(username),
				NAMESPACE,
			);
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
export interface WorldBindings extends Awaited<ReturnType<typeof setupWorld>> {}