//require and load dotenv
require('dotenv').config();

//require express package
const express = require("express");
const app = express();
//require express handlebars
const exphbs = require("express-handlebars");
//require mongoose
const mongoose = require('mongoose');
//require the body parser to parse through the form content
const bodyParser = require('body-parser');
//require the override package to allow overwriting 'post' methods
const methodOverride = require('method-override');
const passport = require('passport');
//use this to maintain user session:
const session = require('express-session');
//use this for Flash messages:
const flash = require('connect-flash');
//include the database:
const db = require('./config/database');
//setting the port:
const port = process.env.PORT || 3000;

//connecting other route files:
const users = require('./routes/users');
//load passport config:
require('./config/passport')(passport);
const trips = require('./routes/trips');

//any app method has 2 arguments: port/path and callback function (what you expect from the app)

//connect to mongodb
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
.then(() => console.log("connected to db"))
.catch((err) => console.log(err));

//require the trip model (no need for extention)
require('./models/Trip');
//create a Trip model
const Trip = mongoose.model('trips');

//middleware are needed when you install packages (and location where you put them in code MATTERS!) >>>>

// app.use((req, res, next) => {
//     console.log('middleware running');
//     //modify the req object
//     req.name = "Long";
//     next(); //'next' calls the next function in line
// });

//all css, images etc. go into 'public' folder (static files)
//connecting style.css:
app.use(express.static('public'));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

//'handlebars' are expressjs's erb, also 'ejs'
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//method-override:
app.use(methodOverride('_method'));

//session middleware (must be placed before passport middleware):
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secure',
  resave: false,
  saveUninitialized: true
}));

//passport middleware:
app.use(passport.initialize());
app.use(passport.session());

//connect-flash middleware:
app.use(flash());
app.use((req, res, next) => {
    //declare a global var user to be accessed in the views files:
    res.locals.user = req.user; //use locals for views, any other occasion - can use req.user
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// app.use((req, res, next) => {
//     res.status(404).send("Sorry can't find that!")
// });
//<<<< end of middlewares

//set home page:
//if using exphbs, create a 'views' folder
app.get('/', (req, res) => {
    // res.send('HOME');
    Trip.find()
    .then(trips => {
        res.render('trips/index', {
            trips: trips
        });
    })
    .catch(err => console.log(err));
}); //using exphbs 

//you have to restart the server whenever you make a change to js file
//install Nodemon to have live updates (run nodemon command instead of node app.js)

//All routes start here >>>>:
//'About' page:
app.get('/about', (req, res) => {
    // res.send('ABOUT');
    res.render('about');
});

//you have to put users middleware here to avoid 'undefined' error when parsing the body
app.use('/users', users); //whenever localhost:3000/users url appears, the app will now where to look for further routes
app.use('/trips', trips);

//start a server
app.listen(port, () => {
    console.log(`server started on port ${port}`)
});