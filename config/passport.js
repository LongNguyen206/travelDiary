const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load User model:
const User = mongoose.model('users');

// export the passport authentication function implemented with local strategy

module.exports = (passport) => {
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        User.findOne({
            email: email
        })
        .then(user => {
            // if user does not exist in the db, throw a msg:
            if (!user) {
                return done(null, false, {message: "Email not found"});
            }
            // decrypt and match passwords if user is found:
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err => console.log(err));
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done (null, false, {message: "Incorrect password"});
                };
            });
        })
        .catch(err => console.log(err))
    }));

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/users/google/callback',
        proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            // console.log(accessToken);
            // console.log(profile);

            // Cut off the size=50 parameter in the image URL:
            const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf['?']);

            const newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: image
            }

            // Check for existing User
            User.findOne({
                googleID: profile.id
            }).then(user => {
                if (user) {
                    // Return User
                    done(null, user);
                } else {
                    // Create User
                    new User(newUser).save()
                    .then(user => {
                        done(null, user);
                    });
                }
            })
            .catch(err => console.log(err));
    }));

    //creates the session and cookies for logged in user
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id)
        .then(user => done(null, user));
    });
};