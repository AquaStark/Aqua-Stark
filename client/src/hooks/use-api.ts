import { useState, useCallback, useRef, useEffect } from 'react';
import { ENV_CONFIG } from '@/constants';

/**
 * @file use-api.ts
 * @description
 * Unified hook for handling API calls with built-in error handling, loading states,
 * caching, and response validation. Centralizes all HTTP request logic to avoid
 * duplication across components.
 *
 * Features:
 * - GET, POST, PUT, DELETE methods
 * - Automatic loading state management
 * - Error handling with retry logic
 * - Response caching with TTL
 * - Request/response validation
 * - Request cancellation
 * - TypeScript support
 *
 * @category Hooks
 */

// Types for API configuration
export interface ApiConfig {
  /**
   * The base URL for the API.
   * @example 'https://api.example.com/v1'
   */
  baseURL?: string;
  /**
   * The request timeout in milliseconds.
   * @default 10000
   */
  timeout?: number;
  /**
   * The number of retries for failed requests.
   * @default 3
   */
  retries?: number;
  /**
   * The delay between retries in milliseconds.
   * @default 1000
   */
  retryDelay?: number;
  /**
   * The time-to-live (TTL) for cached responses in milliseconds.
   * @default 300000 (5 minutes)
   */
  cacheTTL?: number;
  /**
   * Default headers to be included in every request.
   * @example { 'Authorization': 'Bearer token' }
   */
  headers?: Record<string, string>;
}

// Types for API response
export interface ApiResponse<T = any> {
  /** The response data, parsed as JSON or text. */
  data: T;
  /** The HTTP status code of the response. */
  status: number;
  /** The HTTP status text of the response. */
  statusText: string;
  /** All headers from the response. */
  headers: Record<string, string>;
  /** Indicates if the request was successful (status code 2xx). */
  success: boolean;
  /** An error message if the request failed. */
  error?: string;
}

// Types for API error
export interface ApiError {
  /** The error message. */
  message: string;
  /** The HTTP status code (if available). */
  status?: number;
  /** An error code or name (e.g., 'AbortError'). */
  code?: string;
  /** Additional details about the error. */
  details?: any;
}

// Types for cache entry
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Types for request options
export interface RequestOptions {
  /** The HTTP method. */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** The URL path. */
  url: string;
  /** The data to be sent with the request (body for POST/PUT, params for GET). */
  data?: any;
  /** Headers specific to this request. */
  headers?: Record<string, string>;
  /**
   * Indicates whether the response should be cached.
   * @default false for POST/PUT/DELETE, true for GET.
   */
  cache?: boolean;
  /** The request timeout in milliseconds. Overrides global config. */
  timeout?: number;
  /** The number of retries for this request. Overrides global config. */
  retries?: number;
}

