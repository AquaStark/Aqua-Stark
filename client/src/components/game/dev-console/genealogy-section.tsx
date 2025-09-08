/**
 * Genealogy Section - Handles fish genealogy and family tree operations
 */

import React from 'react';
import {
  DevConsoleForm,
  DevConsoleInput,
  DevConsoleButton,
} from './dev-console-form';
import { InlineResponse, ResponsePanelState } from './response-panel';

interface GenealogySectionProps {
  // Form state
  fishId: string;
  setFishId: (value: string) => void;
  offspringFishId: string;
  setOffspringFishId: (value: string) => void;
  generation: string;
  setGeneration: (value: string) => void;

  // Response state
  responseState: ResponsePanelState;

  // Handlers
  onGetParents: () => void;
  onGetOffspring: () => void;
  onGetFamilyTree: () => void;
  onGetFishAncestor: () => void;
}

export const GenealogySection: React.FC<GenealogySectionProps> = ({
  fishId,
  setFishId,
  offspringFishId,
  setOffspringFishId,
  generation,
  setGeneration,
  responseState,
  onGetParents,
  onGetOffspring,
  onGetFamilyTree,
  onGetFishAncestor,
}) => {
  return (
    <>
      {/* Get Parents */}
      <DevConsoleForm title='Get Parents' borderColor='border-green-500'>
        <DevConsoleInput
          placeholder='Fish ID'
          value={fishId}
          onChange={setFishId}
          type='number'
        />
        <DevConsoleButton
          onClick={onGetParents}
          disabled={responseState.loading}
          variant='green'
          className='mt-2'
        >
          Get Parents
        </DevConsoleButton>

        <InlineResponse state={responseState} />
      </DevConsoleForm>

      {/* Get Offspring */}
      <DevConsoleForm title='Get Fish Offspring' borderColor='border-red-500'>
        <DevConsoleInput
          placeholder='Fish ID'
          value={offspringFishId}
          onChange={setOffspringFishId}
          type='number'
        />
        <DevConsoleButton
          onClick={onGetOffspring}
          disabled={responseState.loading}
          variant='red'
          className='mt-2'
        >
          Get Offspring
        </DevConsoleButton>

        <InlineResponse state={responseState} />
      </DevConsoleForm>

      {/* Get Family Tree */}
      <DevConsoleForm title='Get Fish Family Tree' borderColor='border-red-500'>
        <DevConsoleInput
          placeholder='Fish ID'
          value={fishId}
          onChange={setFishId}
          type='number'
        />
        <DevConsoleButton
          onClick={onGetFamilyTree}
          disabled={responseState.loading}
          variant='red'
          className='mt-2'
        >
          Get Family Tree
        </DevConsoleButton>

        <InlineResponse state={responseState} />
      </DevConsoleForm>

      {/* Get Ancestor */}
      <DevConsoleForm title='Get Fish Ancestor' borderColor='border-red-500'>
        <DevConsoleInput
          placeholder='Fish ID'
          value={fishId}
          onChange={setFishId}
          type='number'
        />
        <DevConsoleInput
          placeholder='Generation'
          value={generation}
          onChange={setGeneration}
          type='number'
          className='mt-2'
        />
        <DevConsoleButton
          onClick={onGetFishAncestor}
          disabled={responseState.loading}
          variant='red'
          className='mt-2'
        >
          Get Ancestor
        </DevConsoleButton>

        <InlineResponse state={responseState} />
      </DevConsoleForm>
    </>
  );
};
