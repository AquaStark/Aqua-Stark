'use client';

import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from '@starknet-react/core';
import { ConnectButton } from '@/components';
import { useBubbles } from '@/hooks';
import { BubblesBackground } from '@/components';
import { PageHeader } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  useAquaAuction,
  useAquaStarkEnhanced,
  useFishSystemEnhanced,
  useTradeEnhanced,
  useSessionEnhanced,
  useShopCatalog,
  useDailyChallenge,
  useGameEnhanced,
} from '@/hooks/dojo';
import * as models from '@/typescript/models.gen';

export default function EnhancedDemo() {
  const { account, address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const bubbles = useBubbles();

  // Hooks for all contracts
  const aquaAuction = useAquaAuction();
  const aquaStark = useAquaStarkEnhanced();
  const fishSystem = useFishSystemEnhanced();
  const trade = useTradeEnhanced();
  const session = useSessionEnhanced();
  const shopCatalog = useShopCatalog();
  const dailyChallenge = useDailyChallenge();
  const game = useGameEnhanced();

  // State management
  const [fields, setFields] = useState({
    // Common fields
    id: '1',
    address: '',
    player: '',

    // Auction fields
    auctionId: '1',
    fishId: '1',
    bidAmount: '100',
    durationSecs: '3600',
    reservePrice: '50',

    // Fish fields
    species: '0',
    aquariumId: '1',
    parent1Id: '1',
    parent2Id: '2',
    generation: '1',
    price: '100',
    listingId: '1',

    // Trade fields
    offerId: '1',
    offeredFishId: '1',
    requestedFishId: '2',
    requestedSpecies: '1',
    requestedGeneration: '1',
    durationHours: '24',

    // Session fields
    sessionId: '1',
    duration: '3600',
    maxTransactions: '100',
    sessionType: '1',

    // Shop fields
    itemPrice: '100',
    stock: '10',
    description: 'Test Item',

    // Challenge fields
    challengeId: '1',
    day: '1',
    seed: '12345',

    // Transaction fields
    transactionId: '1',
    confirmationHash: '0x123',
    eventTypeId: '1',
    eventName: 'TestEvent',
    username: 'TestUser',

    // Aquarium fields
    maxCapacity: '5',
    maxDecorations: '3',
    decorationName: 'Test Decoration',
    decorationDescription: 'A test decoration',
    decorationPrice: '50',
    decorationRarity: '0',

    // Pagination
    start: '0',
    limit: '10',
    startTimestamp: '0',
    endTimestamp: '999999999999',
  });

  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('auction');

  const handleRequest = async <T,>(request: () => Promise<T>, name: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await request();
      console.log(`${name} result`, result);
      setResponse(result as object);
      toast.success(`${name} completed successfully`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error(`${name} error`, err);
      toast.error(`${name} failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
      setFields(prev => ({ ...prev, address: '', player: '' }));
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      setFields(prev => ({ ...prev, address, player: address }));
    } else {
      setFields(prev => ({ ...prev, address: '', player: '' }));
    }
  }, [address, isConnected]);

  if (!isConnected || !address || !account) {
    return (
      <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900'>
        <div className='water-movement'></div>
        <PageHeader
          title='Enhanced Contract Demo'
          backTo='/start'
          backText='Back'
          className='bg-blue-900/60 backdrop-blur-md border-b border-blue-400/30'
        />
        <main className='flex items-center justify-center min-h-[calc(100vh-8rem)] px-4'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-white mb-4'>
              Please connect your wallet to access the demo!
            </h2>
            <ConnectButton />
          </div>
        </main>
      </div>
    );
  }

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Helper function to create buttons for each contract section
  const createButton = (
    label: string,
    onClick: () => void,
    color = 'bg-blue-600 hover:bg-blue-700'
  ) => (
    <Button
      key={label}
      onClick={onClick}
      disabled={loading}
      className={`${color} transition-all duration-150 text-sm disabled:opacity-50 text-white w-full`}
      variant='default'
    >
      {label}
    </Button>
  );

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900'>
      <div className='water-movement'></div>
      <BubblesBackground bubbles={bubbles} />
      <PageHeader
        title='Enhanced Contract Demo'
        backTo='/start'
        backText='Back'
        className='bg-blue-900/60 backdrop-blur-md border-b border-blue-400/30'
      />

      <main className='max-w-7xl mx-auto px-4 py-8 space-y-6 relative z-10'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-blue-200 mb-4'>
            Comprehensive Contract Testing Suite
          </h1>
          <div className='text-sm text-blue-300 mb-8 flex items-center justify-center gap-4'>
            <span>
              Connected as:{' '}
              <span className='font-mono'>
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </span>
            <Button
              onClick={handleDisconnectWallet}
              variant='ghost'
              className='text-blue-200'
            >
              Disconnect
            </Button>
          </div>
        </div>

        <div className='grid lg:grid-cols-4 gap-6'>
          {/* Input Fields Section */}
          <Card className='lg:col-span-1 bg-blue-800/40 backdrop-blur-md border-blue-400/30'>
            <CardHeader>
              <CardTitle className='text-white'>Input Fields</CardTitle>
              <CardDescription className='text-blue-200'>
                Configure parameters for contract calls
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4 max-h-[600px] overflow-y-auto'>
              {[
                { name: 'id', label: 'General ID', type: 'number' },
                { name: 'address', label: 'Address', type: 'text' },
                { name: 'player', label: 'Player Address', type: 'text' },
                { name: 'fishId', label: 'Fish ID', type: 'number' },
                { name: 'aquariumId', label: 'Aquarium ID', type: 'number' },
                { name: 'auctionId', label: 'Auction ID', type: 'number' },
                { name: 'bidAmount', label: 'Bid Amount', type: 'number' },
                {
                  name: 'reservePrice',
                  label: 'Reserve Price',
                  type: 'number',
                },
                {
                  name: 'durationSecs',
                  label: 'Duration (seconds)',
                  type: 'number',
                },
                { name: 'species', label: 'Fish Species', type: 'number' },
                { name: 'parent1Id', label: 'Parent 1 ID', type: 'number' },
                { name: 'parent2Id', label: 'Parent 2 ID', type: 'number' },
                { name: 'price', label: 'Price', type: 'number' },
                { name: 'listingId', label: 'Listing ID', type: 'number' },
                { name: 'offerId', label: 'Trade Offer ID', type: 'number' },
                { name: 'sessionId', label: 'Session ID', type: 'number' },
                { name: 'duration', label: 'Duration', type: 'number' },
                {
                  name: 'maxTransactions',
                  label: 'Max Transactions',
                  type: 'number',
                },
                { name: 'challengeId', label: 'Challenge ID', type: 'number' },
                {
                  name: 'transactionId',
                  label: 'Transaction ID',
                  type: 'number',
                },
                { name: 'eventTypeId', label: 'Event Type ID', type: 'number' },
                { name: 'username', label: 'Username', type: 'text' },
                { name: 'maxCapacity', label: 'Max Capacity', type: 'number' },
              ].map(({ name, label, type }) => (
                <div key={name}>
                  <Label className='text-blue-200 text-xs'>{label}</Label>
                  <Input
                    name={name}
                    type={type}
                    value={(fields as any)[name]}
                    onChange={onChange}
                    className='bg-blue-700/50 text-white border-blue-400/30 text-sm h-8'
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contract Functions Section */}
          <Card className='lg:col-span-2 bg-blue-800/40 backdrop-blur-md border-blue-400/30'>
            <CardHeader>
              <CardTitle className='text-white'>Contract Functions</CardTitle>
              <CardDescription className='text-blue-200'>
                Test all available contract methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className='w-full'
              >
                <TabsList className='grid grid-cols-4 lg:grid-cols-8 mb-4 bg-blue-700/50'>
                  <TabsTrigger value='auction' className='text-xs'>
                    Auction
                  </TabsTrigger>
                  <TabsTrigger value='aqua' className='text-xs'>
                    AquaStark
                  </TabsTrigger>
                  <TabsTrigger value='fish' className='text-xs'>
                    Fish
                  </TabsTrigger>
                  <TabsTrigger value='trade' className='text-xs'>
                    Trade
                  </TabsTrigger>
                  <TabsTrigger value='session' className='text-xs'>
                    Session
                  </TabsTrigger>
                  <TabsTrigger value='shop' className='text-xs'>
                    Shop
                  </TabsTrigger>
                  <TabsTrigger value='challenge' className='text-xs'>
                    Challenge
                  </TabsTrigger>
                  <TabsTrigger value='game' className='text-xs'>
                    Game
                  </TabsTrigger>
                </TabsList>

                {/* Auction Tab */}
                <TabsContent
                  value='auction'
                  className='space-y-2 max-h-[500px] overflow-y-auto'
                >
                  <div className='grid grid-cols-2 gap-2'>
                    {createButton(
                      'Start Auction',
                      () =>
                        handleRequest(
                          () =>
                            aquaAuction.startAuction(
                              account,
                              BigInt(fields.fishId),
                              BigInt(fields.durationSecs),
                              BigInt(fields.reservePrice)
                            ),
                          'startAuction'
                        ),
                      'bg-green-600 hover:bg-green-700'
                    )}
                    {createButton(
                      'Place Bid',
                      () =>
                        handleRequest(
                          () =>
                            aquaAuction.placeBid(
                              account,
                              BigInt(fields.auctionId),
                              BigInt(fields.bidAmount)
                            ),
                          'placeBid'
                        ),
                      'bg-yellow-600 hover:bg-yellow-700'
                    )}
                    {createButton(
                      'End Auction',
                      () =>
                        handleRequest(
                          () =>
                            aquaAuction.endAuction(
                              account,
                              BigInt(fields.auctionId)
                            ),
                          'endAuction'
                        ),
                      'bg-red-600 hover:bg-red-700'
                    )}
                    {createButton('Get Active Auctions', () =>
                      handleRequest(
                        () => aquaAuction.getActiveAuctions(),
                        'getActiveAuctions'
                      )
                    )}
                    {createButton('Get Auction By ID', () =>
                      handleRequest(
                        () =>
                          aquaAuction.getAuctionById(BigInt(fields.auctionId)),
                        'getAuctionById'
                      )
                    )}
                  </div>
                </TabsContent>

                {/* AquaStark Tab */}
                <TabsContent
                  value='aqua'
                  className='space-y-2 max-h-[500px] overflow-y-auto'
                >
                  <div className='grid grid-cols-2 gap-2'>
                    {createButton(
                      'Register Player',
                      () =>
                        handleRequest(
                          () => aquaStark.register(account, BigInt(Date.now())),
                          'register'
                        ),
                      'bg-green-600 hover:bg-green-700'
                    )}
                    {createButton('Get Player', () =>
                      handleRequest(
                        () => aquaStark.getPlayer(fields.address || address),
                        'getPlayer'
                      )
                    )}
                    {createButton('Is Verified', () =>
                      handleRequest(
                        () => aquaStark.isVerified(fields.player || address),
                        'isVerified'
                      )
                    )}
                    {createButton('Get Username', () =>
                      handleRequest(
                        () =>
                          aquaStark.getUsernameFromAddress(
                            fields.address || address
                          ),
                        'getUsernameFromAddress'
                      )
                    )}
                    {createButton(
                      'New Aquarium',
                      () =>
                        handleRequest(
                          () =>
                            aquaStark.newAquarium(
                              account,
                              fields.player || address,
                              BigInt(fields.maxCapacity),
                              BigInt(3)
                            ),
                          'newAquarium'
                        ),
                      'bg-green-600 hover:bg-green-700'
                    )}
                    {createButton('Get Aquarium', () =>
                      handleRequest(
                        () => aquaStark.getAquarium(BigInt(fields.aquariumId)),
                        'getAquarium'
                      )
                    )}
                    {createButton('Get Player Aquariums', () =>
                      handleRequest(
                        () =>
                          aquaStark.getPlayerAquariums(
                            fields.player || address
                          ),
                        'getPlayerAquariums'
                      )
                    )}
                    {createButton('Get Event Types', () =>
                      handleRequest(
                        () => aquaStark.getAllEventTypes(),
                        'getAllEventTypes'
                      )
                    )}
                    {createButton('Get Transaction Count', () =>
                      handleRequest(
                        () => aquaStark.getTransactionCount(),
                        'getTransactionCount'
                      )
                    )}
                  </div>
                </TabsContent>

                {/* Fish Tab */}
                <TabsContent
                  value='fish'
                  className='space-y-2 max-h-[500px] overflow-y-auto'
                >
                  <div className='grid grid-cols-2 gap-2'>
                    {createButton(
                      'New Fish',
                      () =>
                        handleRequest(
                          () =>
                            fishSystem.newFish(
                              account,
                              BigInt(fields.aquariumId),
                              {
                                variant: parseInt(fields.species),
                                activeVariant: parseInt(fields.species),
                              }
                            ),
                          'newFish'
                        ),
                      'bg-green-600 hover:bg-green-700'
                    )}
                    {createButton('Get Fish', () =>
                      handleRequest(
                        () => fishSystem.getFish(BigInt(fields.fishId)),
                        'getFish'
                      )
                    )}
                    {createButton('Get Fish Owner', () =>
                      handleRequest(
                        () => fishSystem.getFishOwner(BigInt(fields.fishId)),
                        'getFishOwner'
                      )
                    )}
                    {createButton('Get Player Fishes', () =>
                      handleRequest(
                        () =>
                          fishSystem.getPlayerFishes(fields.player || address),
                        'getPlayerFishes'
                      )
                    )}
                    {createButton('Get Player Fish Count', () =>
                      handleRequest(
                        () =>
                          fishSystem.getPlayerFishCount(
                            fields.player || address
                          ),
                        'getPlayerFishCount'
                      )
                    )}
                    {createButton(
                      'Breed Fishes',
                      () =>
                        handleRequest(
                          () =>
                            fishSystem.breedFishes(
                              account,
                              BigInt(fields.parent1Id),
                              BigInt(fields.parent2Id)
                            ),
                          'breedFishes'
                        ),
                      'bg-purple-600 hover:bg-purple-700'
                    )}
                    {createButton('Get Parents', () =>
                      handleRequest(
                        () => fishSystem.getParents(BigInt(fields.fishId)),
                        'getParents'
                      )
                    )}
                    {createButton('Get Fish Offspring', () =>
                      handleRequest(
                        () =>
                          fishSystem.getFishOffspring(BigInt(fields.fishId)),
                        'getFishOffspring'
                      )
                    )}
                    {createButton('Get Fish Family Tree', () =>
                      handleRequest(
                        () =>
                          fishSystem.getFishFamilyTree(BigInt(fields.fishId)),
                        'getFishFamilyTree'
                      )
                    )}
                    {createButton(
                      'List Fish',
                      () =>
                        handleRequest(
                          () =>
                            fishSystem.listFish(
                              BigInt(fields.fishId),
                              BigInt(fields.price)
                            ),
                          'listFish'
                        ),
                      'bg-indigo-600 hover:bg-indigo-700'
                    )}
                  </div>
                </TabsContent>

                {/* Trade Tab */}
                <TabsContent
                  value='trade'
                  className='space-y-2 max-h-[500px] overflow-y-auto'
                >
                  <div className='grid grid-cols-2 gap-2'>
                    {createButton('Get All Active Offers', () =>
                      handleRequest(
                        () => trade.getAllActiveOffers(),
                        'getAllActiveOffers'
                      )
                    )}
                    {createButton('Get Trade Offer', () =>
                      handleRequest(
                        () => trade.getTradeOffer(BigInt(fields.offerId)),
                        'getTradeOffer'
                      )
                    )}
                    {createButton('Get User Trade Count', () =>
                      handleRequest(
                        () => trade.getUserTradeCount(fields.player || address),
                        'getUserTradeCount'
                      )
                    )}
                    {createButton('Is Fish Locked', () =>
                      handleRequest(
                        () => trade.isFishLocked(BigInt(fields.fishId)),
                        'isFishLocked'
                      )
                    )}
                    {createButton('Get Fish Lock Status', () =>
                      handleRequest(
                        () => trade.getFishLockStatus(BigInt(fields.fishId)),
                        'getFishLockStatus'
                      )
                    )}
                    {createButton('Get Total Trades Count', () =>
                      handleRequest(
                        () => trade.getTotalTradesCount(),
                        'getTotalTradesCount'
                      )
                    )}
                    {createButton(
                      'Cleanup Expired Offers',
                      () =>
                        handleRequest(
                          () => trade.cleanupExpiredOffers(account),
                          'cleanupExpiredOffers'
                        ),
                      'bg-orange-600 hover:bg-orange-700'
                    )}
                  </div>
                </TabsContent>

                {/* Session Tab */}
                <TabsContent
                  value='session'
                  className='space-y-2 max-h-[500px] overflow-y-auto'
                >
                  <div className='grid grid-cols-2 gap-2'>
                    {createButton(
                      'Create Session Key',
                      () =>
                        handleRequest(
                          () =>
                            session.createSessionKey(
                              account,
                              BigInt(fields.duration),
                              BigInt(fields.maxTransactions),
                              BigInt(1)
                            ),
                          'createSessionKey'
                        ),
                      'bg-green-600 hover:bg-green-700'
                    )}
                    {createButton('Get Session Info', () =>
                      handleRequest(
                        () => session.getSessionInfo(BigInt(fields.sessionId)),
                        'getSessionInfo'
                      )
                    )}
                    {createButton('Validate Session', () =>
                      handleRequest(
                        () =>
                          session.validateSession(
                            account,
                            BigInt(fields.sessionId)
                          ),
                        'validateSession'
                      )
                    )}
                    {createButton('Calculate Remaining Transactions', () =>
                      handleRequest(
                        () =>
                          session.calculateRemainingTransactions(
                            BigInt(fields.sessionId)
                          ),
                        'calculateRemainingTransactions'
                      )
                    )}
                    {createButton('Calculate Time Remaining', () =>
                      handleRequest(
                        () =>
                          session.calculateSessionTimeRemaining(
                            BigInt(fields.sessionId)
                          ),
                        'calculateSessionTimeRemaining'
                      )
                    )}
                    {createButton('Check Needs Renewal', () =>
                      handleRequest(
                        () =>
                          session.checkSessionNeedsRenewal(
                            BigInt(fields.sessionId)
                          ),
                        'checkSessionNeedsRenewal'
                      )
                    )}
                    {createButton(
                      'Renew Session',
                      () =>
                        handleRequest(
                          () =>
                            session.renewSession(
                              account,
                              BigInt(fields.sessionId),
                              BigInt(fields.duration),
                              BigInt(fields.maxTransactions)
                            ),
                          'renewSession'
                        ),
                      'bg-yellow-600 hover:bg-yellow-700'
                    )}
                    {createButton(
                      'Revoke Session',
                      () =>
                        handleRequest(
                          () =>
                            session.revokeSession(
                              account,
                              BigInt(fields.sessionId)
                            ),
                          'revokeSession'
                        ),
                      'bg-red-600 hover:bg-red-700'
                    )}
                  </div>
                </TabsContent>

                {/* Shop Tab */}
                <TabsContent
                  value='shop'
                  className='space-y-2 max-h-[500px] overflow-y-auto'
                >
                  <div className='grid grid-cols-2 gap-2'>
                    {createButton('Get All Items', () =>
                      handleRequest(
                        () => shopCatalog.getAllItems(),
                        'getAllItems'
                      )
                    )}
                    {createButton('Get Item', () =>
                      handleRequest(
                        () => shopCatalog.getItem(BigInt(fields.id)),
                        'getItem'
                      )
                    )}
                    {createButton(
                      'Add New Item',
                      () =>
                        handleRequest(
                          () =>
                            shopCatalog.addNewItem(
                              BigInt(fields.itemPrice),
                              BigInt(fields.stock),
                              BigInt(Date.now())
                            ),
                          'addNewItem'
                        ),
                      'bg-green-600 hover:bg-green-700'
                    )}
                    {createButton(
                      'Update Item',
                      () =>
                        handleRequest(
                          () =>
                            shopCatalog.updateItem(
                              BigInt(fields.id),
                              BigInt(fields.itemPrice),
                              BigInt(fields.stock),
                              BigInt(Date.now())
                            ),
                          'updateItem'
                        ),
                      'bg-yellow-600 hover:bg-yellow-700'
                    )}
                  </div>
                </TabsContent>

                {/* Challenge Tab */}
                <TabsContent
                  value='challenge'
                  className='space-y-2 max-h-[500px] overflow-y-auto'
                >
                  <div className='grid grid-cols-2 gap-2'>
                    {createButton(
                      'Create Challenge',
                      () =>
                        handleRequest(
                          () =>
                            dailyChallenge.createChallenge(
                              account,
                              BigInt(fields.day),
                              BigInt(fields.seed)
                            ),
                          'createChallenge'
                        ),
                      'bg-green-600 hover:bg-green-700'
                    )}
                    {createButton(
                      'Join Challenge',
                      () =>
                        handleRequest(
                          () =>
                            dailyChallenge.joinChallenge(
                              account,
                              BigInt(fields.challengeId)
                            ),
                          'joinChallenge'
                        ),
                      'bg-blue-600 hover:bg-blue-700'
                    )}
                    {createButton(
                      'Complete Challenge',
                      () =>
                        handleRequest(
                          () =>
                            dailyChallenge.completeChallenge(
                              account,
                              BigInt(fields.challengeId)
                            ),
                          'completeChallenge'
                        ),
                      'bg-purple-600 hover:bg-purple-700'
                    )}
                    {createButton(
                      'Claim Reward',
                      () =>
                        handleRequest(
                          () =>
                            dailyChallenge.claimReward(
                              account,
                              BigInt(fields.challengeId)
                            ),
                          'claimReward'
                        ),
                      'bg-yellow-600 hover:bg-yellow-700'
                    )}
                  </div>
                </TabsContent>

                {/* Game Tab */}
                <TabsContent
                  value='game'
                  className='space-y-2 max-h-[500px] overflow-y-auto'
                >
                  <div className='grid grid-cols-2 gap-2'>
                    {createButton('Get Player (Game)', () =>
                      handleRequest(
                        () => game.getPlayer(fields.address || address),
                        'gameGetPlayer'
                      )
                    )}
                    {createButton('Get Aquarium (Game)', () =>
                      handleRequest(
                        () => game.getAquarium(BigInt(fields.aquariumId)),
                        'gameGetAquarium'
                      )
                    )}
                    {createButton('Get Fish (Game)', () =>
                      handleRequest(
                        () => game.getFish(BigInt(fields.fishId)),
                        'gameGetFish'
                      )
                    )}
                    {createButton('Get Player Fishes (Game)', () =>
                      handleRequest(
                        () => game.getPlayerFishes(fields.player || address),
                        'gameGetPlayerFishes'
                      )
                    )}
                    {createButton('Get Player Fish Count (Game)', () =>
                      handleRequest(
                        () => game.getPlayerFishCount(fields.player || address),
                        'gameGetPlayerFishCount'
                      )
                    )}
                    {createButton('Is Verified (Game)', () =>
                      handleRequest(
                        () => game.isVerified(fields.player || address),
                        'gameIsVerified'
                      )
                    )}
                    {createButton('Get Listing', () =>
                      handleRequest(
                        () => game.getListing(BigInt(fields.listingId)),
                        'getListing'
                      )
                    )}
                    {createButton('List Fish (Game)', () =>
                      handleRequest(
                        () =>
                          game.listFish(
                            BigInt(fields.fishId),
                            BigInt(fields.price)
                          ),
                        'gameListFish'
                      )
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Response Section */}
          <Card className='lg:col-span-1 bg-blue-900/50 backdrop-blur-md border-blue-400/30'>
            <CardHeader>
              <CardTitle className='text-green-300'>Response</CardTitle>
              <CardDescription className='text-blue-200'>
                Contract call results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='bg-blue-800/50 rounded p-4 overflow-y-auto max-h-[600px] border border-blue-400/40'>
                {loading ? (
                  <div className='text-purple-400 text-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2'></div>
                    Loading...
                  </div>
                ) : error ? (
                  <pre className='text-red-400 whitespace-pre-wrap text-sm'>
                    {error}
                  </pre>
                ) : response ? (
                  <pre className='text-green-400 whitespace-pre-wrap text-sm'>
                    {JSON.stringify(
                      response,
                      (_, v) => (typeof v === 'bigint' ? v.toString() : v),
                      2
                    )}
                  </pre>
                ) : (
                  <p className='text-blue-300 text-center text-sm'>
                    Responses will appear here...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
