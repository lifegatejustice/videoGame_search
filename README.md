# CSE341 Group Project - Games API

A comprehensive REST API for managing games, characters, platforms, and users with OAuth authentication, built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: OAuth 2.0 with Google and GitHub
- **CRUD Operations**: Full CRUD for Games, Characters, Platforms, and Users
- **Security**: Helmet, CORS, rate limiting, input validation
- **File Uploads**: Cloudinary integration for game covers and character portraits
- **Search**: Full-text search for games
- **Pagination**: Efficient pagination for large datasets
- **Role-based Access**: User and admin roles
- **Testing**: Jest and Supertest for comprehensive testing
- **Documentation**: Swagger API documentation

## Project Structure

```
src/
├── config/          # Database and OAuth configuration
├── controllers/     # Route handlers
├── middleware/      # Authentication, validation, error handling
├── models/          # Mongoose schemas
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helper functions and utilities
├── docs/            # Swagger documentation
└── tests/           # Unit and integration tests
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Google OAuth credentials
- GitHub OAuth credentials
- Cloudinary account (optional, for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cse341-w06-w07-group-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables in `.env`:
   - MongoDB Atlas connection string
   - OAuth credentials (Google & GitHub)
   - JWT secret
   - Cloudinary credentials (optional)

4. **Database Setup**
   - Create a MongoDB Atlas cluster
   - Create database: `CSE341_Group`
   - Import sample data from `json/` folder into collections

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

### Production

```bash
# Build for production
npm start
```

## API Endpoints

### Authentication
- `GET /auth/google` - Google OAuth login
- `GET /auth/github` - GitHub OAuth login
- `GET /auth/logout` - Logout
- `GET /auth/me` - Get current user

### Games
- `GET /api/games` - List games (with filters & pagination)
- `POST /api/games` - Create game (admin)
- `GET /api/games/:id` - Get game details
- `PUT /api/games/:id` - Update game (admin)
- `DELETE /api/games/:id` - Delete game (admin)
- `GET /api/games/search` - Search games

### Characters
- `GET /api/characters` - List characters
- `POST /api/characters` - Create character (admin)
- `GET /api/characters/:id` - Get character details
- `PUT /api/characters/:id` - Update character (admin)
- `DELETE /api/characters/:id` - Delete character (admin)

### Platforms
- `GET /api/platforms` - List platforms
- `POST /api/platforms` - Create platform (admin)
- `GET /api/platforms/:id` - Get platform details
- `PUT /api/platforms/:id` - Update platform (admin)
- `DELETE /api/platforms/:id` - Delete platform (admin)
- `GET /api/platforms/:id/games` - Get games by platform

### Users
- `GET /api/users` - List users (admin)
- `POST /api/users` - Create user profile
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account
- `POST /api/users/:id/favorites` - Add game to favorites
- `DELETE /api/users/:id/favorites/:gameId` - Remove favorite

### Misc
- `GET /api/health` - Health check
- `GET /api/stats` - Application statistics

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Deployment

### Render Deployment

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy the service
4. Update CORS settings with production frontend URL

## Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and write tests
3. Run linting: `npm run lint`
4. Run tests: `npm test`
5. Format code: `npm run format`
6. Commit changes: `git commit -m "Add your feature"`
7. Push to branch: `git push origin feature/your-feature`
8. Create a pull request

## Contributing

1. Follow the established code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PR

## License

ISC
