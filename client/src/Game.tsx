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
                    typeof value === "bigint" ? value.toString() : value,
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
