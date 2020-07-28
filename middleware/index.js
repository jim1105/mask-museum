const middlewareObj = {};
const Mask = require('../models/mask'),
   Comment = require('../models/comment');
middlewareObj.checkMaskOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Mask.findById(req.params.id, function(err, foundMask){
			if(err){
				res.redirect('back');
			} else {
				if(foundMask.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash("error", "You need to be signed in to do that!");
		res.redirect("back");
	}
};
middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.commentId, function(err, foundComment){
			if(err){
				res.redirect('back');
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash("error", "You need to be signed in to do that!");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You need to log in first!');
	res.redirect('/login');
}

module.exports = middlewareObj;