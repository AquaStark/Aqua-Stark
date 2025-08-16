/**
 * Movement Section - Handles moving fish and decorations between aquariums
 */

import React from 'react';
import { DevConsoleForm, DevConsoleInput, DevConsoleButton } from './dev-console-form';
import { InlineResponse, ResponsePanelState } from './response-panel';

interface MovementSectionProps {
  // Form state
  fishId: string;
  setFishId: (value: string) => void;
  decorationId: string;
  setDecorationId: (value: string) => void;
  fromAquariumId: string;
  setFromAquariumId: (value: string) => void;
  toAquariumId: string;
  setToAquariumId: (value: string) => void;
  
  // Response state
  responseState: ResponsePanelState;
  
  // Handlers
  onMoveFish: () => void;
  onMoveDecoration: () => void;
}

export const MovementSection: React.FC<MovementSectionProps> = ({
  fishId,
  setFishId,
  decorationId,
  setDecorationId,
  fromAquariumId,
  setFromAquariumId,
  toAquariumId,
  setToAquariumId,
  responseState,
  onMoveFish,
  onMoveDecoration
}) => {
  return (
    <>
      {/* Move Fish */}
      <DevConsoleForm title="Move Fish" borderColor="border-blue-500">
        <DevConsoleInput
          placeholder="Fish ID"
          value={fishId}
          onChange={setFishId}
          type="number"
        />
        <DevConsoleInput
          placeholder="From Aquarium ID"
          value={fromAquariumId}
          onChange={setFromAquariumId}
          type="number"
          className="mt-2"
        />
        <DevConsoleInput
          placeholder="To Aquarium ID"
          value={toAquariumId}
          onChange={setToAquariumId}
          type="number"
          className="mt-2"
        />
        <DevConsoleButton
          onClick={onMoveFish}
          disabled={responseState.loading}
          variant="blue"
          className="mt-2"
        >
          Move Fish
        </DevConsoleButton>
        
        <InlineResponse state={responseState} />
      </DevConsoleForm>

      {/* Move Decoration */}
      <DevConsoleForm title="Move Decoration" borderColor="border-yellow-500">
        <DevConsoleInput
          placeholder="Decoration ID"
          value={decorationId}
          onChange={setDecorationId}
          type="number"
        />
        <DevConsoleInput
          placeholder="From Aquarium ID"
          value={fromAquariumId}
          onChange={setFromAquariumId}
          type="number"
          className="mt-2"
        />
        <DevConsoleInput
          placeholder="To Aquarium ID"
          value={toAquariumId}
          onChange={setToAquariumId}
          type="number"
          className="mt-2"
        />
        <DevConsoleButton
          onClick={onMoveDecoration}
          disabled={responseState.loading}
          variant="yellow"
          className="mt-2"
        >
          Move Decoration
        </DevConsoleButton>
        
        <InlineResponse state={responseState} />
      </DevConsoleForm>
    </>
  );
};