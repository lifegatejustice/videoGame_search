const request = require('supertest');
const app = require('../index');
const Character = require('../models/characterModel');
const User = require('../models/userModel');

describe('Characters API', () => {
  let adminUser;
  let character;
  let adminToken;

  beforeEach(async () => {
    // Clear collections
    await Character.deleteMany({});
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

    // Create test character
    character = new Character({
      name: 'Test Character',
      bio: 'A test character',
    });
    await character.save();

    // Mock JWT token
    adminToken = 'admin-jwt-token';
  });

  describe('GET /api/characters', () => {
    it('should return list of characters with pagination', async () => {
      const res = await request(app)
        .get('/api/characters')
        .expect(200);

      expect(res.body).toHaveProperty('characters');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.characters)).toBe(true);
    });

    it('should handle invalid page parameter', async () => {
      const res = await request(app)
        .get('/api/characters?page=invalid')
        .expect(400);

      expect(res.body.message).toBe('Invalid query parameters');
    });

    it('should handle invalid limit parameter', async () => {
      const res = await request(app)
        .get('/api/characters?limit=invalid')
        .expect(400);

      expect(res.body.message).toBe('Invalid query parameters');
    });

    it('should return empty array when no characters exist', async () => {
      await Character.deleteMany({});
      const res = await request(app)
        .get('/api/characters')
        .expect(200);

      expect(res.body.characters).toEqual([]);
      expect(res.body.pagination.total).toBe(0);
    });
  });

  describe('GET /api/characters/:id', () => {
    it('should return character details', async () => {
      const res = await request(app)
        .get(`/api/characters/${character._id}`)
        .expect(200);

      expect(res.body.name).toBe('Test Character');
      expect(res.body.bio).toBe('A test character');
    });

    it('should return 404 for non-existent character', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .get(`/api/characters/${fakeId}`)
        .expect(404);

      expect(res.body.message).toBe('Character not found');
    });

    it('should handle invalid character ID format', async () => {
      const res = await request(app)
        .get('/api/characters/invalid-id')
        .expect(400);

      expect(res.body.message).toBe('Invalid character ID format');
    });
  });

  describe('POST /api/characters', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/api/characters')
        .send({
          name: 'New Character',
          bio: 'New character bio',
        })
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 403 when user is not admin', async () => {
      const res = await request(app)
        .post('/api/characters')
        .set('Cookie', ['token=user-jwt-token'])
        .send({
          name: 'New Character',
          bio: 'New character bio',
        })
        .expect(403);

      expect(res.body.message).toBe('Admin access required');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/characters')
        .set('Cookie', [`token=${adminToken}`])
        .send({})
        .expect(400);

      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('PUT /api/characters/:id', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .put(`/api/characters/${character._id}`)
        .send({ name: 'Updated Character' })
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 403 when user is not admin', async () => {
      const res = await request(app)
        .put(`/api/characters/${character._id}`)
        .set('Cookie', ['token=user-jwt-token'])
        .send({ name: 'Updated Character' })
        .expect(403);

      expect(res.body.message).toBe('Admin access required');
    });
  });

  describe('DELETE /api/characters/:id', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .delete(`/api/characters/${character._id}`)
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 403 when user is not admin', async () => {
      const res = await request(app)
        .delete(`/api/characters/${character._id}`)
        .set('Cookie', ['token=user-jwt-token'])
        .expect(403);

      expect(res.body.message).toBe('Admin access required');
    });
  });
});
