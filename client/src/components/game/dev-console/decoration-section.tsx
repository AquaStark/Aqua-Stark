/**
 * Decoration Section - Handles decoration creation and management
 */

import React from 'react';
import { DevConsoleForm, DevConsoleInput, DevConsoleButton } from './dev-console-form';
import { InlineResponse, ResponsePanelState } from './response-panel';

interface DecorationSectionProps {
  // Form state
  aquariumId: string;
  setAquariumId: (value: string) => void;
  decorationId: string;
  setDecorationId: (value: string) => void;
  decorationName: string;
  setDecorationName: (value: string) => void;
  decorationDesc: string;
  setDecorationDesc: (value: string) => void;
  decorationPrice: string;
  setDecorationPrice: (value: string) => void;
  decorationRarity: string;
  setDecorationRarity: (value: string) => void;
  decorationOwnerId: string;
  setDecorationOwnerId: (value: string) => void;
  
  // Response state
  responseState: ResponsePanelState;
  
  // Handlers
  onNewDecoration: () => void;
  onGetDecoration: () => void;
  onGetDecorationOwner: () => void;
}

export const DecorationSection: React.FC<DecorationSectionProps> = ({
  aquariumId,
  setAquariumId,
  decorationId,
  setDecorationId,
  decorationName,
  setDecorationName,
  decorationDesc,
  setDecorationDesc,
  decorationPrice,
  setDecorationPrice,
  decorationRarity,
  setDecorationRarity,
  decorationOwnerId,
  setDecorationOwnerId,
  responseState,
  onNewDecoration,
  onGetDecoration,
  onGetDecorationOwner
}) => {
  return (
    <>
      {/* Decoration Creation/Get */}
      <DevConsoleForm title="Decoration">
        <DevConsoleInput
          placeholder="Aquarium ID"
          value={aquariumId}
          onChange={setAquariumId}
          type="number"
        />
        <DevConsoleInput
          placeholder="Name"
          value={decorationName}
          onChange={setDecorationName}
          className="mt-2"
        />
        <DevConsoleInput
          placeholder="Description"
          value={decorationDesc}
          onChange={setDecorationDesc}
          className="mt-2"
        />
        <DevConsoleInput
          placeholder="Price"
          value={decorationPrice}
          onChange={setDecorationPrice}
          type="number"
          className="mt-2"
        />
        <DevConsoleInput
          placeholder="Rarity"
          value={decorationRarity}
          onChange={setDecorationRarity}
          type="number"
          className="mt-2"
        />
        <DevConsoleButton
          onClick={onNewDecoration}
          disabled={responseState.loading}
          variant="yellow"
          className="mt-2"
        >
          New Decoration
        </DevConsoleButton>

        <DevConsoleInput
          placeholder="Decoration ID"
          value={decorationId}
          onChange={setDecorationId}
          type="number"
          className="mt-2"
        />
        <DevConsoleButton
          onClick={onGetDecoration}
          disabled={responseState.loading}
          variant="yellow"
          className="mt-2"
        >
          Get Decoration
        </DevConsoleButton>
        
        <InlineResponse state={responseState} />
      </DevConsoleForm>

      {/* Decoration Ownership */}
      <DevConsoleForm title="Decoration Ownership" borderColor="border-purple-500">
        <DevConsoleInput
          placeholder="Decoration ID"
          value={decorationOwnerId}
          onChange={setDecorationOwnerId}
          type="number"
        />
        <DevConsoleButton
          onClick={onGetDecorationOwner}
          disabled={responseState.loading}
          variant="purple"
          className="mt-2"
        >
          Get Decoration Owner
        </DevConsoleButton>
        
        <InlineResponse state={responseState} />
      </DevConsoleForm>
    </>
  );
};