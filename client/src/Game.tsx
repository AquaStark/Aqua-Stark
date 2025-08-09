import { stringToFelt } from '@/utils/starknet';
import { useAccount } from '@starknet-react/core';
import { useState } from 'react';
import { CairoCustomEnum } from 'starknet';
import { useAquarium } from './hooks/dojo/useAquarium';
import { useDecoration } from './hooks/dojo/useDecoration';
import { useFish } from './hooks/dojo/useFish';
import { usePlayer } from './hooks/dojo/usePlayer';

export const Game = () => {
  const { registerPlayer, getPlayer, isVerified } = usePlayer();
  const {
    getAquarium,
    newAquarium,
    getPlayerAquariums,
    getAquariumOwner,
    getPlayerAquariumCount,
    moveFishToAquarium,
    moveDecorationToAquarium,
  } = useAquarium();
  const {
    getDecoration,
    newDecoration,
    getPlayerDecorations,
    getPlayerDecorationCount,
    getDecorationOwner,
  } = useDecoration();
  const {
    getFish,
    newFish,
    getPlayerFishes,
    getPlayerFishCount,
    breedFishes,
    getFishOwner,
    getFishParents,
    getFishOffspring,
    getFishAncestor,
    getFishFamilyTree,
  } = useFish();
  const { account } = useAccount();

  // Inputs state
  const [username, setUsername] = useState('test_player');
  const [playerAddress, setPlayerAddress] = useState('');
  const [aquariumId, setAquariumId] = useState('1');
  const [maxCapacity, setMaxCapacity] = useState('10');
  const [maxDecorations, setMaxDecorations] = useState('10');
  const [decorationId, setDecorationId] = useState('1');
  const [decorationName, setDecorationName] = useState('decoration');
  const [decorationDesc, setDecorationDesc] = useState('a cool decoration');
  const [decorationPrice, setDecorationPrice] = useState('100');
  const [decorationRarity, setDecorationRarity] = useState('1');
  const [fishId, setFishId] = useState('1');
  const [fishSpecies, setFishSpecies] = useState('GoldFish');
  const [playerAddressCounts, setPlayerAddressCounts] = useState('');
  const [playerAddressAquariums, setPlayerAddressAquariums] = useState('');
  const [playerAddressDecorations, setPlayerAddressDecorations] = useState('');
  const [playerAddressFishes, setPlayerAddressFishes] = useState('');
  const [parent1Id, setParent1Id] = useState('');
  const [parent2Id, setParent2Id] = useState('');
  const [fromAquariumId, setFromAquariumId] = useState('');
  const [toAquariumId, setToAquariumId] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [offspringFishId, setOffspringFishId] = useState('');
  const [aquariumownerId, setAquariumownerId] = useState('');
  const [decorationOwnerId, setDecorationOwnerId] = useState('');
  const [generation, setGeneration] = useState('');

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
          match ? match[1] : err.message || 'An unknown error occurred.'
        );
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPlayer = async () => {
    if (!account) return;
    handleRequest(() => registerPlayer(account, username), 'registerPlayer');
  };

  const handleGetPlayer = async () => {
    if (!account) return;
    handleRequest(
      () => getPlayer(playerAddress || account.address),
      'getPlayer'
    );
  };

  const handleNewAquarium = async () => {
    if (!account) return;
    handleRequest(
      () =>
        newAquarium(
          account,
          account.address,
          parseInt(maxCapacity),
          parseInt(maxDecorations)
        ),
      'newAquarium'
    );
  };

  const handleGetAquarium = async () => {
    handleRequest(() => getAquarium(parseInt(aquariumId)), 'getAquarium');
  };

  const handleNewDecoration = async () => {
    if (!account) return;
    const nameFelt = stringToFelt(decorationName);
    if (Array.isArray(nameFelt)) {
      setError('Decoration name is too long.');
      return;
    }
    const descFelt = stringToFelt(decorationDesc);
    if (Array.isArray(descFelt)) {
      setError('Decoration description is too long.');
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
      'newDecoration'
    );
  };

  const handleGetDecoration = async () => {
    handleRequest(() => getDecoration(parseInt(decorationId)), 'getDecoration');
  };

  const handleNewFish = async () => {
    if (!account) return;
    const species = new CairoCustomEnum({ [fishSpecies]: {} });
    handleRequest(() => newFish(account, aquariumId, species), 'newFish');
  };

  const handleGetFish = async () => {
    handleRequest(() => getFish(parseInt(fishId)), 'getFish');
  };

  const handleGetDecorationCount = async () => {
    handleRequest(
      () => getPlayerDecorationCount(playerAddressCounts),
      'getPlayerDecorationCount'
    );
  };

  const handleGetAquariumCount = async () => {
    handleRequest(
      () => getPlayerAquariumCount(playerAddressCounts),
      'getPlayerAquariumCount'
    );
  };

  const handleGetFishCount = async () => {
    handleRequest(
      () => getPlayerFishCount(playerAddressCounts),
      'getPlayerFishCount'
    );
  };

  const handleGetPlayerAquariums = async () => {
    if (!playerAddressAquariums) return setError('Player address required');
    handleRequest(
      () => getPlayerAquariums(playerAddressAquariums),
      'getPlayerAquariums'
    );
  };

  const handleGetPlayerDecorations = async () => {
    if (!playerAddressDecorations) return setError('Player address required');
    handleRequest(
      () => getPlayerDecorations(playerAddressDecorations),
      'getPlayerDecorations'
    );
  };

  const handleGetPlayerFishes = async () => {
    if (!playerAddressFishes) return setError('Player address required');
    handleRequest(
      () => getPlayerFishes(playerAddressFishes),
      'getPlayerFishes'
    );
  };

  // Verification Handler
  const handleIsVerified = async () => {
    if (!playerAddress) return setError('Player address required');
    handleRequest(() => isVerified(playerAddress), 'isVerified');
  };

  const handleFamilyTree = () => {
    if (!fishId) return setError('Fish ID required');
    handleRequest(
      () => getFishFamilyTree(parseInt(fishId)),
      'getFishFamilyTree'
    );
  };

  const handleFishAncestor = () => {
    if (!fishId) return setError('Fish ID required');
    if (!generation) return setError('Generation required');
    handleRequest(
      () => getFishAncestor(parseInt(fishId), parseInt(generation)),
      'getFishAncestor'
    );
  };

  // Dummy handlers for now
  const handleMoveFish = () => {
    if (!account) return;
    if (!fromAquariumId) return setError('Aquarium ID required');
    if (!toAquariumId) return setError('Aquarium ID required');
    if (!fishId) return setError('Fish ID required');
    handleRequest(
      () =>
        moveFishToAquarium(
          account,
          parseInt(fishId),
          parseInt(fromAquariumId),
          parseInt(toAquariumId)
        ),
      'moveFishToAquarium'
    );
  };
  const handleMoveDecoration = () => {
    if (!account) return;
    if (!fromAquariumId) return setError('From Aquarium ID required');
    if (!toAquariumId) return setError('To Aquarium ID required');
    if (!decorationId) return setError('Decoration ID required');
    handleRequest(
      () =>
        moveDecorationToAquarium(
          account,
          parseInt(decorationId),
          parseInt(fromAquariumId),
          parseInt(toAquariumId)
        ),
      'moveDecorationToAquarium'
    );
  };
  const handleBreedFishes = () => {
    if (!account) return;
    if (!parent1Id) return setError('Parent 1 ID required');
    if (!parent2Id) return setError('Parent 2 ID required');
    handleRequest(
      () => breedFishes(account, parseInt(parent1Id), parseInt(parent2Id)),
      'breedFishes'
    );
  };

  const handleGetFishOwner = () => {
    if (!ownerId) return setError('Fish ID required');
    handleRequest(() => getFishOwner(parseInt(ownerId)), 'getFishOwner');
  };

  const handleGetParents = () => {
    if (!fishId) return setError('Fish ID required');
    handleRequest(() => getFishParents(parseInt(fishId)), 'getFishParents');
  };
  const handleGetOffspring = () => {
    if (!fishId) return setError('Fish ID required');
    handleRequest(
      () => getFishOffspring(parseInt(offspringFishId)),
      'getFishOffspring'
    );
  };

  const handleGetAquariumOwner = () => {
    if (!aquariumownerId) return setError('Aquarium ID required');
    handleRequest(
      () => getAquariumOwner(parseInt(aquariumownerId)),
      'getAquariumOwner'
    );
  };
  const handleGetDecorationOwner = () => {
    if (!decorationOwnerId) return setError('Decoration ID required');
    handleRequest(
      () => getDecorationOwner(parseInt(decorationOwnerId)),
      'getDecorationOwner'
    );
  };

  return (
    <div className='flex-1 min-h-screen bg-gray-900 text-gray-200 p-8 font-mono'>
      <h1 className='text-3xl font-bold mb-8 text-center text-blue-400'>
        AquaStark Dev Console
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='flex flex-col gap-6'>
          {/* Player */}
          <div className='bg-gray-800 p-4 rounded-lg'>
            <h2 className='text-xl font-bold mb-4 text-blue-300'>Player</h2>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='Username'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <button
              className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleRegisterPlayer}
              disabled={loading}
            >
              Register Player
            </button>

            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='Player Address (defaults to connected)'
              value={playerAddress}
              onChange={e => setPlayerAddress(e.target.value)}
            />
            <button
              className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleGetPlayer}
              disabled={loading}
            >
              Get Player
            </button>
          </div>

          {/* Verification */}
          <div className='bg-gray-800 p-4 rounded-lg'>
            <h2 className='text-xl font-bold mb-4 text-purple-300'>
              Verification
            </h2>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='Player Address'
              value={playerAddress}
              onChange={e => setPlayerAddress(e.target.value)}
            />
            <button
              className='bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleIsVerified}
              disabled={loading}
            >
              Check If Verified
            </button>
          </div>

          {/* Aquarium */}
          <div className='bg-gray-800 p-4 rounded-lg'>
            <h2 className='text-xl font-bold mb-4 text-green-300'>Aquarium</h2>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='Max Capacity'
              type='number'
              value={maxCapacity}
              onChange={e => setMaxCapacity(e.target.value)}
            />
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='Max Decorations'
              type='number'
              value={maxDecorations}
              onChange={e => setMaxDecorations(e.target.value)}
            />
            <button
              className='bg-green-600 hover:bg-green-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleNewAquarium}
              disabled={loading}
            >
              New Aquarium
            </button>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='Aquarium ID'
              type='number'
              value={aquariumId}
              onChange={e => setAquariumId(e.target.value)}
            />
            <button
              className='bg-green-600 hover:bg-green-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleGetAquarium}
              disabled={loading}
            >
              Get Aquarium
            </button>
          </div>

          {/* Decoration */}
          <div className='bg-gray-800 p-4 rounded-lg'>
            <h2 className='text-xl font-bold mb-4 text-yellow-300'>
              Decoration
            </h2>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='Aquarium ID'
              type='number'
              value={aquariumId}
              onChange={e => setAquariumId(e.target.value)}
            />
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='Name'
              value={decorationName}
              onChange={e => setDecorationName(e.target.value)}
            />
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='Description'
              value={decorationDesc}
              onChange={e => setDecorationDesc(e.target.value)}
            />
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='Price'
              type='number'
              value={decorationPrice}
              onChange={e => setDecorationPrice(e.target.value)}
            />
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='Rarity'
              type='number'
              value={decorationRarity}
              onChange={e => setDecorationRarity(e.target.value)}
            />
            <button
              className='bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleNewDecoration}
              disabled={loading}
            >
              New Decoration
            </button>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='Decoration ID'
              type='number'
              value={decorationId}
              onChange={e => setDecorationId(e.target.value)}
            />
            <button
              className='bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleGetDecoration}
              disabled={loading}
            >
              Get Decoration
            </button>
          </div>

          {/* Fish */}
          <div className='bg-gray-800 p-4 rounded-lg'>
            <h2 className='text-xl font-bold mb-4 text-red-300'>Fish</h2>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='Aquarium ID'
              type='number'
              value={aquariumId}
              onChange={e => setAquariumId(e.target.value)}
            />
            <select
              className='bg-gray-700 p-2 rounded-md w-full mt-2'
              value={fishSpecies}
              onChange={e => setFishSpecies(e.target.value)}
            >
              <option>GoldFish</option>
              <option>AngelFish</option>
              <option>Betta</option>
              <option>NeonTetra</option>
              <option>Corydoras</option>
            </select>
            <button
              className='bg-red-600 hover:bg-red-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleNewFish}
              disabled={loading}
            >
              New Fish
            </button>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='Fish ID'
              type='number'
              value={fishId}
              onChange={e => setFishId(e.target.value)}
            />
            <button
              className='bg-red-600 hover:bg-red-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleGetFish}
              disabled={loading}
            >
              Get Fish
            </button>
          </div>

          {/* Breeding */}
          <div className='bg-gray-800 p-4 rounded-lg border-l-4 border-pink-500'>
            <h2 className='text-xl font-bold mb-4 text-pink-300'>
              Breed Fishes
            </h2>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='Parent 1 Fish ID'
              type='number'
              value={parent1Id}
              onChange={e => setParent1Id(e.target.value)}
            />
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='Parent 2 Fish ID'
              type='number'
              value={parent2Id}
              onChange={e => setParent2Id(e.target.value)}
            />
            <button
              className='bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleBreedFishes}
            >
              Breed Fishes
            </button>
          </div>

          {/* Move Fish */}
          <div className='bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500'>
            <h2 className='text-xl font-bold mb-4 text-blue-300'>Move Fish</h2>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='Fish ID'
              type='number'
              value={fishId}
              onChange={e => setFishId(e.target.value)}
            />
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='From Aquarium ID'
              type='number'
              value={fromAquariumId}
              onChange={e => setFromAquariumId(e.target.value)}
            />
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='To Aquarium ID'
              type='number'
              value={toAquariumId}
              onChange={e => setToAquariumId(e.target.value)}
            />
            <button
              className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleMoveFish}
            >
              Move Fish
            </button>
          </div>

          {/* Move Decoration */}
          <div className='bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-500'>
            <h2 className='text-xl font-bold mb-4 text-yellow-300'>
              Move Decoration
            </h2>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='Decoration ID'
              type='number'
              value={decorationId}
              onChange={e => setDecorationId(e.target.value)}
            />
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='From Aquarium ID'
              type='number'
              value={fromAquariumId}
              onChange={e => setFromAquariumId(e.target.value)}
            />
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='To Aquarium ID'
              type='number'
              value={toAquariumId}
              onChange={e => setToAquariumId(e.target.value)}
            />
            <button
              className='bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleMoveDecoration}
            >
              Move Decoration
            </button>
          </div>

          {/* Ownership */}
          <div className='bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500'>
            <h2 className='text-xl font-bold mb-4 text-purple-300'>
              Get Ownership
            </h2>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='Fish ID'
              type='number'
              value={ownerId}
              onChange={e => setOwnerId(e.target.value)}
            />
            <button
              className='bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleGetFishOwner}
            >
              Get Fish Owner
            </button>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='Aquarium ID'
              type='number'
              value={aquariumownerId}
              onChange={e => setAquariumownerId(e.target.value)}
            />
            <button
              className='bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleGetAquariumOwner}
            >
              Get Aquarium Owner
            </button>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full mt-2'
              placeholder='Decoration ID'
              type='number'
              value={decorationOwnerId}
              onChange={e => setDecorationOwnerId(e.target.value)}
            />
            <button
              className='bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleGetDecorationOwner}
            >
              Get Decoration Owner
            </button>
          </div>

          {/* Parents & Offspring */}
          <div className='bg-gray-800 p-4 rounded-lg border-l-4 border-green-500'>
            <h2 className='text-xl font-bold mb-4 text-green-300'>
              Get Parents
            </h2>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='Fish ID'
              type='number'
              value={fishId}
              onChange={e => setFishId(e.target.value)}
            />
            <button
              className='bg-green-600 hover:bg-green-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleGetParents}
            >
              Get Parents
            </button>
          </div>
          <div className='bg-gray-800 p-4 rounded-lg border-l-4 border-red-500'>
            <h2 className='text-xl font-bold mb-4 text-red-300'>
              Get Fish Offspring
            </h2>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='Fish ID'
              type='number'
              value={offspringFishId}
              onChange={e => setOffspringFishId(e.target.value)}
            />
            <button
              className='bg-red-600 hover:bg-red-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleGetOffspring}
            >
              Get Offspring
            </button>
          </div>

          <div className='bg-gray-800 p-4 rounded-lg border-l-4 border-red-500'>
            <h2 className='text-xl font-bold mb-4 text-red-300'>
              Get Fish Family Tree
            </h2>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='Fish ID'
              type='number'
              value={fishId}
              onChange={e => setFishId(e.target.value)}
            />
            <button
              className='bg-red-600 hover:bg-red-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleFamilyTree}
            >
              Get Family Tree
            </button>
          </div>

          <div className='bg-gray-800 p-4 rounded-lg border-l-4 border-red-500'>
            <h2 className='text-xl font-bold mb-4 text-red-300'>
              Get Fish Ancestor
            </h2>
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='Fish ID'
              type='number'
              value={fishId}
              onChange={e => setFishId(e.target.value)}
            />
            <input
              className='bg-gray-700 p-2 rounded-md placeholder-gray-500 w-full'
              placeholder='generation'
              type='number'
              value={generation}
              onChange={e => setGeneration(e.target.value)}
            />
            <button
              className='bg-red-600 hover:bg-red-700 text-white p-2 rounded-md mt-2 w-full'
              onClick={handleFishAncestor}
            >
              Get Ancestor
            </button>
          </div>
        </div>

        {/* Response */}
        <div className='bg-gray-800 p-4 rounded-lg sticky top-8 h-fit'>
          <h2 className='text-xl font-bold mb-4 text-gray-300'>Response</h2>
          <div className='bg-gray-900 p-4 rounded-md min-h-[100px] max-h-[70vh] overflow-y-auto'>
            {loading && <p className='text-blue-400'>Loading...</p>}
            {error && (
              <pre className='text-red-400 whitespace-pre-wrap'>{error}</pre>
            )}
            {response && (
              <pre className='text-green-400 whitespace-pre-wrap'>
                {JSON.stringify(
                  response,
                  (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value,
                  2
                )}
              </pre>
            )}
            {!loading && !error && !response && (
              <p className='text-gray-500'>Responses will be shown here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
