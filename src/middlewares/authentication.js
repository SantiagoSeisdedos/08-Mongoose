import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as JwtStrategy } from "passport-jwt";
import _ from "mongoose-paginate-v2";

import {
  GITHUB_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  JWT_SECRET,
} from "../config/config.js";

// Passport local strategy
// passport.use(
//   "localLogin",
//   new LocalStrategy(
//     {
//       usernameField: "email",
//     },
//     async function verificationCallback(username, password, done) {
//       try {
//         const userData = await userModel.login(username, password);
//         done(null, userData);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

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
      let user = await userModel.findOne({ email: profile.username });
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
        console.log("00a jwtFromRequest Before if", req["signedCookies"]);
        console.log(
          "00b jwtFromRequest Before if",
          req["signedCookies"]["authorization"]
        );
        if (
          req &&
          req["signedCookies"] &&
          req["signedCookies"]["authorization"]
        ) {
          token = req["signedCookies"]["authorization"];
        }

        console.log("01 jwtFromRequest After if", token);
        console.log("02 jwtFromRequest After secretOrKey", JWT_SECRET);
        return token;
      },
      secretOrKey: JWT_SECRET,
    },
    (user, done) => {
      console.log("04 jwt strategy", user);
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
