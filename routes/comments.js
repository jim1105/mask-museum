const express = require("express"),
	   router = express.Router(),
         Mask = require('../models/mask'),
      Comment = require('../models/comment'),
   middleware = require('../middleware');

//new comments
router.get('/masks/:id/comments/new', middleware.isLoggedIn, function(req, res){
	Mask.findById(req.params.id, function(err, mask){
		if (err) return console.error(err);
		res.render("comments/new", {mask:mask});
	})	
})

//create comments
router.post('/masks/:id/comments', middleware.isLoggedIn, function(req, res){
	Mask.findById(req.params.id, function(err, mask){
		if (err) return console.error(err);
		Comment.create(req.body.comment, function(err, comment){
			if (err) return console.error(err);
			comment.author.id = req.user._id;
			comment.author.username = req.user.username;
			comment.save();
			mask.comments.push(comment);
			mask.save();
			req.flash('success', 'Created a comment!');
			res.redirect('/masks/'+req.params.id);
		})
	})
})

//show form to edit comments
router.get("/masks/:id/comments/:commentId/edit", middleware.checkCommentOwnership, function(req, res){
    // find masks by id
    Comment.findById(req.params.commentId, function(err, foundComment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {mask_id: req.params.id, comment: foundComment});
        }
    })
});

//update comments
router.put("/masks/:id/comments/:commentId", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
           res.render("edit");
       } else {
		   req.flash("success","Successfully Updated!");
           res.redirect("/masks/" + req.params.id);
       }
   }); 
});

//delete comments
router.delete("/masks/:id/comments/:commentId", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log("PROBLEM!");
        } else {
			req.flash("success","Successfully deleted!");
            res.redirect("/masks/" + req.params.id);
        }
    })
});

module.exports = router;