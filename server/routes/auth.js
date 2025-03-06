
const express = require('express');
const passport = require('passport');
const { Strategy: GitHubStrategy } = require('passport-github');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Passport configuration
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

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          // Check if user with this email already exists
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
          const existingUser = await User.findOne({ email });

          if (existingUser) {
            // Update existing user with GitHub info
            existingUser.githubId = profile.id;
            if (profile.displayName) existingUser.displayName = profile.displayName;
            if (profile.photos && profile.photos[0]) existingUser.avatar = profile.photos[0].value;
            await existingUser.save();
            return done(null, existingUser);
          }

          // Create new user with GitHub info
          user = new User({
            githubId: profile.id,
            email,
            displayName: profile.displayName || profile.username,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Check if user with this email already exists
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          if (!email) return done(new Error('No email found in Google profile'), null);

          const existingUser = await User.findOne({ email });

          if (existingUser) {
            // Update existing user with Google info
            existingUser.googleId = profile.id;
            if (profile.displayName) existingUser.displayName = profile.displayName;
            if (profile.photos && profile.photos[0]) existingUser.avatar = profile.photos[0].value;
            await existingUser.save();
            return done(null, existingUser);
          }

          // Create new user with Google info
          user = new User({
            googleId: profile.id,
            email,
            displayName: profile.displayName || 'Google User',
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Password Registration
router.post('/password/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword
    });
    
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Password Login
router.post('/password/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Check if password exists (user might have registered with OAuth)
    if (!user.password) {
      return res.status(400).json({ message: "Please login with your social account" });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Set session
    req.session.userId = user._id;
    
    res.status(200).json({ message: "Login successful", user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// GitHub authentication routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Google authentication routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;
