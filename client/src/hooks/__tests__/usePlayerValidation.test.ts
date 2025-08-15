import { renderHook, act } from '@testing-library/react';
import { usePlayerValidation } from '../usePlayerValidation';
import { usePlayer } from '../dojo/usePlayer';
import { ApiClient } from '@/config/api';

// Mock the usePlayer hook
jest.mock('../dojo/usePlayer');
jest.mock('@/config/api');

describe('usePlayerValidation', () => {
  const mockGetPlayer = jest.fn();
  const mockApiClientGet = jest.fn();
  const mockApiClientPost = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (usePlayer as jest.Mock).mockReturnValue({
      getPlayer: mockGetPlayer
    });
    (ApiClient.get as jest.Mock) = mockApiClientGet;
    (ApiClient.post as jest.Mock) = mockApiClientPost;
  });

  it('should validate existing player on-chain and backend', async () => {
    const mockOnChainPlayer = { id: 123, username: 'testuser' };
    const mockBackendPlayer = { player_id: '123', wallet_address: '0x123' };
    
    mockGetPlayer.mockResolvedValue(mockOnChainPlayer);
    mockApiClientGet.mockResolvedValue({ data: mockBackendPlayer });

    const { result } = renderHook(() => usePlayerValidation());

    let validationResult;
    await act(async () => {
      validationResult = await result.current.validatePlayer('0x123');
    });

    expect(validationResult).toEqual({
      exists: true,
      isOnChain: true,
      isInBackend: true,
      playerData: mockOnChainPlayer,
      backendData: mockBackendPlayer
    });
  });

  it('should validate new player (not found anywhere)', async () => {
    mockGetPlayer.mockRejectedValue(new Error('Player not found'));
    mockApiClientGet.mockRejectedValue(new Error('Player not found'));

    const { result } = renderHook(() => usePlayerValidation());

    let validationResult;
    await act(async () => {
      validationResult = await result.current.validatePlayer('0x123');
    });

    expect(validationResult).toEqual({
      exists: false,
      isOnChain: false,
      isInBackend: false
    });
  });

  it('should validate player only on-chain (not in backend)', async () => {
    const mockOnChainPlayer = { id: 123, username: 'testuser' };
    
    mockGetPlayer.mockResolvedValue(mockOnChainPlayer);
    mockApiClientGet.mockRejectedValue(new Error('Player not found'));

    const { result } = renderHook(() => usePlayerValidation());

    let validationResult;
    await act(async () => {
      validationResult = await result.current.validatePlayer('0x123');
    });

    expect(validationResult).toEqual({
      exists: true,
      isOnChain: true,
      isInBackend: false,
      playerData: mockOnChainPlayer,
      backendData: null
    });
  });

  it('should create backend player successfully', async () => {
    const mockCreatedPlayer = { player_id: '123', wallet_address: '0x123' };
    mockApiClientPost.mockResolvedValue({ data: mockCreatedPlayer });

    const { result } = renderHook(() => usePlayerValidation());

    let createdPlayer;
    await act(async () => {
      createdPlayer = await result.current.createBackendPlayer('123', '0x123', 'testuser');
    });

    expect(createdPlayer).toEqual(mockCreatedPlayer);
    expect(mockApiClientPost).toHaveBeenCalledWith(
      expect.any(String),
      {
        playerId: '123',
        walletAddress: '0x123',
        username: 'testuser'
      }
    );
  });

  it('should sync player to backend successfully', async () => {
    const mockOnChainPlayer = { id: 123, username: 'testuser' };
    const mockSyncedPlayer = { player_id: '123', wallet_address: '0x123' };
    mockApiClientPost.mockResolvedValue({ data: mockSyncedPlayer });

    const { result } = renderHook(() => usePlayerValidation());

    let syncedPlayer;
    await act(async () => {
      syncedPlayer = await result.current.syncPlayerToBackend(mockOnChainPlayer, '0x123');
    });

    expect(syncedPlayer).toEqual(mockSyncedPlayer);
  });
});
