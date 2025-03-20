import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import bcrypt from "bcrypt";
import {
  findUserByEmail,
  findUserById,
  findOrCreateSocialUser,
} from "../models/User.js";
import config from "../config/index.js";

export const setupPassport = (app) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const userResult = await findUserById(id);
      if (userResult.success) {
        done(null, userResult.data);
      } else {
        done(userResult.error);
      }
    } catch (err) {
      done(err);
    }
  });

  // Local Strategy (email/password)
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const userResult = await findUserByEmail(email);

          if (!userResult.success) {
            return done(null, false, { message: "Incorrect email." });
          }

          const user = userResult.data;

          // Compare password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password." });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Facebook Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: `${config.baseUrl}/api/v1/auth/facebook/callback`,
        profileFields: ["id", "displayName", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userResult = await findOrCreateSocialUser(profile);
          if (userResult.success) {
            return done(null, userResult.data);
          } else {
            return done(userResult.error);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: `${config.baseUrl}/api/v1/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userResult = await findOrCreateSocialUser(profile);
          if (userResult.success) {
            return done(null, userResult.data);
          } else {
            return done(userResult.error);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Twitter Strategy
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: config.twitter.apiKey,
        consumerSecret: config.twitter.apiSecret,
        callbackURL: `${config.baseUrl}/api/v1/auth/twitter/callback`,
        includeEmail: true,
      },
      async (token, tokenSecret, profile, done) => {
        try {
          const userResult = await findOrCreateSocialUser(profile);
          if (userResult.success) {
            return done(null, userResult.data);
          } else {
            return done(userResult.error);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // LinkedIn Strategy
  passport.use(
    new LinkedInStrategy(
      {
        clientID: config.linkedin.clientID,
        clientSecret: config.linkedin.clientSecret,
        callbackURL: `${config.baseUrl}/api/v1/auth/linkedin/callback`,
        scope: ["r_emailaddress", "r_liteprofile"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userResult = await findOrCreateSocialUser(profile);
          if (userResult.success) {
            return done(null, userResult.data);
          } else {
            return done(userResult.error);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
