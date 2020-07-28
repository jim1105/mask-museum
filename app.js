//required packages
const express = require('express'),
          app = express(),
         port = 3000,
   bodyParser = require('body-parser'),
     mongoose = require('mongoose'),
     passport = require('passport'),
LocalStrategy = require('passport-local'),
	  session = require('express-session'),
methodOverride = require('method-override'),
		flash = require('connect-flash');

//required DB models
const Mask = require("./models/mask"),
   Comment = require("./models/comment"),
      User = require("./models/user"),
       seedDB = require("./seeds");
      
//required routes
const indexRoutes = require('./routes/index'),
    commentRoutes = require('./routes/comments'),
       maskRoutes = require('./routes/masks');

mongoose.connect('mongodb://localhost/mask-db', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
	console.log("connected");
});

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(flash());

// seedDB();

//Passport Configue
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(maskRoutes);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));