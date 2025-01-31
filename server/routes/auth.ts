import express from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import User from '../models/User';

const router = express.Router();

// Passport configuration
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: "http://localhost:5000/api/auth/github/callback",
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      
      if (!user) {
        user = await User.create({
          githubId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          password: '', // Required field but not used for OAuth
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }
));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          password: '', // Required field but not used for OAuth
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }
));

// Auth routes
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { 
    failureRedirect: '/login',
    successRedirect: 'http://localhost:5173' 
  })
);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    successRedirect: 'http://localhost:5173'
  })
);

export default router;