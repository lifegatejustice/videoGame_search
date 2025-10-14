// Entry point of the application.
// Sets up Express server, middleware, and connects routes.
require('dotenv').config();
const express = require('express');
const app = express();


const routes = require('./src/routes');
const db = require('./database/connect');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', routes);

// Initialize database, then start server
db.initDb((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
  } else {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }
});