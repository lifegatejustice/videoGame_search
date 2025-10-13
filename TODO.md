# TODO List for CSE341 Group Project Setup

## Project Setup
- [x] Update package.json with required dependencies (Mongoose, ESLint, Prettier, Jest, Supertest, Helmet, CORS, Rate Limiter, Cloudinary, etc.)
- [ ] Create .env file with MongoDB Atlas URI, OAuth credentials, etc.
- [x] Restructure project to src/ directory with subfolders (config, routes, controllers, services, models, middleware, utils, docs, tests)
- [x] Move existing files to appropriate src/ subfolders
- [x] Initialize ESLint and Prettier configurations
- [ ] Update server.js to use new structure

## Database Models
- [ ] Create Mongoose models for User, Game, Character, Platform
- [ ] Update database/connect.js to use Mongoose instead of native MongoDB driver

## Authentication
- [ ] Implement OAuth 2.0 with Google and GitHub using Passport
- [ ] Create auth routes and controllers
- [ ] Add auth middleware for RBAC (user vs admin)
- [ ] Implement /auth/me endpoint

## Security
- [ ] Add Helmet for secure headers
- [ ] Enable CORS for frontend origin
- [ ] Add rate limiting for auth endpoints
- [ ] Implement input validation with express-validator
- [ ] Add file upload restrictions with Cloudinary

## API Endpoints
- [ ] Implement CRUD for Users
- [ ] Implement CRUD for Games (with search, pagination, cover upload)
- [ ] Implement CRUD for Characters
- [ ] Implement CRUD for Platforms (with games list)
- [ ] Add /api/stats and /api/health endpoints

## Testing
- [ ] Set up Jest and Supertest
- [ ] Write unit tests for GET routes
- [ ] Expand to POST/PUT/DELETE with role validation
- [ ] Add security tests for unauthorized access

## GitHub and Deployment
- [ ] Create GitHub repository
- [ ] Add collaborators
- [ ] Enable branch protection
- [ ] Deploy minimal healthcheck API to Render
- [ ] Configure Render for full deployment

## Documentation
- [ ] Set up Swagger documentation
- [ ] Update README with setup instructions

## Stretch Goals (if time allows)
- [ ] Full-text search with MongoDB Atlas Search
- [ ] Real-time chat with WebSockets
- [ ] GraphQL endpoint
- [ ] Redis caching
- [ ] Admin React panel
- [ ] CI/CD with GitHub Actions
