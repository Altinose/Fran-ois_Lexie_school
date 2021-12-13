const passport = require("passport");
const usersRepo = require("../utils/user.repository.js");

module.exports = {
  initialization(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(function (user, done) {
      done(null, user.user_name);
    });
    passport.deserializeUser(async function (username, done) {
      let user = await usersRepo.getOneUser(username);
      done(null, user);
    });
  },


  checkAuthentication(role) {
    return function (request, response, next) {
      if (request.isAuthenticated()) {
        if (role) {
          if (role === request.user.user_role) { // TODO: RBAC/HIERARCHY
            return next(err);
          } else {
            return response.end("401 Unautorized (bad user level)");
          }
        } else {
          return next(err);
        }
      } else {
        response.redirect("/"); // not authenticated at all
      }
    }
  }
};