// Default configuration
const DEFAULT_CONFIG: Required<ApiConfig> = {
  baseURL: ENV_CONFIG.API_URL,
  timeout: ENV_CONFIG.API_TIMEOUT,
  retries: 3,
  retryDelay: 1000,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * A unified hook for handling API calls with a focus on simplicity, error handling,
 * caching, and state management.
 *
 * @param config - Optional configuration to override default API settings.
 * @returns An object containing HTTP methods and state properties.
 *
 * @example
 * ```tsx
 * import { useApi } from '@/hooks/use-api';
 *
 * function MyComponent() {
 * const { get, post, loading, error, clearError } = useApi();
 *
 * const fetchData = async () => {
 * try {
 * const response = await get('/users/123');
 * console.log('User data:', response.data);
 * } catch (err) {
 * console.error('Failed to fetch user:', err);
 * }
 * };
 *
 * const createPost = async () => {
 * try {
 * const response = await post('/posts', { title: 'New Post' });
 * console.log('Post created:', response.data);
 * } catch (err) {
 * console.error('Failed to create post:', err);
 * }
 * };
 *
 * // JSX rendering...
 * }
 * ```
 */
export function useApi(config: ApiConfig = {}) {
  // Merge user config with defaults
  const apiConfig = { ...DEFAULT_CONFIG, ...config };

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Cache storage
  const cacheRef = useRef<Map<string, CacheEntry<any>>>(new Map());

  // Abort controller for request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Clears cache entries that have expired.
   * @private
   */
  const clearExpiredCache = useCallback(() => {
    const now = Date.now();
    const cache = cacheRef.current;

    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        cache.delete(key);
      }
    }
  }, []);

  /**
   * Generates a unique cache key from request options.
   * @private
   * @param options - The request options.
   * @returns The generated cache key.
   */
  const getCacheKey = useCallback((options: RequestOptions): string => {
    return `${options.method}:${options.url}:${JSON.stringify(
      options.data || {}
    )}`;
  }, []);

  /**
   * Retrieves a cached response if available and valid.
   * @private
   * @param options - The request options.
   * @returns The cached data or `null` if not found or expired.
   */
  const getCachedResponse = useCallback(
    <T>(options: RequestOptions): T | null => {
      if (!options.cache) return null;

      clearExpiredCache();
      const cacheKey = getCacheKey(options);
      const cached = cacheRef.current.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }

      return null;
    },
    [clearExpiredCache, getCacheKey]
  );

  /**
   * Stores a successful response in the cache.
   * @private
   * @param options - The request options.
   * @param data - The data to cache.
   */
  const setCachedResponse = useCallback(
    <T>(options: RequestOptions, data: T): void => {
      if (!options.cache) return;

      const cacheKey = getCacheKey(options);
      cacheRef.current.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl: apiConfig.cacheTTL,
      });
    },
    [getCacheKey, apiConfig.cacheTTL]
  );

  /**
   * Validates the response data for common error patterns.
   * @private
   * @param data - The data to validate.
   * @returns `true` if the data is valid, `false` otherwise.
   */
  const validateResponse = useCallback((data: any): boolean => {
    // Basic validation - can be extended based on needs
    if (data === null || data === undefined) {
      return false;
    }

    // Check for common error patterns
    if (typeof data === 'object' && data.error) {
      return false;
    }

    return true;
  }, []);

  /**
   * Internal function to make the HTTP request with retry logic.
   * @private
   * @param options - The request options.
   * @param attempt - The current retry attempt.
   * @returns A promise that resolves with the API response.
   * @throws {ApiError} Throws an ApiError object on failure.
   */
  const makeRequest = useCallback(
    async <T>(
      options: RequestOptions,
      attempt: number = 1
    ): Promise<ApiResponse<T>> => {
      try {
        // Check cache first for GET requests
        if (options.method === 'GET' && attempt === 1) {
          const cached = getCachedResponse<T>(options);
          if (cached) {
            return {
              data: cached,
              status: 200,
              statusText: 'OK',
              headers: {},
              success: true,
            };
          }
        }

        // Create abort controller for this request
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        // Build request URL
        const url = options.url.startsWith('http')
          ? options.url
          : `${apiConfig.baseURL}${options.url}`;

        // Build request options
        const requestOptions: RequestInit = {
          method: options.method,
          headers: {
            ...apiConfig.headers,
            ...options.headers,
          },
          signal: abortController.signal,
        };

        // Add body for non-GET requests
        if (options.data && options.method !== 'GET') {
          requestOptions.body = JSON.stringify(options.data);
        }

        // Add query parameters for GET requests
        let finalUrl = url;
        if (options.data && options.method === 'GET') {
          const params = new URLSearchParams(options.data);
          finalUrl = `${url}?${params}`;
        }

        // Make the request
        const response = await fetch(finalUrl, requestOptions);

        // Parse response
        let responseData: T;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = (await response.text()) as unknown as T;
        }

        // Validate response
        if (!validateResponse(responseData)) {
          throw new Error('Invalid response data received');
        }

        // Create response object
        const apiResponse: ApiResponse<T> = {
          data: responseData,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          success: response.ok,
        };

        // Handle non-2xx responses
        if (!response.ok) {
          apiResponse.error =
            (responseData as any)?.message || response.statusText;
          throw new Error(apiResponse.error);
        }

        // Cache successful GET responses
        if (options.method === 'GET' && options.cache !== false) {
          setCachedResponse(options, responseData);
        }

        return apiResponse;
      } catch (error) {
        // Handle abort errors
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request was cancelled');
        }

        // Retry logic
        if (attempt < (options.retries || apiConfig.retries)) {
          await new Promise(resolve =>
            setTimeout(resolve, apiConfig.retryDelay * attempt)
          );
          return makeRequest<T>(options, attempt + 1);
        }

        // Create error object
        const apiError: ApiError = {
          message:
            error instanceof Error ? error.message : 'Unknown error occurred',
          status: error instanceof Response ? error.status : undefined,
          code: error instanceof Error ? error.name : undefined,
          details: error,
        };

        throw apiError;
      }
    },
    [apiConfig, getCachedResponse, setCachedResponse, validateResponse]
  );

  /**
   * Performs an HTTP GET request.
   *
   * @template T The expected type of the response data.
   * @param url - The URL path to fetch from.
   * @param params - Optional query parameters.
   * @param options - Optional request options to override global config.
   * @returns A promise that resolves with the API response.
   * @throws {ApiError} Throws an ApiError object on failure.
   *
   * @example
   * ```ts
   * const response = await get<User[]>('/users');
   * console.log(response.data); // Array of users
   * ```
   */
  const get = useCallback(
    async <T>(
      url: string,
      params?: Record<string, any>,
      options: Partial<RequestOptions> = {}
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        const requestOptions: RequestOptions = {
          method: 'GET',
          url,
          data: params,
          cache: true,
          ...options,
        };

        const response = await makeRequest<T>(requestOptions);
        return response;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  /**
   * Performs an HTTP POST request.
   *
   * @template T The expected type of the response data.
   * @param url - The URL path to post to.
   * @param data - The data to be sent in the request body.
   * @param options - Optional request options.
   * @returns A promise that resolves with the API response.
   * @throws {ApiError} Throws an ApiError object on failure.
   *
   * @example
   * ```ts
   * const response = await post<Product>('/products', { name: 'New Item' });
   * console.log(response.data); // The created product object
   * ```
   */
  const post = useCallback(
    async <T>(
      url: string,
      data?: any,
      options: Partial<RequestOptions> = {}
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        const requestOptions: RequestOptions = {
          method: 'POST',
          url,
          data,
          cache: false,
          ...options,
        };

        const response = await makeRequest<T>(requestOptions);
        return response;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  /**
   * Performs an HTTP PUT request.
   *
   * @template T The expected type of the response data.
   * @param url - The URL path to put to.
   * @param data - The data to be sent in the request body.
   * @param options - Optional request options.
   * @returns A promise that resolves with the API response.
   * @throws {ApiError} Throws an ApiError object on failure.
   *
   * @example
   * ```ts
   * const response = await put<User>('/users/123', { name: 'Jane Doe' });
   * console.log(response.data); // The updated user object
   * ```
   */
  const put = useCallback(
    async <T>(
      url: string,
      data?: any,
      options: Partial<RequestOptions> = {}
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        const requestOptions: RequestOptions = {
          method: 'PUT',
          url,
          data,
          cache: false,
          ...options,
        };

        const response = await makeRequest<T>(requestOptions);
        return response;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  /**
   * Performs an HTTP DELETE request.
   *
   * @template T The expected type of the response data.
   * @param url - The URL path to delete from.
   * @param options - Optional request options.
   * @returns A promise that resolves with the API response.
   * @throws {ApiError} Throws an ApiError object on failure.
   *
   * @example
   * ```ts
   * const response = await del<void>('/posts/456');
   * console.log(response.status); // 204 (No Content)
   * ```
   */
  const del = useCallback(
    async <T>(
      url: string,
      options: Partial<RequestOptions> = {}
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        const requestOptions: RequestOptions = {
          method: 'DELETE',
          url,
          cache: false,
          ...options,
        };

        const response = await makeRequest<T>(requestOptions);
        return response;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  /**
   * Clears all cached data from memory.
   * @returns {void}
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  /**
   * Cancels any ongoing API request.
   * @returns {void}
   */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Clears the current error state.
   * @returns {void}
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelRequest();
    };
  }, [cancelRequest]);

  return {
    // HTTP methods
    get,
    post,
    put,
    delete: del,

    // State
    loading,
    error,

    // Utilities
    clearCache,
    clearError,
    cancelRequest,
  };
}

/**
 * A specialized hook for making a single, one-off API request.
 * It simplifies the API call pattern for components that only need to fetch
 * data once, such as on component mount.
 *
 * @template T The expected type of the response data.
 * @param options - The full request options for the API call.
 * @returns An object containing the request function, loading state, and error state.
 *
 * @example
 * ```tsx
 * import { useApiRequest } from '@/hooks/use-api';
 * import { useEffect } from 'react';
 *
 * function PostComponent({ postId }) {
 * const { makeRequest, loading, error } = useApiRequest({
 * method: 'GET',
 * url: `/posts/${postId}`,
 * });
 *
 * useEffect(() => {
 * const fetchPost = async () => {
 * try {
 * const response = await makeRequest();
 * console.log('Post data:', response.data);
 * } catch (err) {
 * console.error('Failed to fetch post:', err);
 * }
 * };
 * fetchPost();
 * }, [makeRequest]);
 *
 * // JSX rendering based on loading/error state
 * }
 * ```
 */
export function useApiRequest<T = any>(options: RequestOptions) {
  const { get, post, put, delete: del, loading, error, clearError } = useApi();

  /**
   * Executes the API request based on the provided options.
   * @returns A promise that resolves with the API response.
   * @throws {Error} Throws an error if the HTTP method is not supported.
   *
   * @example
   * ```ts
   * // Inside a component
   * const { makeRequest } = useApiRequest({ method: 'GET', url: '/data' });
   * const handleClick = () => makeRequest().then(res => console.log(res));
   * ```
   */
  const makeRequest = useCallback(async (): Promise<ApiResponse<T>> => {
    switch (options.method) {
      case 'GET':
        return get<T>(options.url, options.data, options);
      case 'POST':
        return post<T>(options.url, options.data, options);
      case 'PUT':
        return put<T>(options.url, options.data, options);
      case 'DELETE':
        return del<T>(options.url, options);
      default:
        throw new Error(`Unsupported HTTP method: ${options.method}`);
    }
  }, [options, get, post, put, del]);

  return {
    makeRequest,
    loading,
    error,
    clearError,
  };
}

export default useApi;
