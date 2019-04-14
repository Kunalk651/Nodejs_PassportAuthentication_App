const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Use models
const User = require("../models/User");

// Login Page
router.get("/login", (req, res) => res.render("login"));

// Register Page
router.get("/register", (req, res) => res.render("register"));

// Register Handle
router.post("/register", (req, res) => {
  // DeStructurning
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required field
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields!" });
  }

  // Check password match
  if (password !== password2) {
    errors.push({ msg: "Password not match!" });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 charactors!" });
  }

  // Check errorss
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation Passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        // Users Exists
        errors.push({ msg: "Email is already Registered!" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        // Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Set password to hashed
            newUser.password = hash;
            // save user
            newUser.save()
              .then(user => {
                req.flash('success_msg', 'You are now registered and can Log In');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err))
          })
        );
      }
    });
  }
});

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashbord',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
});

// Logout Handle
router.get('/logout',(req,res) =>{
  req.logOut();
  req.flash('success_msg','You are logged out!');
  res.redirect('/users/login');
})

module.exports = router;
