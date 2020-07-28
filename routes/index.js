const express = require('express'),
	   router = express.Router(),
     passport = require('passport'),
         User = require('../models/user');

//root route
router.get('/', (req, res) => res.render('masks/landing'))

//show register form
router.get('/register', function(req, res){
	res.render('register');
})

//handle sign up
router.post('/register', function(req, res){
	User.register(new User({username:req.body.username}), req.body.password, function(err, user){
		 if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
		 }
		passport.authenticate('local')(req, res, function () {
			req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
			res.redirect('/masks');
    	});
	})
})

//show login form
router.get('/login', function(req, res) {
	res.render('login', { user : req.body.user});
})

//handle login
router.post('/login', 
  passport.authenticate('local', 
{ failureRedirect: '/login', failureFlash: 'Invalid username or password.', successFlash: 'Successfully Signed in!'}),
  function(req, res) {
    res.redirect('/masks');
  })

//logout route
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'Successfully logged out!');
	res.redirect('/masks');
})

module.exports = router;