'use client';

import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from '@starknet-react/core';
import { ConnectButton } from '@/components';
import { useBubbles } from '@/hooks';
import { BubblesBackground } from '@/components';
import { PageHeader } from '@/components';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAquarium } from '@/hooks/dojo';
import * as models from '@/typescript/models.gen';

export default function AquariumDemo() {
  const { account, address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const aquarium = useAquarium();
  const { getAquarium }  = useAquarium()
  // console.log("this is aquarium", aquarium)
  const bubbles = useBubbles();

  const [fields, setFields] = useState({
    owner: '',
    maxCapacity: '5',
    maxDecorations: '3',
    aquariumId: '1',
    fishId: '1',
    decorationId: '1',
    fromAquariumId: '1',
    toAquariumId: '2',
    playerAddress: '',
    fishSpecies: '0',
    decorationName: 'Test Deco',
    decorationDescription: 'A test decoration',
    decorationPrice: '1',
    decorationRarity: '0',
  });

  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkTest = async () => {
    const res = await aquarium.getAquarium(BigInt(fields.aquariumId));
    console.log("this is the res", res)

    alert(res)
  }



 const handleRequest = async <T,>(request: () => Promise<T>, name: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await request();
      console.log(`${name} result`, result);
      setResponse(result as object);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(`${name} error`, err);
      setLoading(false)
    }finally {
      setLoading(false)
    }
  };


  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
      setFields(prev => ({ ...prev, owner: '', playerAddress: '' }));
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      setFields(prev => ({ ...prev, owner: address, playerAddress: address }));
    } else {
      setFields(prev => ({ ...prev, owner: '', playerAddress: '' }));
    }
  }, [address, isConnected]);

  if (!isConnected || !address || !account) {
    return (
      <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900'>
        <div className='water-movement'></div>
        <PageHeader
          title='Aquarium Demo'
          backTo='/start'
          backText='Back'
          className='bg-blue-900/60 backdrop-blur-md border-b border-blue-400/30'
        />
        <main className='flex items-center justify-center min-h-[calc(100vh-8rem)] px-4'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-white mb-4'>Please connect your wallet to dive in!</h2>
            <ConnectButton />
          </div>
        </main>
      </div>
    );
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));

