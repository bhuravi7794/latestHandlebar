import passport from "passport";
import UserModel from "../models/UsersModel.js";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/UsersModel.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      req.checkBody("email", "email is not valid").notEmpty().isEmail();
      req
        .checkBody("password", "Invalid password")
        .notEmpty()
        .isLength({ min: 4 });
      let errors = req.validationErrors();
      if (errors) {
        var messages = [];
        errors.forEach((error) => {
          messages.push(error.msg);
        });
        return done(null, false, req.flash("error", messages));
      }
      // existing user.
      UserModel.findOne({ email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, { message: "Email is already in use" });
        }
      });

      // new user
      let newUser = new UserModel();
      newUser.email = email;
      newUser.password = newUser.encryptPassword();
    }
  )
);
