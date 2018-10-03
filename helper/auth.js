module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            //if user is authenticated then return the next function (route)
            return next();
        } else {
            //else redirect to login page
            res.redirect('/users/login');
        }
    },
    ensureGuest: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard');
        } else {
            return next();
        }
    }
}