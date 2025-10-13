const request = require('supertest');
const app = require('../index');
const User = require('../models/userModel');

describe('Authentication', () => {
  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  describe('GET /auth/me', () => {
    it('should return 401 when no token provided', async () => {
      const res = await request(app)
        .get('/auth/me')
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 401 when invalid token provided', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Cookie', ['token=invalidtoken'])
        .expect(401);

      expect(res.body.message).toBe('Invalid token');
    });
  });

  describe('POST /auth/logout', () => {
    it('should clear cookie and return success message', async () => {
      const res = await request(app)
        .get('/auth/logout')
        .expect(200);

      expect(res.body.message).toBe('Logged out successfully');
    });
  });
});
