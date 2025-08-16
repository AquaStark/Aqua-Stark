/**
 * Aquarium Section - Handles aquarium creation and management
 */

import React from 'react';
import { DevConsoleForm, DevConsoleInput, DevConsoleButton } from './dev-console-form';
import { InlineResponse, ResponsePanelState } from './response-panel';

interface AquariumSectionProps {
  // Form state
  aquariumId: string;
  setAquariumId: (value: string) => void;
  maxCapacity: string;
  setMaxCapacity: (value: string) => void;
  maxDecorations: string;
  setMaxDecorations: (value: string) => void;
  aquariumOwnerId: string;
  setAquariumOwnerId: (value: string) => void;
  
  // Response state
  responseState: ResponsePanelState;
  
  // Handlers
  onNewAquarium: () => void;
  onGetAquarium: () => void;
  onGetAquariumOwner: () => void;
}

export const AquariumSection: React.FC<AquariumSectionProps> = ({
  aquariumId,
  setAquariumId,
  maxCapacity,
  setMaxCapacity,
  maxDecorations,
  setMaxDecorations,
  aquariumOwnerId,
  setAquariumOwnerId,
  responseState,
  onNewAquarium,
  onGetAquarium,
  onGetAquariumOwner
}) => {
  return (
    <>
      {/* Aquarium Creation/Get */}
      <DevConsoleForm title="Aquarium">
        <DevConsoleInput
          placeholder="Max Capacity"
          value={maxCapacity}
          onChange={setMaxCapacity}
          type="number"
        />
        <DevConsoleInput
          placeholder="Max Decorations"
          value={maxDecorations}
          onChange={setMaxDecorations}
          type="number"
          className="mt-2"
        />
        <DevConsoleButton
          onClick={onNewAquarium}
          disabled={responseState.loading}
          variant="green"
          className="mt-2"
        >
          New Aquarium
        </DevConsoleButton>

        <DevConsoleInput
          placeholder="Aquarium ID"
          value={aquariumId}
          onChange={setAquariumId}
          type="number"
          className="mt-2"
        />
        <DevConsoleButton
          onClick={onGetAquarium}
          disabled={responseState.loading}
          variant="green"
          className="mt-2"
        >
          Get Aquarium
        </DevConsoleButton>
        
        <InlineResponse state={responseState} />
      </DevConsoleForm>

      {/* Aquarium Ownership */}
      <DevConsoleForm title="Aquarium Ownership" borderColor="border-purple-500">
        <DevConsoleInput
          placeholder="Aquarium ID"
          value={aquariumOwnerId}
          onChange={setAquariumOwnerId}
          type="number"
        />
        <DevConsoleButton
          onClick={onGetAquariumOwner}
          disabled={responseState.loading}
          variant="purple"
          className="mt-2"
        >
          Get Aquarium Owner
        </DevConsoleButton>
        
        <InlineResponse state={responseState} />
      </DevConsoleForm>
    </>
  );
};