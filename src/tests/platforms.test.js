const request = require('supertest');
const app = require('../index');
const Platform = require('../models/platformModel');
const User = require('../models/userModel');

describe('Platforms API', () => {
  let adminUser;
  let platform;
  let adminToken;

  beforeEach(async () => {
    // Clear collections
    await Platform.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    adminUser = new User({
      oauthProvider: 'google',
      providerId: 'admin123',
      username: 'admin',
      email: 'admin@test.com',
      role: 'admin',
    });
    await adminUser.save();

    // Create test platform
    platform = new Platform({
      name: 'Test Platform',
      manufacturer: 'Test Manufacturer',
      releaseYear: 2020,
      type: 'console',
    });
    await platform.save();

    // Mock JWT token
    adminToken = 'admin-jwt-token';
  });

  describe('GET /api/platforms', () => {
    it('should return list of platforms with pagination', async () => {
      const res = await request(app)
        .get('/api/platforms')
        .expect(200);

      expect(res.body).toHaveProperty('platforms');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.platforms)).toBe(true);
    });

    it('should handle invalid page parameter', async () => {
      const res = await request(app)
        .get('/api/platforms?page=invalid')
        .expect(400);

      expect(res.body.message).toBe('Invalid query parameters');
    });

    it('should handle invalid limit parameter', async () => {
      const res = await request(app)
        .get('/api/platforms?limit=invalid')
        .expect(400);

      expect(res.body.message).toBe('Invalid query parameters');
    });

    it('should return empty array when no platforms exist', async () => {
      await Platform.deleteMany({});
      const res = await request(app)
        .get('/api/platforms')
        .expect(200);

      expect(res.body.platforms).toEqual([]);
      expect(res.body.pagination.total).toBe(0);
    });
  });

  describe('GET /api/platforms/:id', () => {
    it('should return platform details', async () => {
      const res = await request(app)
        .get(`/api/platforms/${platform._id}`)
        .expect(200);

      expect(res.body.name).toBe('Test Platform');
      expect(res.body.manufacturer).toBe('Test Manufacturer');
    });

    it('should return 404 for non-existent platform', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .get(`/api/platforms/${fakeId}`)
        .expect(404);

      expect(res.body.message).toBe('Platform not found');
    });

    it('should handle invalid platform ID format', async () => {
      const res = await request(app)
        .get('/api/platforms/invalid-id')
        .expect(400);

      expect(res.body.message).toBe('Invalid platform ID format');
    });
  });

  describe('POST /api/platforms', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/api/platforms')
        .send({
          name: 'New Platform',
          manufacturer: 'New Manufacturer',
          releaseYear: 2023,
          type: 'console',
        })
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 403 when user is not admin', async () => {
      const res = await request(app)
        .post('/api/platforms')
        .set('Cookie', ['token=user-jwt-token'])
        .send({
          name: 'New Platform',
          manufacturer: 'New Manufacturer',
          releaseYear: 2023,
          type: 'console',
        })
        .expect(403);

      expect(res.body.message).toBe('Admin access required');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/platforms')
        .set('Cookie', [`token=${adminToken}`])
        .send({})
        .expect(400);

      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('PUT /api/platforms/:id', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .put(`/api/platforms/${platform._id}`)
        .send({ name: 'Updated Platform' })
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 403 when user is not admin', async () => {
      const res = await request(app)
        .put(`/api/platforms/${platform._id}`)
        .set('Cookie', ['token=user-jwt-token'])
        .send({ name: 'Updated Platform' })
        .expect(403);

      expect(res.body.message).toBe('Admin access required');
    });
  });

  describe('DELETE /api/platforms/:id', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .delete(`/api/platforms/${platform._id}`)
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 403 when user is not admin', async () => {
      const res = await request(app)
        .delete(`/api/platforms/${platform._id}`)
        .set('Cookie', ['token=user-jwt-token'])
        .expect(403);

      expect(res.body.message).toBe('Admin access required');
    });
  });

  describe('GET /api/platforms/:id/games', () => {
    it('should return games for platform', async () => {
      const res = await request(app)
        .get(`/api/platforms/${platform._id}/games`)
        .expect(200);

      expect(res.body).toHaveProperty('games');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.games)).toBe(true);
    });

    it('should handle invalid platform ID format', async () => {
      const res = await request(app)
        .get('/api/platforms/invalid-id/games')
        .expect(400);

      expect(res.body.message).toBe('Invalid platform ID format');
    });
  });
});
