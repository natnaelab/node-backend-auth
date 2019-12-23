const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const passport = require("passport");

// input validation
const {
  validateLoginInput,
  validateRegisterInput
} = require("../../validation/user");

const User = require("../../models/User");

// @route       POST api/users/register
// @desc        register new user
// @access      public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //   check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // new user payload
  const newUser = new User({
    userHandle: req.body.userHandle,
    email: req.body.email,
    password: req.body.password
  });

  // encrypt password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then(user => res.json(user))
        .catch(err => {
          let emailerr = "email already registered";
          let usernameerr = "username already taken";

          if (err.errors.email && err.errors.userHandle) {
            errors.email = emailerr;
            errors.userHandle = usernameerr;
            res.status(400).json(errors);
          } else if (err.errors.userHandle) {
            errors.userHandle = usernameerr;
            res.status(400).json(errors);
          } else if (err.errors.email) {
            errors.email = emailerr;
            res.status(400).json(errors);
          }
        });
    });
  });
});

// @route       POST api/users/login
// @desc        login user/return jsonwebtoken
// @access      public
router.post("/login", (req, res) => {
  const { isValid, errors } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  let email = req.body.email;
  let password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "user not found";
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // user matched
        let payload = { id: user.id, name: user.userHandle, email: user.email }; //JWT payload

        // sign token
        jwt.sign(payload, config.get("jwtSecret"), (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        errors.password = "incorrect password";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route       GET api/users/current
// @desc        return current user
// @access      private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      username: req.user.userHandle,
      email: req.user.email
    });
  }
);

module.exports = router;
