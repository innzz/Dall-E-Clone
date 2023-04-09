import express from "express";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import passport from "passport";
import flash from "express-flash";
import session from "express-session";
import MethodOverride from "method-override";
import { initialize } from "../configs/passport-config.js";

dotenv.config();

const router = express.Router();
router.use(flash());
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

router.use(passport.initialize());
router.use(passport.session());
router.use(MethodOverride("_method"));

const users = [];

initialize(
  passport,
  (email) => {
    return users.find((user) => user.email === email);
  },
  (id) => {
    return users.find((user) => user.id === id);
  }
);

router.route("/").get(checkAuthenticated, (req, res) => {
  //   console.log("user", req.user);
  res.render("index.ejs", { name: req.user.name });
});

router
  .route("/login")
  .get(checkNotAuthenticated, (req, res) => {
    res.render("login.ejs");
  })
  .post(
    checkNotAuthenticated,
    passport.authenticate("local", {
      successRedirect: "/api/v1/auth",
      failureRedirect: "/api/v1/auth/login",
      failureFlash: true,
    })
  );

router.route("/logout").delete(checkAuthenticated, (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    res.redirect("/api/v1/auth/login");
  });
});

router
  .route("/register")
  .get(checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
  })
  .post(checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      res.redirect("/api/v1/auth/login");
    } catch (error) {
      res.redirect("/api/v1/auth/register");
    }
    console.log(users);
  });

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/api/v1/auth/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/api/v1/auth");
  }
  next();
}

export default router;
