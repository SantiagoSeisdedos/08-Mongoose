import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { userModel } from "../dao/models/user.model.js";
import {
  GITHUB_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from "../config.js";
import _ from "mongoose-paginate-v2";

passport.use(
  "localLogin",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function verificationCallback(username, password, done) {
      try {
        const userData = await userModel.login(username, password);
        done(null, userData);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "githubLogin",
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      let user = await userModel.findOne({ email: profile.email });
      if (!user) {
        user = await userModel.create({
          name: profile.displayName,
          email: profile.username,
        });
      }
      done(null, user.toObject());
    }
  )
);

passport.serializeUser((user, next) => {
  next(null, user);
});
passport.deserializeUser((user, next) => {
  next(null, user);
});

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();
