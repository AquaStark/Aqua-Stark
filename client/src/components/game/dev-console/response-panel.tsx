/**
 * Response Panel - Displays loading states, errors, and responses
 */

import React from 'react';
import { ResponseFormatter } from '@/systems/data-transformation-system';

export interface ResponsePanelState {
  loading: boolean;
  error: string | null;
  response: object | null;
}

interface ResponsePanelProps {
  state: ResponsePanelState;
  className?: string;
}

export const ResponsePanel: React.FC<ResponsePanelProps> = ({
  state,
  className = ''
}) => {
  const { loading, error, response } = state;

  return (
    <div className={`bg-gray-800 p-4 rounded-lg sticky top-8 h-fit ${className}`}>
      <h2 className="text-xl font-bold mb-4 text-gray-300">Response</h2>
      <div className="bg-gray-900 p-4 rounded-md min-h-[100px] max-h-[70vh] overflow-y-auto">
        {loading && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <p className="text-blue-400">Loading...</p>
          </div>
        )}
        
        {error && (
          <div className="text-red-400">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-red-500">❌</span>
              <span className="font-semibold">Error:</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm">{String(error)}</pre>
          </div>
        )}
        
        {response && !loading && (
          <div className="text-green-400">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-500">✅</span>
              <span className="font-semibold">Success:</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm">
              {ResponseFormatter.formatContractResponse(response)}
            </pre>
          </div>
        )}
        
        {!loading && !error && !response && (
          <div className="text-gray-500 flex items-center justify-center h-16">
            <div className="text-center">
              <div className="text-2xl mb-2">📋</div>
              <p>Responses will be shown here...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Simplified response panel for inline use
 */
interface InlineResponseProps {
  state: ResponsePanelState;
  className?: string;
}

export const InlineResponse: React.FC<InlineResponseProps> = ({
  state,
  className = ''
}) => {
  const { loading, error, response } = state;

  if (!loading && !error && !response) {
    return null;
  }

  return (
    <div className={`mt-2 p-2 rounded-md text-sm ${className}`}>
      {loading && (
        <div className="flex items-center space-x-2 text-blue-400">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400"></div>
          <span>Processing...</span>
        </div>
      )}
      
      {error && (
        <div className="text-red-400 bg-red-900/20 p-2 rounded">
          <span className="font-semibold">Error:</span> {String(error)}
        </div>
      )}
      
      {response && !loading && (
        <div className="text-green-400 bg-green-900/20 p-2 rounded">
          <span className="font-semibold">Success:</span> Operation completed
        </div>
      )}
    </div>
  );
};