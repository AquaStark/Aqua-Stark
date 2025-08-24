import { simpleAuth, optionalAuth } from '../../src/middleware/auth.js';

describe('Authentication Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
      params: {},
      user: null,
    };
    mockRes = {
      status: function () {
        return this;
      },
      json: function () {
        return this;
      },
    };
    mockNext = function () {};
  });

  describe('simpleAuth', () => {
    it('should pass with valid player ID in header', () => {
      mockReq.headers['x-player-id'] = 'player_123';
      let nextCalled = false;
      mockNext = () => {
        nextCalled = true;
      };

      simpleAuth(mockReq, mockRes, mockNext);

      expect(nextCalled).toBe(true);
      expect(mockReq.user).toEqual({
        playerId: 'player_123',
        authenticated: true,
      });
    });

    it('should return 401 when no player ID provided', () => {
      let statusCalled = false;
      let jsonCalled = false;
      mockRes.status = code => {
        statusCalled = true;
        expect(code).toBe(401);
        return mockRes;
      };
      mockRes.json = data => {
        jsonCalled = true;
        expect(data.error).toBe('Authentication required');
        return mockRes;
      };

      simpleAuth(mockReq, mockRes, mockNext);

      expect(statusCalled).toBe(true);
      expect(jsonCalled).toBe(true);
    });
  });

  describe('optionalAuth', () => {
    it('should set authenticated user when player ID provided', () => {
      mockReq.headers['x-player-id'] = 'player_123';
      let nextCalled = false;
      mockNext = () => {
        nextCalled = true;
      };

      optionalAuth(mockReq, mockRes, mockNext);

      expect(nextCalled).toBe(true);
      expect(mockReq.user).toEqual({
        playerId: 'player_123',
        authenticated: true,
      });
    });

    it('should set unauthenticated user when no player ID provided', () => {
      let nextCalled = false;
      mockNext = () => {
        nextCalled = true;
      };

      optionalAuth(mockReq, mockRes, mockNext);

      expect(nextCalled).toBe(true);
      expect(mockReq.user).toEqual({
        authenticated: false,
      });
    });
  });
});
