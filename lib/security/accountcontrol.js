var CONNECTION_URL = require("../../config/mongodb.config.js").CONNECTION_URL;
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var MongoClient = require("mongodb").MongoClient;
var initialize, authenticate, authorize;

passport.serializeUser((email, done) => {
  done(null, email);
});

passport.deserializeUser((email, done) => {
  MongoClient.connect(CONNECTION_URL).then((db) => {
    return db.collection("users")
      .findOne({ email: { $eq: email } });
  }).then((user) => {
    done(null, {
      email: user.email,
      name: user.name,
      role: user.role
    });
  }).catch((err) => {
    done(err)
  });
});

passport.use(
  "local-login",
  new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
  }, (req, username, password, done) => {
    MongoClient.connect(CONNECTION_URL).then((db) => {
      return db.collection("users")
        .findOne({
          email: { $eq: username },
          password: { $eq: password }
        });
    }).then((user) => {
      done(null, user.email);
    }).catch((err) => {
      done(null, false, req.flash("message", "ユーザー名 または パスワードが違います。"));
    });
  })
);

initialize = function () {
  return [
    passport.initialize(),
    passport.session(),
    function (req, res, next) {
      if (req.isAuthenticated()) {
        res.locals.user = req.user
      }
      next();
    }
  ]
};

authenticate = function () {
  return passport.authenticate(
    "local-login", {
      successRedirect: "/account",
      failureRedirect: "/account/login"
    }
  );
};

authorize = function (role) {
  return function (req, res, next) {
    if (req.isAuthenticated() &&
      req.user.role == role) {
      next();
    } else {
      res.redirect("/account/login");
    }
  };
};

module.exports = {
  initialize,
  authenticate,
  authorize
};