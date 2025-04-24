const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
let { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")

  // RENDER SIGNUPFORM ROUTE
  .get(userController.renderSignUpForm)

  // SIGN UP ROUTE
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  //  RENDER LOGIN FORM ROUTE
  .get(userController.renderLoginForm)
  // LOGIN ROUTE
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),

    userController.login
  );

// LOGOUT ROUTE
router.get("/logout", userController.logout);

module.exports = router;

// Middleware
