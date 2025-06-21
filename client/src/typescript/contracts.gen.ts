import { DojoCall, DojoProvider } from "@dojoengine/core";
import {
  Account,
  AccountInterface,
  BigNumberish,
  CairoCustomEnum,
} from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {
  const build_AquaStark_addDecorationToAquarium_calldata = (
    decoration: models.Decoration,
    aquariumId: BigNumberish
  ): DojoCall => {
    return {
      contractName: "AquaStark",
      entrypoint: "add_decoration_to_aquarium",
      calldata: [decoration, aquariumId],
    };
  };

  const AquaStark_addDecorationToAquarium = async (
    snAccount: Account | AccountInterface,
    decoration: models.Decoration,
    aquariumId: BigNumberish
  ) => {
    try {
      return await provider.execute(
        snAccount,
        build_AquaStark_addDecorationToAquarium_calldata(
          decoration,
          aquariumId
        ),
        "aqua_stark"
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const build_AquaStark_addFishToAquarium_calldata = (
    fish: models.Fish,
    aquariumId: BigNumberish
  ): DojoCall => {
    return {
      contractName: "AquaStark",
      entrypoint: "add_fish_to_aquarium",
      calldata: [fish, aquariumId],
    };
  };

  const AquaStark_addFishToAquarium = async (
    snAccount: Account | AccountInterface,
    fish: models.Fish,
    aquariumId: BigNumberish
  ) => {
    try {
      return await provider.execute(
        snAccount,
        build_AquaStark_addFishToAquarium_calldata(fish, aquariumId),
        "aqua_stark"
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

  const AquaStark_createAquariumId = async (
    snAccount: Account | AccountInterface
  ) => {
    try {
      return await provider.execute(
        snAccount,
        build_AquaStark_createAquariumId_calldata(),
        "aqua_stark"
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

  const AquaStark_createDecorationId = async (
    snAccount: Account | AccountInterface
  ) => {
    try {
      return await provider.execute(
        snAccount,
        build_AquaStark_createDecorationId_calldata(),
        "aqua_stark"
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

  const AquaStark_createFishId = async (
    snAccount: Account | AccountInterface
  ) => {
    try {
      return await provider.execute(
        snAccount,
        build_AquaStark_createFishId_calldata(),
        "aqua_stark"
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

  const AquaStark_createNewPlayerId = async (
    snAccount: Account | AccountInterface
  ) => {
    try {
      return await provider.execute(
        snAccount,
        build_AquaStark_createNewPlayerId_calldata(),
        "aqua_stark"
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

  const AquaStark_getAquarium = async (id: BigNumberish) => {
    try {
      return await provider.call(
        "aqua_stark",
        build_AquaStark_getAquarium_calldata(id)
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const build_AquaStark_getDecoration_calldata = (
    id: BigNumberish
  ): DojoCall => {
    return {
      contractName: "AquaStark",
      entrypoint: "get_decoration",
      calldata: [id],
    };
  };

  const AquaStark_getDecoration = async (id: BigNumberish) => {
    try {
      return await provider.call(
        "aqua_stark",
        build_AquaStark_getDecoration_calldata(id)
      );
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

  const AquaStark_getFish = async (id: BigNumberish) => {
    try {
      return await provider.call(
        "aqua_stark",
        build_AquaStark_getFish_calldata(id)
      );
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
      return await provider.call(
        "aqua_stark",
        build_AquaStark_getPlayer_calldata(address)
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const build_AquaStark_getUsernameFromAddress_calldata = (
    address: string
  ): DojoCall => {
    return {
      contractName: "AquaStark",
      entrypoint: "get_username_from_address",
      calldata: [address],
    };
  };

  const AquaStark_getUsernameFromAddress = async (address: string) => {
    try {
      return await provider.call(
        "aqua_stark",
        build_AquaStark_getUsernameFromAddress_calldata(address)
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const build_AquaStark_newAquarium_calldata = (
    owner: string,
    maxCapacity: BigNumberish
  ): DojoCall => {
    return {
      contractName: "AquaStark",
      entrypoint: "new_aquarium",
      calldata: [owner, maxCapacity],
    };
  };

  const AquaStark_newAquarium = async (
    snAccount: Account | AccountInterface,
    owner: string,
    maxCapacity: BigNumberish
  ) => {
    try {
      return await provider.execute(
        snAccount,
        build_AquaStark_newAquarium_calldata(owner, maxCapacity),
        "aqua_stark"
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const build_AquaStark_newDecoration_calldata = (
    aquariumId: BigNumberish,
    name: BigNumberish,
    description: BigNumberish,
    price: BigNumberish,
    rarity: BigNumberish
  ): DojoCall => {
    return {
      contractName: "AquaStark",
      entrypoint: "new_decoration",
      calldata: [aquariumId, name, description, price, rarity],
    };
  };

  const AquaStark_newDecoration = async (
    snAccount: Account | AccountInterface,
    aquariumId: BigNumberish,
    name: BigNumberish,
    description: BigNumberish,
    price: BigNumberish,
    rarity: BigNumberish
  ) => {
    try {
      return await provider.execute(
        snAccount,
        build_AquaStark_newDecoration_calldata(
          aquariumId,
          name,
          description,
          price,
          rarity
        ),
        "aqua_stark"
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const build_AquaStark_newFish_calldata = (
    owner: string,
    species: CairoCustomEnum
  ): DojoCall => {
    return {
      contractName: "AquaStark",
      entrypoint: "new_fish",
      calldata: [owner, species],
    };
  };

  const AquaStark_newFish = async (
    snAccount: Account | AccountInterface,
    owner: string,
    species: CairoCustomEnum
  ) => {
    try {
      return await provider.execute(
        snAccount,
        build_AquaStark_newFish_calldata(owner, species),
        "aqua_stark"
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const build_AquaStark_register_calldata = (
    username: BigNumberish
  ): DojoCall => {
    return {
      contractName: "AquaStark",
      entrypoint: "register",
      calldata: [username],
    };
  };

  const AquaStark_register = async (
    snAccount: Account | AccountInterface,
    username: BigNumberish
  ) => {
    try {
      return await provider.execute(
        snAccount,
        build_AquaStark_register_calldata(username),
        "aqua_stark"
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    AquaStark: {
      addDecorationToAquarium: AquaStark_addDecorationToAquarium,
      buildAddDecorationToAquariumCalldata:
        build_AquaStark_addDecorationToAquarium_calldata,
      addFishToAquarium: AquaStark_addFishToAquarium,
      buildAddFishToAquariumCalldata:
        build_AquaStark_addFishToAquarium_calldata,
      createAquariumId: AquaStark_createAquariumId,
      buildCreateAquariumIdCalldata: build_AquaStark_createAquariumId_calldata,
      createDecorationId: AquaStark_createDecorationId,
      buildCreateDecorationIdCalldata:
        build_AquaStark_createDecorationId_calldata,
      createFishId: AquaStark_createFishId,
      buildCreateFishIdCalldata: build_AquaStark_createFishId_calldata,
      createNewPlayerId: AquaStark_createNewPlayerId,
      buildCreateNewPlayerIdCalldata:
        build_AquaStark_createNewPlayerId_calldata,
      getAquarium: AquaStark_getAquarium,
      buildGetAquariumCalldata: build_AquaStark_getAquarium_calldata,
      getDecoration: AquaStark_getDecoration,
      buildGetDecorationCalldata: build_AquaStark_getDecoration_calldata,
      getFish: AquaStark_getFish,
      buildGetFishCalldata: build_AquaStark_getFish_calldata,
      getPlayer: AquaStark_getPlayer,
      buildGetPlayerCalldata: build_AquaStark_getPlayer_calldata,
      getUsernameFromAddress: AquaStark_getUsernameFromAddress,
      buildGetUsernameFromAddressCalldata:
        build_AquaStark_getUsernameFromAddress_calldata,
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