// const dummyFish = (): models.Fish => ({
//   id: BigInt(fields.fishId),
//   species: CairoCustomEnum(fields.fishSpecies), // Assume species is a bigint enum
//   owner: address as `0x${string}`, // Ensure address is typed correctly
//   generation: BigInt(0),
//   fish_type: BigInt(0), // Assume fish_type is a bigint enum
//   age: BigInt(0),
//   hunger_level: BigInt(100),
//   health: BigInt(100),
//   growth: BigInt(0),
//   growth_rate: BigInt(1),
//   color: "blue", // Reasonable default for color
//   aquarium_id: BigInt(fields.aquariumId),
//   pattern: "striped", // Default pattern (adjust based on models.gen)
//   size: BigInt(10), // Default size (arbitrary units)
//   speed: BigInt(5), // Default speed (arbitrary units)
//   birth_time: BigInt(Math.floor(Date.now() / 1000)), // Current timestamp in seconds
//   // Assumed additional properties (replace with actual ones from models.gen)
//   rarity: BigInt(0), // e.g., 0 = common
//   happiness: BigInt(100), // Default happiness level
//   energy: BigInt(100), // Default energy level
//   last_fed: BigInt(0), // Not fed yet
//   gender: BigInt(0), // e.g., 0 = male, 1 = female
//   status: BigInt(0), // e.g., 0 = alive
// });
  const dummyDecoration = (): models.Decoration => ({
    id: BigInt(fields.decorationId),
    name: fields.decorationName,
    description: fields.decorationDescription,
    price: BigInt(fields.decorationPrice),
    rarity: BigInt(fields.decorationRarity) as any,
    owner: address,
    aquarium_id: BigInt(fields.aquariumId),
    // Add other required Decoration properties
  });

  const actionButtons = [
    // Removed Create Aquarium ID as it doesn't exist in contracts
    // Use New Aquarium instead which creates a complete aquarium
    {
      label: 'New Aquarium',
      onClick: () =>
        handleRequest(
          () => aquarium.newAquarium(account, fields.playerAddress || address, +fields.maxCapacity, +fields.maxDecorations),
          'newAquarium'
        ),
      color: 'bg-green-600 hover:bg-green-700',
    },
    // {
    //   label: 'Add Fish to Aquarium',
    //   onClick: () => handleRequest(() => aquarium.addFishToAquarium(account, dummyFish(), +fields.aquariumId), 'addFishToAquarium'),
    //   color: 'bg-blue-600 hover:bg-blue-700',
    // },
    {
      label: 'Add Decoration to Aquarium',
      onClick: () =>
        handleRequest(() => aquarium.addDecorationToAquarium(account, dummyDecoration(), +fields.aquariumId), 'addDecorationToAquarium'),
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      label: 'Move Fish to Aquarium',
      onClick: () =>
        handleRequest(() => aquarium.moveFishToAquarium(account, +fields.fishId, +fields.fromAquariumId, +fields.toAquariumId), 'moveFishToAquarium'),
      color: 'bg-indigo-600 hover:bg-indigo-700',
    },
    {
      label: 'Move Decoration to Aquarium',
      onClick: () =>
        handleRequest(
          () => aquarium.moveDecorationToAquarium(account, +fields.decorationId, +fields.fromAquariumId, +fields.toAquariumId),
          'moveDecorationToAquarium'
        ),
      color: 'bg-indigo-600 hover:bg-indigo-700',
    },
    {
      label: 'Get Aquarium',
      onClick: () =>  handleRequest(
          () => getAquarium(BigInt(fields.aquariumId)),
          'getAquarium'
        ),
      color: 'bg-cyan-600 hover:bg-cyan-700',
    },
    {
      label: 'Get Player Aquariums',
      onClick: () => handleRequest(() => aquarium.getPlayerAquariums(fields.playerAddress || address), 'getPlayerAquariums'),
      color: 'bg-cyan-600 hover:bg-cyan-700',
    },
    {
      label: 'Get Player Aquarium Count',
      onClick: () => handleRequest(() => aquarium.getPlayerAquariumCount(fields.playerAddress || address), 'getPlayerAquariumCount'),
      color: 'bg-cyan-600 hover:bg-cyan-700',
    },
    {
      label: 'Get Aquarium Owner',
      onClick: () => handleRequest(() => aquarium.getAquariumOwner(+fields.aquariumId), 'getAquariumOwner'),
      color: 'bg-cyan-600 hover:bg-cyan-700',
    },
  ];

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900'>
      <div className='water-movement'></div>
      <BubblesBackground bubbles={bubbles} />
      <PageHeader
        title='Aquarium Demo'
        backTo='/start'
        backText='Back'
        className='bg-blue-900/60 backdrop-blur-md border-b border-blue-400/30'
      />
      <main className='max-w-7xl mx-auto px-4 py-8 space-y-10 relative z-10'>
        <h1 className='text-4xl font-bold text-center text-blue-200'>Aquarium Demo</h1>

        <div className='text-center text-sm text-blue-300 mb-8 flex items-center justify-center gap-4'>
          <span>
            Connected as: <span className='font-mono'>{address.slice(0, 6)}...{address.slice(-4)}</span>
          </span>
          <Button onClick={handleDisconnectWallet} variant='ghost' className='text-blue-200'>
            Disconnect
          </Button>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          <section className='space-y-4 col-span-1 bg-blue-800/40 backdrop-blur-md p-6 rounded-xl border border-blue-400/30 shadow-lg'>
            <h2 className='text-xl font-semibold text-white mb-2'>Input Fields</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                { name: 'owner', label: 'Owner Address', type: 'text' as const },
                { name: 'playerAddress', label: 'Player Address (for queries)', type: 'text' as const },
                { name: 'maxCapacity', label: 'Max Capacity', type: 'number' as const },
                { name: 'maxDecorations', label: 'Max Decorations', type: 'number' as const },
                { name: 'aquariumId', label: 'Aquarium ID', type: 'number' as const },
                { name: 'fishId', label: 'Fish ID', type: 'number' as const },
                { name: 'decorationId', label: 'Decoration ID', type: 'number' as const },
                { name: 'fromAquariumId', label: 'From Aquarium ID', type: 'number' as const },
                { name: 'toAquariumId', label: 'To Aquarium ID', type: 'number' as const },
                { name: 'fishSpecies', label: 'Fish Species (enum)', type: 'text' as const },
                { name: 'decorationName', label: 'Decoration Name', type: 'text' as const },
                { name: 'decorationDescription', label: 'Decoration Description', type: 'text' as const },
                { name: 'decorationPrice', label: 'Decoration Price', type: 'number' as const },
                { name: 'decorationRarity', label: 'Decoration Rarity (enum)', type: 'text' as const },
              ].map(({ name, label, type }) => (
                <div key={name} className='flex flex-col'>
                  <label className='text-sm text-blue-200 mb-1'>{label}</label>
                  <input
                    name={name}
                    type={type}
                    value={(fields as any)[name]}
                    onChange={onChange}
                    placeholder={label}
                    className='bg-blue-700/50 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 border border-blue-400/30'
                  />
                </div>
              ))}
            </div>
          </section>

          <section className='col-span-1 lg:col-span-1 bg-blue-800/40 backdrop-blur-md p-6 rounded-xl border border-blue-400/30 shadow-lg space-y-4'>
            <h2 className='text-xl font-semibold text-white mb-4'>Actions</h2>
            <div className='grid sm:grid-cols-2 gap-3 max-h-[640px] overflow-y-auto pr-2'>
              {actionButtons.map((btn, i) => (
                <Button
                  key={i}
                  onClick={btn.onClick}
                  disabled={loading || !isConnected || !account}
                  className={`${btn.color} transition-all duration-150 text-sm disabled:opacity-50 text-white`}
                  variant='default'
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          </section>

          <section className='col-span-1 bg-blue-900/50 backdrop-blur-md p-6 rounded-xl border border-blue-400/30 shadow-lg'>
            <h2 className='text-xl font-semibold text-green-300 mb-2'>Response</h2>
            <div className='text-sm bg-blue-800/50 rounded p-4 overflow-y-auto max-h-[640px] border border-blue-400/40'>
              {loading ? (
                <p className='text-purple-400'>Loading...</p>
              ) : error ? (
                <pre className='text-red-400 whitespace-pre-wrap'>{error}</pre>
              ) : response ? (
                <pre className='text-green-400 whitespace-pre-wrap'>
                  {JSON.stringify(
                    response,
                    (_, v) => (typeof v === 'bigint' ? v.toString() : v),
                    2
                  )}
                </pre>
              ) : (
                <p className='text-blue-300'>Responses will bubble up here...</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}