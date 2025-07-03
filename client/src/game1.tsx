using this fomat that works perfectly,
import { stringToFelt } from "@/utils/starknet";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { CairoCustomEnum } from "starknet";
import { useAquarium } from "./hooks/dojo/useAquarium";
import { useDecoration } from "./hooks/dojo/useDecoration";
import { useFish } from "./hooks/dojo/useFish";
import { usePlayer } from "./hooks/dojo/usePlayer";

export const Game = () => {
  const { registerPlayer, getPlayer } = usePlayer();
  const { getAquarium, newAquarium } = useAquarium();
  const { getDecoration, newDecoration } = useDecoration();
  const { getFish, newFish } = useFish();
  const { account } = useAccount();

  // Inputs state
  const [username, setUsername] = useState("test_player");
  const [playerAddress, setPlayerAddress] = useState("");
  const [aquariumId, setAquariumId] = useState("1");
  const [maxCapacity, setMaxCapacity] = useState("10");
  const [maxDecorations, setMaxDecorations] = useState("10");
  const [decorationId, setDecorationId] = useState("1");
  const [decorationName, setDecorationName] = useState("decoration");
  const [decorationDesc, setDecorationDesc] = useState("a cool decoration");
  const [decorationPrice, setDecorationPrice] = useState("100");
  const [decorationRarity, setDecorationRarity] = useState("1");
  const [fishId, setFishId] = useState("1");
  const [fishSpecies, setFishSpecies] = useState("GoldFish");

  // UI state
  const [response, setResponse] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async <T,>(request: () => Promise<T>, name: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await request();
      console.log(`${name} result`, result);
      setResponse(result as object);
    } catch (err: unknown) {
      console.error(`${name} error`, err);
      const feltError = /revert with "([^"]+)"/;
      if (err instanceof Error) {
        const match = err.message.match(feltError);
        setError(
          match ? match[1] : err.message || "An unknown error occurred."
        );
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPlayer = async () => {
    if (!account) return;
    handleRequest(() => registerPlayer(account, username), "registerPlayer");
  };

  const handleGetPlayer = async () => {
    if (!account) return;
    handleRequest(
      () => getPlayer(playerAddress || account.address),
      "getPlayer"
    );
  };

  const handleNewAquarium = async () => {
    if (!account) return;
    handleRequest(
      () => newAquarium(account, account.address, parseInt(maxCapacity)),
      "newAquarium"
    );
  };

  const handleGetAquarium = async () => {
    handleRequest(() => getAquarium(parseInt(aquariumId)), "getAquarium");
  };

  const handleNewDecoration = async () => {
    if (!account) return;
    const nameFelt = stringToFelt(decorationName);
    if (Array.isArray(nameFelt)) {
      setError("Decoration name is too long.");
      return;
    }
    const descFelt = stringToFelt(decorationDesc);
    if (Array.isArray(descFelt)) {
      setError("Decoration description is too long.");
      return;
    }
    handleRequest(
      () =>
        newDecoration(
          account,
          parseInt(aquariumId),
          nameFelt,
          descFelt,
          parseInt(decorationPrice),
          parseInt(decorationRarity)
        ),
      "newDecoration"
    );
  };

  const handleGetDecoration = async () => {
    handleRequest(() => getDecoration(parseInt(decorationId)), "getDecoration");
  };

  const handleNewFish = async () => {
    if (!account) return;
    const species = new CairoCustomEnum({ [fishSpecies]: {} });
    handleRequest(() => newFish(account, account.address, species), "newFish");
  };

  const handleGetFish = async () => {
    handleRequest(() => getFish(parseInt(fishId)), "getFish");
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-900 text-gray-200 p-8 font-mono">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">
        AquaStark Dev Console
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls Column */}
        <div className="flex flex-col gap-6">
          {/* Player Section */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-300">Player</h2>
            <div className="flex flex-col gap-3">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors"
                onClick={handleRegisterPlayer}
                disabled={loading}
              >
                Register Player
              </button>
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500"
                placeholder="Player Address (defaults to connected)"
                value={playerAddress}
                onChange={(e) => setPlayerAddress(e.target.value)}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors"
                onClick={handleGetPlayer}
                disabled={loading}
              >
                Get Player
              </button>
            </div>
          </div>

          {/* Aquarium Section */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-green-300">Aquarium</h2>
            <div className="flex flex-col gap-3">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500"
                placeholder="Max Capacity"
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
              />
                <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500"
                placeholder="Max Decorations"
                type="number"
                value={maxDecorations}
                onChange={(e) => setMaxDecorations(e.target.value)}
              />
              <button
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors"
                onClick={handleNewAquarium}
                disabled={loading}
              >
                New Aquarium
              </button>
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500"
                placeholder="Aquarium ID"
                type="number"
                value={aquariumId}
                onChange={(e) => setAquariumId(e.target.value)}
              />
              <button
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors"
                onClick={handleGetAquarium}
                disabled={loading}
              >
                Get Aquarium
              </button>
            </div>
          </div>

          {/* Decoration Section */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-yellow-300">
              Decoration
            </h2>
            <div className="flex flex-col gap-3">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500"
                placeholder="Name"
                value={decorationName}
                onChange={(e) => setDecorationName(e.target.value)}
              />
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500"
                placeholder="Description"
                value={decorationDesc}
                onChange={(e) => setDecorationDesc(e.target.value)}
              />
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500"
                placeholder="Price"
                type="number"
                value={decorationPrice}
                onChange={(e) => setDecorationPrice(e.target.value)}
              />
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500"
                placeholder="Rarity"
                type="number"
                value={decorationRarity}
                onChange={(e) => setDecorationRarity(e.target.value)}
              />
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-md transition-colors"
                onClick={handleNewDecoration}
                disabled={loading}
              >
                New Decoration
              </button>
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500"
                placeholder="Decoration ID"
                type="number"
                value={decorationId}
                onChange={(e) => setDecorationId(e.target.value)}
              />
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-md transition-colors"
                onClick={handleGetDecoration}
                disabled={loading}
              >
                Get Decoration
              </button>
            </div>
          </div>

          {/* Fish Section */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-red-300">Fish</h2>
            <div className="flex flex-col gap-3">
              <select
                className="bg-gray-700 p-2 rounded-md"
                value={fishSpecies}
                onChange={(e) => setFishSpecies(e.target.value)}
                title="Fish Species"
              >
                <option>GoldFish</option>
                <option>AngelFish</option>
                <option>Betta</option>
                <option>NeonTetra</option>
                <option>Corydoras</option>
              </select>
              <button
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                onClick={handleNewFish}
                disabled={loading}
              >
                New Fish
              </button>
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500"
                placeholder="Fish ID"
                type="number"
                value={fishId}
                onChange={(e) => setFishId(e.target.value)}
              />
              <button
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                onClick={handleGetFish}
                disabled={loading}
              >
                Get Fish
              </button>
            </div>
          </div>
        </div>

        {/* Response Column */}
        <div className="bg-gray-800 p-4 rounded-lg sticky top-8 h-fit">
          <h2 className="text-xl font-bold mb-4 text-gray-300">Response</h2>
          <div className="bg-gray-900 p-4 rounded-md min-h-[100px] max-h-[70vh] overflow-y-auto">
            {loading && <p className="text-blue-400">Loading...</p>}
            {error && (
              <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
            )}
            {response && (
              <pre className="text-green-400 whitespace-pre-wrap">
                {JSON.stringify(
                  response,
                  (key, value) =>
                    typeof value === "bigint" ? value.toString() : 
                  value,
                  2
                )}
              </pre>
            )}
            {!loading && !error && !response && (
              <p className="text-gray-500">Responses will be shown here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

fix this
import { stringToFelt } from "@/utils/starknet";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { CairoCustomEnum } from "starknet";
import { useAquarium } from "./hooks/dojo/useAquarium";
import { useDecoration } from "./hooks/dojo/useDecoration";
import { useFish } from "./hooks/dojo/useFish";
import { usePlayer } from "./hooks/dojo/usePlayer";

export const Game = () => {
  const { registerPlayer, getPlayer, getUsernameFromAddress, createNewPlayerId, isVerified } = usePlayer();
  const {
    getAquarium,
    newAquarium,
    addFishToAquarium,
    addDecorationToAquarium,
    getPlayerAquariums,
    getPlayerAquariumCount,
  } = useAquarium();
  const {
    getDecoration,
    newDecoration,
    getPlayerDecorations,
    getPlayerDecorationCount,
  } = useDecoration();
  const {
    getFish,
    newFish,
    getPlayerFishes,
    getPlayerFishCount,
  } = useFish();
  
  const { account } = useAccount();

  // Inputs state for Player
  const [username, setUsername] = useState("test_player");
  const [playerAddress, setPlayerAddress] = useState("");

  // Inputs state for Aquarium
  const [aquariumId, setAquariumId] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("10");
  const [aquariumPlayerAddress, setAquariumPlayerAddress] = useState("");

  // Inputs state for Decoration
  const [decorationId, setDecorationId] = useState("");
  const [decorationName, setDecorationName] = useState("decoration");
  const [decorationDesc, setDecorationDesc] = useState("a cool decoration");
  const [decorationPrice, setDecorationPrice] = useState("100");
  const [decorationRarity, setDecorationRarity] = useState("1");
  const [decorationPlayerAddress, setDecorationPlayerAddress] = useState("");

  // Inputs state for Fish
  const [fishId, setFishId] = useState("");
  const [fishSpecies, setFishSpecies] = useState("GoldFish");
  const [fishPlayerAddress, setFishPlayerAddress] = useState("");

  // Inputs for add fish/decoration to aquarium
  const [fishIdForAdd, setFishIdForAdd] = useState("");
  const [decorationIdForAdd, setDecorationIdForAdd] = useState("");
  const [aquariumIdForAdd, setAquariumIdForAdd] = useState("");

  // Inputs for verification
  const [verificationAddress, setVerificationAddress] = useState("");

  // UI state
  const [response, setResponse] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async <T,>(request: () => Promise<T>, name: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await request();
      console.log(`${name} result`, result);
      setResponse(result as object);
    } catch (err: unknown) {
      console.error(`${name} error`, err);
      const feltError = /revert with "([^"]+)"/;
      if (err instanceof Error) {
        const match = err.message.match(feltError);
        setError(
          match ? match[1] : err.message || "An unknown error occurred."
        );
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Player Handlers
  const handleRegisterPlayer = async () => {
    if (!account) return;
    handleRequest(() => registerPlayer(account, username), "registerPlayer");
  };

  const handleGetPlayer = async () => {
    const addr = playerAddress || account?.address;
    if (!addr) return setError("Player address required");
    handleRequest(() => getPlayer(addr), "getPlayer");
  };

  const handleGetUsernameFromAddress = async () => {
    const addr = playerAddress || account?.address;
    if (!addr) return setError("Player address required");
    handleRequest(() => getUsernameFromAddress(addr), "getUsernameFromAddress");
  };

  const handleCreateNewPlayerId = async () => {
    if (!account) return;
    handleRequest(() => createNewPlayerId(account), "createNewPlayerId");
  };

  // Aquarium Handlers
  const handleNewAquarium = async () => {
    if (!account) return;
    handleRequest(() => newAquarium(account, account.address, parseInt(maxCapacity)), "newAquarium");
  };

  const handleGetAquarium = async () => {
    if (!aquariumId) return setError("Aquarium ID required");
    handleRequest(() => getAquarium(parseInt(aquariumId)), "getAquarium");
  };

  const handleGetPlayerAquariums = async () => {
    if (!aquariumPlayerAddress) return setError("Player address required");
    handleRequest(() => getPlayerAquariums(aquariumPlayerAddress), "getPlayerAquariums");
  };

  const handleGetPlayerAquariumCount = async () => {
    if (!aquariumPlayerAddress) return setError("Player address required");
    handleRequest(() => getPlayerAquariumCount(aquariumPlayerAddress), "getPlayerAquariumCount");
  };

  const handleAddFishToAquarium = async () => {
    if (!account) return;
    if (!fishIdForAdd) return setError("Fish ID required");
    if (!aquariumIdForAdd) return setError("Aquarium ID required");
    try {
      const fish = await getFish(parseInt(fishIdForAdd));
      await addFishToAquarium(account, fish, parseInt(aquariumIdForAdd));
      setResponse({ message: "Fish added to aquarium" });
    } catch {
      setError("Failed to add fish to aquarium");
    }
  };

  const handleAddDecorationToAquarium = async () => {
    if (!account) return;
    if (!decorationIdForAdd) return setError("Decoration ID required");
    if (!aquariumIdForAdd) return setError("Aquarium ID required");
    try {
      const decoration = await getDecoration(parseInt(decorationIdForAdd));
      await addDecorationToAquarium(account, decoration, parseInt(aquariumIdForAdd));
      setResponse({ message: "Decoration added to aquarium" });
    } catch {
      setError("Failed to add decoration to aquarium");
    }
  };

  // Decoration Handlers
  const handleNewDecoration = async () => {
    if (!account) return;
    const nameFelt = stringToFelt(decorationName);
    if (Array.isArray(nameFelt)) {
      setError("Decoration name is too long.");
      return;
    }
    const descFelt = stringToFelt(decorationDesc);
    if (Array.isArray(descFelt)) {
      setError("Decoration description is too long.");
      return;
    }
    handleRequest(
      () =>
        newDecoration(
          account,
          aquariumId ? parseInt(aquariumId) : 0,
          nameFelt,
          descFelt,
          parseInt(decorationPrice),
          parseInt(decorationRarity)
        ),
      "newDecoration"
    );
  };

  const handleGetDecoration = async () => {
    if (!decorationId) return setError("Decoration ID required");
    handleRequest(() => getDecoration(parseInt(decorationId)), "getDecoration");
  };

  const handleGetPlayerDecorations = async () => {
    if (!decorationPlayerAddress) return setError("Player address required");
    handleRequest(() => getPlayerDecorations(decorationPlayerAddress), "getPlayerDecorations");
  };

  const handleGetPlayerDecorationCount = async () => {
    if (!decorationPlayerAddress) return setError("Player address required");
    handleRequest(() => getPlayerDecorationCount(decorationPlayerAddress), "getPlayerDecorationCount");
  };

  // Fish Handlers
  const handleNewFish = async () => {
    if (!account) return;
    const species = new CairoCustomEnum({ [fishSpecies]: {} });
    handleRequest(() => newFish(account, account.address, species), "newFish");
  };

  const handleGetFish = async () => {
    if (!fishId) return setError("Fish ID required");
    handleRequest(() => getFish(parseInt(fishId)), "getFish");
  };

  const handleGetPlayerFishes = async () => {
    if (!fishPlayerAddress) return setError("Player address required");
    handleRequest(() => getPlayerFishes(fishPlayerAddress), "getPlayerFishes");
  };

  const handleGetPlayerFishCount = async () => {
    if (!fishPlayerAddress) return setError("Player address required");
    handleRequest(() => getPlayerFishCount(fishPlayerAddress), "getPlayerFishCount");
  };

  // Verification Handler
  const handleIsVerified = async () => {
    if (!verificationAddress) return setError("Player address required");
    handleRequest(() => isVerified(verificationAddress), "isVerified");
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-900 text-gray-200 p-8 font-mono">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">
        AquaStark Dev Console
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls Column */}
        <div className="flex flex-col gap-6">

          {/* Player Section */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-300">Player</h2>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md mt-2 w-full"
                onClick={handleRegisterPlayer}
                disabled={loading}
              >
                Register Player
              </button>
            </div>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Player Address"
                value={playerAddress}
                onChange={(e) => setPlayerAddress(e.target.value)}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md mt-2 w-full"
                onClick={handleGetPlayer}
                disabled={loading}
              >
                Get Player
              </button>
            </div>

            <div className="mb-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md w-full"
                onClick={handleGetUsernameFromAddress}
                disabled={loading}
              >
                Get Username From Address
              </button>
            </div>

            <div className="mb-4">
              <button
                className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-md w-full"
                onClick={handleCreateNewPlayerId}
                disabled={loading}
              >
                Create New Player ID
              </button>
            </div>
          </div>

          {/* Verification Section */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-purple-300">Verification</h2>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Player Address"
                value={verificationAddress}
                onChange={(e) => setVerificationAddress(e.target.value)}
              />
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md mt-2 w-full"
                onClick={handleIsVerified}
                disabled={loading}
              >
                Check If Verified
              </button>
            </div>
          </div>

          {/* Aquarium Section */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-green-300">Aquarium</h2>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Max Capacity"
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
              />
              <button
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md mt-2 w-full"
                onClick={handleNewAquarium}
                disabled={loading}
              >
                New Aquarium
              </button>
            </div>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Aquarium ID"
                type="number"
                value={aquariumId}
                onChange={(e) => setAquariumId(e.target.value)}
              />
              <button
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md mt-2 w-full"
                onClick={handleGetAquarium}
                disabled={loading}
              >
                Get Aquarium
              </button>
            </div>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Player Address (for player's aquariums)"
                value={aquariumPlayerAddress}
                onChange={(e) => setAquariumPlayerAddress(e.target.value)}
              />
              <button
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md mt-2 w-full"
                onClick={handleGetPlayerAquariums}
                disabled={loading}
              >
                Get Player Aquariums
              </button>
            </div>

            <div className="mb-4">
              <button
                className="bg-green-400 hover:bg-green-500 text-white p-2 rounded-md w-full"
                onClick={handleGetPlayerAquariumCount}
                disabled={loading}
              >
                Get Player Aquarium Count
              </button>
            </div>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Fish ID (to add)"
                type="number"
                value={fishIdForAdd}
                onChange={(e) => setFishIdForAdd(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Aquarium ID (to add fish/decoration)"
                type="number"
                value={aquariumIdForAdd}
                onChange={(e) => setAquariumIdForAdd(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <button
                className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-md w-full"
                onClick={handleAddFishToAquarium}
                disabled={loading}
              >
                Add Fish to Aquarium
              </button>
            </div>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Decoration ID (to add)"
                type="number"
                value={decorationIdForAdd}
                onChange={(e) => setDecorationIdForAdd(e.target.value)}
              />
            </div>

            <div>
              <button
                className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-md w-full"
                onClick={handleAddDecorationToAquarium}
                disabled={loading}
              >
                Add Decoration to Aquarium
              </button>
            </div>
          </div>

          {/* Decoration Section */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-yellow-300">
              Decoration
            </h2>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Name"
                value={decorationName}
                onChange={(e) => setDecorationName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Description"
                value={decorationDesc}
                onChange={(e) => setDecorationDesc(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Price"
                type="number"
                value={decorationPrice}
                onChange={(e) => setDecorationPrice(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Rarity"
                type="number"
                value={decorationRarity}
                onChange={(e) => setDecorationRarity(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-md w-full"
                onClick={handleNewDecoration}
                disabled={loading}
              >
                New Decoration
              </button>
            </div>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Decoration ID"
                type="number"
                value={decorationId}
                onChange={(e) => setDecorationId(e.target.value)}
              />
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-md mt-2 w-full"
                onClick={handleGetDecoration}
                disabled={loading}
              >
                Get Decoration
              </button>
            </div>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Player Address (for decorations)"
                value={decorationPlayerAddress}
                onChange={(e) => setDecorationPlayerAddress(e.target.value)}
              />
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md mt-2 w-full"
                onClick={handleGetPlayerDecorations}
                disabled={loading}
              >
                Get Player Decorations
              </button>
            </div>

            <div className="mb-4">
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-md w-full"
                onClick={handleGetPlayerDecorationCount}
                disabled={loading}
              >
                Get Player Decoration Count
              </button>
            </div>
          </div>

          {/* Fish Section */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-pink-300">Fish</h2>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Species (e.g. GoldFish)"
                value={fishSpecies}
                onChange={(e) => setFishSpecies(e.target.value)}
              />
              <button
                className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-md mt-2 w-full"
                onClick={handleNewFish}
                disabled={loading}
              >
                New Fish
              </button>
            </div>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Fish ID"
                type="number"
                value={fishId}
                onChange={(e) => setFishId(e.target.value)}
              />
              <button
                className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-md mt-2 w-full"
                onClick={handleGetFish}
                disabled={loading}
              >
                Get Fish
              </button>
            </div>

            <div className="mb-4">
              <input
                className="bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full"
                placeholder="Player Address (for fishes)"
                value={fishPlayerAddress}
                onChange={(e) => setFishPlayerAddress(e.target.value)}
              />
              <button
                className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-md mt-2 w-full"
                onClick={handleGetPlayerFishes}
                disabled={loading}
              >
                Get Player Fishes
              </button>
            </div>

            <div>
              <button
                className="bg-pink-400 hover:bg-pink-500 text-white p-2 rounded-md w-full"
                onClick={handleGetPlayerFishCount}
                disabled={loading}
              >
                Get Player Fish Count
              </button>
            </div>
          </div>
        </div>

        {/* Response Column */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 overflow-auto max-h-[80vh]">
          <h2 className="text-2xl font-bold mb-4 text-gray-300">Response</h2>
          {loading && <p className="text-yellow-400">Loading...</p>}
          {error && <p className="text-red-500 whitespace-pre-wrap">{error}</p>}
          {response && (
            <pre className="text-sm text-green-400 whitespace-pre-wrap">
              {JSON.stringify(response, null, 2)}
            </pre>
          )}
          {!loading && !error && !response && (
            <p className="text-gray-500">No response yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};