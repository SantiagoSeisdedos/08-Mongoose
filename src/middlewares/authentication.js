import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as JwtStrategy } from "passport-jwt";
import _ from "mongoose-paginate-v2";

import {
  GITHUB_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  JWT_SECRET,
} from "../config/config.js";
import { usersService } from "../services/users.service.js";

// Passport Github strategy
passport.use(
  "githubLogin",
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      let user = await usersService.getUserByEmail({ email: profile.username });
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

// Passport JWT strategy
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: function (req) {
        var token = null;
        if (
          req &&
          req["signedCookies"] &&
          req["signedCookies"]["authorization"]
        ) {
          token = req["signedCookies"]["authorization"];
        }

        return token;
      },
      secretOrKey: JWT_SECRET,
    },
    (user, done) => {
      done(null, user);
    }
  )
);

passport.serializeUser((user, next) => {
  next(null, user);
});
passport.deserializeUser((user, next) => {
  next(null, user);
});

export const authentication = passport.initialize();
export const passportSession = passport.session();
