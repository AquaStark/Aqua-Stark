/**
 * Contract Request System
 * Handles async contract calls with loading states, error handling, and response management
 */

export interface RequestState<T = unknown> {
  loading: boolean;
  error: string | null;
  response: T | null;
}

export interface RequestHandlerOptions<T = unknown> {
  onStart?: () => void;
  onSuccess?: (result: T) => void;
  onError?: (error: string) => void;
  onFinally?: () => void;
}

/**
 * Generic handler for contract requests with standardized error handling
 */
export async function handleContractRequest<T>(
  request: () => Promise<T>,
  operationName: string,
  options: RequestHandlerOptions<T> = {}
): Promise<{ success: boolean; result: T | null; error: string | null }> {
  const { onStart, onSuccess, onError, onFinally } = options;

  try {
    onStart?.();

    console.log(`🔄 Starting ${operationName}`);
    const result = await request();
    console.log(`✅ ${operationName} result`, result);

    onSuccess?.(result);

    return { success: true, result, error: null };
  } catch (err: unknown) {
    console.error(`❌ ${operationName} error`, err);

    // Extract readable error message from Cairo/StarkNet errors
    const errorMessage = extractErrorMessage(err);
    console.error(`💥 ${operationName} failed:`, errorMessage);

    // Log to error reporting service if available
    // Could add error reporting service integration here

    onError?.(errorMessage);

    return { success: false, result: null, error: errorMessage };
  } finally {
    onFinally?.();
  }
}

/**
 * Extract human-readable error message from various error types
 */
function extractErrorMessage(err: unknown): string {
  if (typeof err === 'string') {
    return err;
  }

  if (err instanceof Error) {
    // Try to extract Cairo/StarkNet revert messages
    const feltError = /revert with "([^"]+)"/;
    const match = err.message.match(feltError);

    if (match) {
      return match[1];
    }

    return err.message || 'An unknown error occurred.';
  }

  return 'An unknown error occurred.';
}

/**
 * Hook-like interface for managing request state
 */
export class RequestStateManager<T = unknown> {
  private state: RequestState<T> = {
    loading: false,
    error: null,
    response: null,
  };

  private listeners: Set<(state: RequestState<T>) => void> = new Set();

  constructor() {
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.executeRequest = this.executeRequest.bind(this);
  }

  setState(newState: Partial<RequestState<T>>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  getState(): RequestState<T> {
    return { ...this.state };
  }

  subscribe(listener: (state: RequestState<T>) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async executeRequest(
    request: () => Promise<T>,
    operationName: string
  ): Promise<{ success: boolean; result: T | null; error: string | null }> {
    return handleContractRequest(request, operationName, {
      onStart: () => {
        this.setState({
          loading: true,
          error: null,
          response: null,
        });
      },
      onSuccess: (result: T) => {
        this.setState({
          loading: false,
          response: result,
          error: null,
        });
      },
      onError: (error: string) => {
        this.setState({
          loading: false,
          error,
          response: null,
        });
      },
      onFinally: () => {
        // Loading state is handled in onSuccess/onError
      },
    });
  }
}
