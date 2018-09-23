const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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
}

//creates the session and cookies for logged in user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});