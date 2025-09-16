import { useState, useCallback, useRef, useEffect } from 'react';
import { ENV_CONFIG } from '@/config/environment';

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
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cacheTTL?: number;
  headers?: Record<string, string>;
}

// Types for API response
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  success: boolean;
  error?: string;
}

// Types for API error
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
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
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  headers?: Record<string, string>;
  cache?: boolean;
  timeout?: number;
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
 * Unified API hook for handling HTTP requests
 * @param config - API configuration options
 * @returns Object with API methods and state
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
   * Clear cache entries that have expired
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
   * Generate cache key from request options
   */
  const getCacheKey = useCallback((options: RequestOptions): string => {
    return `${options.method}:${options.url}:${JSON.stringify(
      options.data || {}
    )}`;
  }, []);

  /**
   * Get cached response if available and valid
   */
  const getCachedResponse = useCallback(<T>(
    options: RequestOptions
  ): T | null => {
    if (!options.cache) return null;

    clearExpiredCache();
    const cacheKey = getCacheKey(options);
    const cached = cacheRef.current.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    return null;
  }, [clearExpiredCache, getCacheKey]);

  /**
   * Store response in cache
   */
  const setCachedResponse = useCallback(<T>(
    options: RequestOptions,
    data: T
  ): void => {
    if (!options.cache) return;

    const cacheKey = getCacheKey(options);
    cacheRef.current.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: apiConfig.cacheTTL,
    });
  }, [getCacheKey, apiConfig.cacheTTL]);

  /**
   * Validate response data
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
   * Make HTTP request with retry logic
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
        apiResponse.error = responseData?.message || response.statusText;
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
        await new Promise((resolve) =>
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
  }, [apiConfig, getCachedResponse, setCachedResponse, validateResponse]);

  /**
   * GET request
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
  }, [makeRequest]);

  /**
   * POST request
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
  }, [makeRequest]);

  /**
   * PUT request
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
  }, [makeRequest]);

  /**
   * DELETE request
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
  }, [makeRequest]);

  /**
   * Clear all cached data
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  /**
   * Cancel ongoing request
   */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Clear error state
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
 * Hook for making a single API request
 * @param options - Request options
 * @returns Object with request function and state
 */
export function useApiRequest<T = any>(options: RequestOptions) {
  const { get, post, put, delete: del, loading, error, clearError } = useApi();

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
