const request = require('supertest');
const app = require('../index');
const Game = require('../models/gameModel');
const User = require('../models/userModel');

describe('Games API', () => {
  let adminUser;
  let game;
  let adminToken;

  beforeEach(async () => {
    // Clear collections
    await Game.deleteMany({});
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

    // Create test game
    game = new Game({
      title: 'Test Game',
      description: 'A test game',
      createdBy: adminUser._id,
    });
    await game.save();

    // Mock JWT token
    adminToken = 'admin-jwt-token';
  });

  describe('GET /api/games', () => {
    it('should return list of games with pagination', async () => {
      const res = await request(app)
        .get('/api/games')
        .expect(200);

      expect(res.body).toHaveProperty('games');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.games)).toBe(true);
    });

    it('should support filtering by genre', async () => {
      const res = await request(app)
        .get('/api/games?genre=action')
        .expect(200);

      expect(res.body).toHaveProperty('games');
    });
  });

  describe('GET /api/games/:id', () => {
    it('should return game details', async () => {
      const res = await request(app)
        .get(`/api/games/${game._id}`)
        .expect(200);

      expect(res.body.title).toBe('Test Game');
      expect(res.body.description).toBe('A test game');
    });

    it('should return 404 for non-existent game', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .get(`/api/games/${fakeId}`)
        .expect(404);

      expect(res.body.message).toBe('Game not found');
    });
  });

  describe('POST /api/games', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/api/games')
        .send({
          title: 'New Game',
          description: 'New game description',
        })
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 403 when user is not admin', async () => {
      const res = await request(app)
        .post('/api/games')
        .set('Cookie', ['token=user-jwt-token'])
        .send({
          title: 'New Game',
          description: 'New game description',
        })
        .expect(403);

      expect(res.body.message).toBe('Admin access required');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/games')
        .set('Cookie', [`token=${adminToken}`])
        .send({})
        .expect(400);

      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('PUT /api/games/:id', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .put(`/api/games/${game._id}`)
        .send({ title: 'Updated Game' })
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 403 when user is not admin', async () => {
      const res = await request(app)
        .put(`/api/games/${game._id}`)
        .set('Cookie', ['token=user-jwt-token'])
        .send({ title: 'Updated Game' })
        .expect(403);

      expect(res.body.message).toBe('Admin access required');
    });
  });

  describe('DELETE /api/games/:id', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .delete(`/api/games/${game._id}`)
        .expect(401);

      expect(res.body.message).toBe('Access token required');
    });

    it('should return 403 when user is not admin', async () => {
      const res = await request(app)
        .delete(`/api/games/${game._id}`)
        .set('Cookie', ['token=user-jwt-token'])
        .expect(403);

      expect(res.body.message).toBe('Admin access required');
    });
  });

  describe('GET /api/games/search', () => {
    it('should return 400 when no search term provided', async () => {
      const res = await request(app)
        .get('/api/games/search')
        .expect(400);

      expect(res.body.message).toBe('Search term required');
    });

    it('should return search results', async () => {
      const res = await request(app)
        .get('/api/games/search?q=test')
        .expect(200);

      expect(res.body).toHaveProperty('games');
      expect(res.body).toHaveProperty('pagination');
    });
  });
});
