import { PlayerController } from '../../src/controllers/playerController.js';

describe('PlayerController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      user: null,
      resource: null,
    };
    mockRes = {
      status: function () {
        return this;
      },
      json: function () {
        return this;
      },
    };
  });

  describe('getPlayerProfile', () => {
    it('should return player profile when resource exists', async () => {
      const mockPlayer = {
        player_id: 'player_123',
        username: 'testuser',
        level: 1,
        experience_current: 0,
      };
      mockReq.resource = mockPlayer;
      let jsonCalled = false;
      mockRes.json = data => {
        jsonCalled = true;
        expect(data.success).toBe(true);
        expect(data.data).toEqual(mockPlayer);
        return mockRes;
      };

      await PlayerController.getPlayerProfile(mockReq, mockRes);

      expect(jsonCalled).toBe(true);
    });
  });

  describe('getPlayerByWallet', () => {
    it('should return 400 when wallet address is missing', async () => {
      let statusCalled = false;
      let jsonCalled = false;
      mockRes.status = code => {
        statusCalled = true;
        expect(code).toBe(400);
        return mockRes;
      };
      mockRes.json = data => {
        jsonCalled = true;
        expect(data.error).toBe('Wallet address is required');
        return mockRes;
      };

      await PlayerController.getPlayerByWallet(mockReq, mockRes);

      expect(statusCalled).toBe(true);
      expect(jsonCalled).toBe(true);
    });
  });
});
