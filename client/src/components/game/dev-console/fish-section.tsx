/**
 * Fish Section - Handles fish creation and management
 */

import React from 'react';
import {
  DevConsoleForm,
  DevConsoleInput,
  DevConsoleButton,
  DevConsoleSelect,
} from './dev-console-form';
import { InlineResponse, ResponsePanelState } from './response-panel';
import { FISH_SPECIES } from '@/constants';

interface FishSectionProps {
  // Form state
  aquariumId: string;
  setAquariumId: (value: string) => void;
  fishId: string;
  setFishId: (value: string) => void;
  fishSpecies: string;
  setFishSpecies: (value: string) => void;
  ownerId: string;
  setOwnerId: (value: string) => void;

  // Response state
  responseState: ResponsePanelState;

  // Handlers
  onNewFish: () => void;
  onGetFish: () => void;
  onGetFishOwner: () => void;
}

export const FishSection: React.FC<FishSectionProps> = ({
  aquariumId,
  setAquariumId,
  fishId,
  setFishId,
  fishSpecies,
  setFishSpecies,
  ownerId,
  setOwnerId,
  responseState,
  onNewFish,
  onGetFish,
  onGetFishOwner,
}) => {
  return (
    <>
      {/* Fish Creation/Get */}
      <DevConsoleForm title='Fish'>
        <DevConsoleInput
          placeholder='Aquarium ID'
          value={aquariumId}
          onChange={setAquariumId}
          type='number'
        />
        <DevConsoleSelect
          value={fishSpecies}
          onChange={setFishSpecies}
          options={[...FISH_SPECIES]}
          className='mt-2'
        />
        <DevConsoleButton
          onClick={onNewFish}
          disabled={responseState.loading}
          variant='red'
          className='mt-2'
        >
          New Fish
        </DevConsoleButton>

        <DevConsoleInput
          placeholder='Fish ID'
          value={fishId}
          onChange={setFishId}
          type='number'
          className='mt-2'
        />
        <DevConsoleButton
          onClick={onGetFish}
          disabled={responseState.loading}
          variant='red'
          className='mt-2'
        >
          Get Fish
        </DevConsoleButton>

        <InlineResponse state={responseState} />
      </DevConsoleForm>

      {/* Fish Ownership */}
      <DevConsoleForm title='Fish Ownership' borderColor='border-purple-500'>
        <DevConsoleInput
          placeholder='Fish ID'
          value={ownerId}
          onChange={setOwnerId}
          type='number'
        />
        <DevConsoleButton
          onClick={onGetFishOwner}
          disabled={responseState.loading}
          variant='purple'
          className='mt-2'
        >
          Get Fish Owner
        </DevConsoleButton>

        <InlineResponse state={responseState} />
      </DevConsoleForm>
    </>
  );
};
