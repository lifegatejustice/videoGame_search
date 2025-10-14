// Entry point of the application.
// Sets up Express server, middleware, and connects routes.

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./config/passport'); // 👈 make sure this file sets up your GoogleStrategy
const routes = require('./routes');
const db = require('./database/connect');

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());

// --- SESSION SETUP (must come before passport) ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true if using HTTPS
  })
);

// --- PASSPORT INITIALIZATION ---
app.use(passport.initialize());
app.use(passport.session());

// --- ROUTES ---
app.use('/', routes);

// --- DATABASE INITIALIZATION ---
db.initDb((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
  } else {
    app.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
    });
  }
});
