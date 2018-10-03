//require and load dotenv
require('dotenv').config();

//require express package
const express = require("express");

//require express handlebars
const exphbs = require("express-handlebars");
//require mongoose
const mongoose = require('mongoose');
//require the body parser to parse through the form content
const bodyParser = require('body-parser');
//require the cookie-parser
const cookieParser = require('cookie-parser');
//require the override package to allow overwriting 'post' methods
const methodOverride = require('method-override');
const passport = require('passport');
//use this to maintain user session:
const session = require('express-session');
//use this for Flash messages:
const flash = require('connect-flash');
const dateformat = require('dateformat');
//include the database:
const db = require('./config/database');
//setting the port:
const port = process.env.PORT || 3000;

const users = require('./routes/users');
//load passport config:
require('./config/passport')(passport);

//connecting other route files:
const index = require('./routes/index');

const trips = require('./routes/trips');

//any app method has 2 arguments: port/path and callback function (what you expect from the app)

//connect to mongodb
// Map Global Promises
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
.then(() => console.log("connected to MongoDB"))
.catch((err) => console.log(err));

const app = express();

require('./models/User');
require('./models/Trip');
//create a Trip model
const Trip = mongoose.model('trips');
// Load User Model
const User = mongoose.model('users');

//middleware >>>>

//all css, images etc. go into 'public' folder (static files)
//connecting style.css:
app.use(express.static('public'));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

// Cookie-Parser Middleware
app.use(cookieParser());

//'handlebars' are expressjs's erb, also 'ejs'
app.engine('handlebars', exphbs({defaultLayout: 'main'})); //main is the file in views
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

// set global variables
app.use((req, res, next) => {
    //declare a global var user to be accessed in the views files:
    res.locals.user = req.user || null; //use locals for views, any other occasion - can use req.user
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});
//<<<< end of middlewares

//you have to put users middleware here to avoid 'undefined' error when parsing the body
app.use('/', index); 
app.use('/users', users); //whenever localhost:3000/users url appears, the app will now where to look for further routes
app.use('/trips', trips);

//start a server
app.listen(port, () => {
    console.log(`server started on port ${port}`)
});