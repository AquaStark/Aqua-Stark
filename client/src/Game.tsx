import { 
  ResponsePanel, 
  PlayerSection, 
  AquariumSection, 
  FishSection, 
  DecorationSection,
  BreedingSection,
  MovementSection,
  GenealogySection
} from './components/game/dev-console';
import { useDevConsoleStore } from './store/dev-console-store';
import { useDevConsoleHandlers } from './hooks/use-dev-console-handlers';

export const Game = () => {
  const { state, handlers } = useDevConsoleHandlers();
  const { setFormInput } = useDevConsoleStore();

  return (
    <div className='flex-1 min-h-screen bg-gray-900 text-gray-200 p-8 font-mono'>
      <h1 className='text-3xl font-bold mb-8 text-center text-blue-400'>
        AquaStark Dev Console
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='flex flex-col gap-6'>
          <PlayerSection
            username={state.username}
            setUsername={(v) => setFormInput('username', v)}
            playerAddress={state.playerAddress}
            setPlayerAddress={(v) => setFormInput('playerAddress', v)}
            responseState={state.responseState}
            onRegisterPlayer={handlers.handleRegisterPlayer}
            onGetPlayer={handlers.handleGetPlayer}
            onCheckVerification={handlers.handleIsVerified}
          />
          
          <AquariumSection
            aquariumId={state.aquariumId}
            setAquariumId={(v) => setFormInput('aquariumId', v)}
            maxCapacity={state.maxCapacity}
            setMaxCapacity={(v) => setFormInput('maxCapacity', v)}
            maxDecorations={state.maxDecorations}
            setMaxDecorations={(v) => setFormInput('maxDecorations', v)}
            aquariumOwnerId={state.aquariumOwnerId}
            setAquariumOwnerId={(v) => setFormInput('aquariumOwnerId', v)}
            responseState={state.responseState}
            onNewAquarium={handlers.handleNewAquarium}
            onGetAquarium={handlers.handleGetAquarium}
            onGetAquariumOwner={handlers.handleGetAquariumOwner}
          />
          
          <FishSection
            aquariumId={state.aquariumId}
            setAquariumId={(v) => setFormInput('aquariumId', v)}
            fishId={state.fishId}
            setFishId={(v) => setFormInput('fishId', v)}
            fishSpecies={state.fishSpecies}
            setFishSpecies={(v) => setFormInput('fishSpecies', v)}
            ownerId={state.ownerId}
            setOwnerId={(v) => setFormInput('ownerId', v)}
            responseState={state.responseState}
            onNewFish={handlers.handleNewFish}
            onGetFish={handlers.handleGetFish}
            onGetFishOwner={handlers.handleGetFishOwner}
          />
          
          <DecorationSection
            aquariumId={state.aquariumId}
            setAquariumId={(v) => setFormInput('aquariumId', v)}
            decorationId={state.decorationId}
            setDecorationId={(v) => setFormInput('decorationId', v)}
            decorationName={state.decorationName}
            setDecorationName={(v) => setFormInput('decorationName', v)}
            decorationDesc={state.decorationDesc}
            setDecorationDesc={(v) => setFormInput('decorationDesc', v)}
            decorationPrice={state.decorationPrice}
            setDecorationPrice={(v) => setFormInput('decorationPrice', v)}
            decorationRarity={state.decorationRarity}
            setDecorationRarity={(v) => setFormInput('decorationRarity', v)}
            decorationOwnerId={state.decorationOwnerId}
            setDecorationOwnerId={(v) => setFormInput('decorationOwnerId', v)}
            responseState={state.responseState}
            onNewDecoration={handlers.handleNewDecoration}
            onGetDecoration={handlers.handleGetDecoration}
            onGetDecorationOwner={handlers.handleGetDecorationOwner}
          />
          
          <BreedingSection
            parent1Id={state.parent1Id}
            setParent1Id={(v) => setFormInput('parent1Id', v)}
            parent2Id={state.parent2Id}
            setParent2Id={(v) => setFormInput('parent2Id', v)}
            responseState={state.responseState}
            onBreedFishes={handlers.handleBreedFishes}
          />
          
          <MovementSection
            fishId={state.fishId}
            setFishId={(v) => setFormInput('fishId', v)}
            decorationId={state.decorationId}
            setDecorationId={(v) => setFormInput('decorationId', v)}
            fromAquariumId={state.fromAquariumId}
            setFromAquariumId={(v) => setFormInput('fromAquariumId', v)}
            toAquariumId={state.toAquariumId}
            setToAquariumId={(v) => setFormInput('toAquariumId', v)}
            responseState={state.responseState}
            onMoveFish={handlers.handleMoveFish}
            onMoveDecoration={handlers.handleMoveDecoration}
          />
          
          <GenealogySection
            fishId={state.fishId}
            setFishId={(v) => setFormInput('fishId', v)}
            offspringFishId={state.offspringFishId}
            setOffspringFishId={(v) => setFormInput('offspringFishId', v)}
            generation={state.generation}
            setGeneration={(v) => setFormInput('generation', v)}
            responseState={state.responseState}
            onGetParents={handlers.handleGetParents}
            onGetOffspring={handlers.handleGetOffspring}
            onGetFamilyTree={handlers.handleFamilyTree}
            onGetFishAncestor={handlers.handleFishAncestor}
          />
        </div>
        
        <ResponsePanel state={state.responseState} />
      </div>
    </div>
  );
};