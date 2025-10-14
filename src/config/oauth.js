const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/userModel');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://videogame-search.onrender.com/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ providerId: profile.id, oauthProvider: 'google' });
    if (!user) {
      user = new User({
        oauthProvider: 'google',
        providerId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        avatarUrl: profile.photos[0].value,
        role: 'admin',
      });
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ providerId: profile.id, oauthProvider: 'github' });
    if (!user) {
      user = new User({
        oauthProvider: 'github',
        providerId: profile.id,
        username: profile.username,
        email: profile.emails ? profile.emails[0].value : null,
        avatarUrl: profile.photos[0].value,
        role: 'admin',
      });
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
