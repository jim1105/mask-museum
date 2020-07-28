const express = require("express"),
	   router = express.Router(),
		 Mask = require('../models/mask'),
   middleware = require('../middleware');

//show all masks
router.get('/masks', function(req, res){
	Mask.find(function (err, masks) {
  		if (err) return console.error(err);
		res.render('masks/index', {masks:masks});
	})
})

//add a new mask to DB
router.post('/masks', middleware.isLoggedIn, function(req, res){
	const author = {id:req.user._id, username:req.user.username};
	const newMask = {name:req.body.name, image:req.body.image, description:req.body.description, author:author};
	Mask.create(newMask, function (err, createdMask) {
  		if (err) return console.error(err);
		req.flash('success', 'Created a mask!');
		res.redirect('/masks');
	});
})

//show form to create a new mask
router.get('/masks/new', middleware.isLoggedIn, function(req, res){
	res.render("masks/new");
})

//show info about a particular mask
router.get('/masks/:id', function(req, res){
	Mask.findById(req.params.id).populate('comments').exec(function (err, mask) {
		if (err) return console.error(err);
		res.render("masks/show", {mask:mask});
	});
})

//show form to edit an existing mask
router.get('/masks/:id/edit', middleware.checkMaskOwnership, function(req, res){
	Mask.findById(req.params.id, function(err, foundMask){
		if (err) return console.error(err);
		res.render('masks/edit', {mask: foundMask});
	})
})

//update an existing mask in db
router.put('/masks/:id', middleware.checkMaskOwnership, function(req, res){
	Mask.findByIdAndUpdate(req.params.id, req.body.mask, function(err, updatedMask){
		if (err) {
			req.flash("error", err.message);
			res.redirect('/masks');
		} else{
			req.flash("success","Successfully Updated!");
			res.redirect('/masks/'+ req.params.id);
		}
	})
})

router.delete('/masks/:id', middleware.checkMaskOwnership, function(req, res){
	Mask.findByIdAndRemove(req.params.id, function(err){
		if(err) res.redirect('/masks');
		req.flash("success","Successfully deleted!");
		res.redirect('/masks');
	})
})
	
module.exports = router;