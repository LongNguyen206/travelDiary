const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//use this to encrypt the password before saving to db:
const bcrypt = require('bcryptjs');
const passport = require('passport');
//use this for Flash messages:
const flash = require('connect-flash');

//require the user model (no need for extention)
require('../models/User');
//create a User model
const User = mongoose.model('users');

router.get('/register', (req, res) => { //here is a ROUTE
    res.render('users/register');   //here is a DIRECTORY (no slash at the front)
});

router.post('/register', (req, res) => {
    let errors = [];
    User.find({
        email: req.body.email
    })
    .then(user => {
        if (user.length != 0) {
            errors.push({text: "Email taken"});
        }
        if (/^(\w+)(\s?)(\w*)$/.test(req.body.name) == false) {
            errors.push({text: "Invalid name"});
        }
        if (req.body.password2 !== req.body.password)  {
            errors.push({text: "Password confirmation does not match!"});
            // req.flash('error_msg', 'Password does not match');
            // res.redirect('/users/register');
        }
        userValidation();
    })
    .catch(err => console.log(err));
    
    var userValidation = () => {
        if (errors.length > 0) {
            //if there are any errors, re-render the form instead of submitting it
            res.render('users/register', {
                errors: errors,
                name: req.body.name,
                email: req.body.email
            })
        } else {
            let newUser = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
            //encrypt the password:
            bcrypt.genSalt(12, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    //store hash in your password db:
                    if (err => console.log(err))
                    //if no errors, set the encrypted password as a new password in the db:
                    newUser.password = hash;
                    //create User model and insert data into db:
                    new User(newUser).save()
                    .then(users => {
                        passport.authenticate('local')(req, res, () => {
                            res.redirect('/');
                        });
                    })
                    .catch(err => console.log(err))
                });
            });
        };
    };
});

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next); //self invoked function
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
});

module.exports = router;
