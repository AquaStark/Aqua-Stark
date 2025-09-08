/**
 * Player Section - Handles player registration and verification
 */

import React from 'react';
import {
  DevConsoleForm,
  DevConsoleInput,
  DevConsoleButton,
} from './dev-console-form';
import { InlineResponse, ResponsePanelState } from './response-panel';

interface PlayerSectionProps {
  // Form state
  username: string;
  setUsername: (value: string) => void;
  playerAddress: string;
  setPlayerAddress: (value: string) => void;

  // Response state
  responseState: ResponsePanelState;

  // Handlers
  onRegisterPlayer: () => void;
  onGetPlayer: () => void;
  onCheckVerification: () => void;
}

export const PlayerSection: React.FC<PlayerSectionProps> = ({
  username,
  setUsername,
  playerAddress,
  setPlayerAddress,
  responseState,
  onRegisterPlayer,
  onGetPlayer,
  onCheckVerification,
}) => {
  return (
    <>
      {/* Player Registration/Get */}
      <DevConsoleForm title='Player'>
        <DevConsoleInput
          placeholder='Username'
          value={username}
          onChange={setUsername}
        />
        <DevConsoleButton
          onClick={onRegisterPlayer}
          disabled={responseState.loading}
          variant='blue'
          className='mt-2'
        >
          Register Player
        </DevConsoleButton>

        <DevConsoleInput
          placeholder='Player Address (defaults to connected)'
          value={playerAddress}
          onChange={setPlayerAddress}
          className='mt-2'
        />
        <DevConsoleButton
          onClick={onGetPlayer}
          disabled={responseState.loading}
          variant='blue'
          className='mt-2'
        >
          Get Player
        </DevConsoleButton>

        <InlineResponse state={responseState} />
      </DevConsoleForm>

      {/* Verification */}
      <DevConsoleForm title='Verification'>
        <DevConsoleInput
          placeholder='Player Address'
          value={playerAddress}
          onChange={setPlayerAddress}
        />
        <DevConsoleButton
          onClick={onCheckVerification}
          disabled={responseState.loading}
          variant='purple'
          className='mt-2'
        >
          Check If Verified
        </DevConsoleButton>

        <InlineResponse state={responseState} />
      </DevConsoleForm>
    </>
  );
};
