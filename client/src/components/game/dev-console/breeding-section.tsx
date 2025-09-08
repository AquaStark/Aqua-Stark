/**
 * Breeding Section - Handles fish breeding operations
 */

import React from 'react';
import {
  DevConsoleForm,
  DevConsoleInput,
  DevConsoleButton,
} from './dev-console-form';
import { InlineResponse, ResponsePanelState } from './response-panel';

interface BreedingSectionProps {
  // Form state
  parent1Id: string;
  setParent1Id: (value: string) => void;
  parent2Id: string;
  setParent2Id: (value: string) => void;

  // Response state
  responseState: ResponsePanelState;

  // Handlers
  onBreedFishes: () => void;
}

export const BreedingSection: React.FC<BreedingSectionProps> = ({
  parent1Id,
  setParent1Id,
  parent2Id,
  setParent2Id,
  responseState,
  onBreedFishes,
}) => {
  return (
    <DevConsoleForm title='Breed Fishes' borderColor='border-pink-500'>
      <DevConsoleInput
        placeholder='Parent 1 Fish ID'
        value={parent1Id}
        onChange={setParent1Id}
        type='number'
      />
      <DevConsoleInput
        placeholder='Parent 2 Fish ID'
        value={parent2Id}
        onChange={setParent2Id}
        type='number'
        className='mt-2'
      />
      <DevConsoleButton
        onClick={onBreedFishes}
        disabled={responseState.loading}
        variant='pink'
        className='mt-2'
      >
        Breed Fishes
      </DevConsoleButton>

      <InlineResponse state={responseState} />
    </DevConsoleForm>
  );
};
