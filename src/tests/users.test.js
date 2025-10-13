const request = require('supertest');
const app = require('../index');
const User = require('../models/userModel');

describe('Users API', () => {
  let adminUser;
  let regularUser;
  let adminToken;
  let userToken;

  beforeEach(async () => {
    // Clear users collection
    await User.deleteMany({});

    // Create test users
    adminUser = new User({
      oauthProvider: 'google',
      providerId: 'admin123',
      username: 'admin',
      email: 'admin@test.com',
      role: 'admin',
    });
    await adminUser.save();

    regularUser = new User({
      oauthProvider: 'google',
      providerId: 'user123',
      username: 'user',
      email: 'user@test.com',
      role: 'user',
    });
    await regularUser.save();

    // Mock JWT tokens (in real tests, you'd generate proper tokens)
    adminToken = 'admin-jwt-token';
    userToken = 'user-jwt-token';
  });

  describe('GET /api/users', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/users')
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 403 when user is not admin', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Cookie', [`token=${userToken}`])
        .expect(403);

      expect(res.body.message).toBe('Admin access required');
    });

    // Note: Full admin test would require proper JWT mocking
  });

  describe('GET /api/users/:userId', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get(`/api/users/${regularUser._id}`)
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .get(`/api/users/${fakeId}`)
        .set('Cookie', [`token=${userToken}`])
        .expect(404);

      expect(res.body.message).toBe('User not found');
    });
  });

  describe('PUT /api/users/:userId', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .put(`/api/users/${regularUser._id}`)
        .send({ username: 'newname' })
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 403 when user tries to update another user', async () => {
      const res = await request(app)
        .put(`/api/users/${adminUser._id}`)
        .set('Cookie', [`token=${userToken}`])
        .send({ username: 'hacked' })
        .expect(403);

      expect(res.body.message).toBe('Access denied');
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .delete(`/api/users/${regularUser._id}`)
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 403 when user tries to delete another user', async () => {
      const res = await request(app)
        .delete(`/api/users/${adminUser._id}`)
        .set('Cookie', [`token=${userToken}`])
        .expect(403);

      expect(res.body.message).toBe('Access denied');
    });
  });
});
