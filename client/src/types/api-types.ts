// API request and response types
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Generic request data type
export type RequestData = Record<string, unknown>;

// Player API types
export interface PlayerCreateRequest {
  walletAddress: string;
  username?: string;
  preferences?: Record<string, unknown>;
}

export interface PlayerProfileResponse {
  id: string;
  walletAddress: string;
  username: string;
  experience: number;
  level: number;
  currency: number;
  lastLogin: string;
  preferences: Record<string, unknown>;
}

// Fish API types
export interface FishStateRequest {
  fishId: number;
  state: 'idle' | 'swimming' | 'eating' | 'rejecting';
  hunger?: number;
  happiness?: number;
  energy?: number;
}

export interface FishFeedRequest {
  fishId: number;
  foodType: string;
  amount: number;
}

// Decoration API types
export interface DecorationPlaceRequest {
  decorationId: number;
  aquariumId: number;
  position: {
    x: number;
    y: number;
  };
  rotation?: number;
}

export interface DecorationMoveRequest {
  decorationId: number;
  position: {
    x: number;
    y: number;
  };
  rotation?: number;
}
