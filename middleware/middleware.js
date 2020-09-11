var comments = require("../models/comment");
var campground = require("../models/location");
var user = require("../models/user");
var location = require("../models/location");
var comment = require("../models/comment");
var passport = require("passport");

middleware = {};

middleware.isloggedin = function(req,res,next){
    if(!req.isAuthenticated()){
        req.flash("error","You need to be logged in to do that");
        res.redirect("/login");
    }
    else{
        next();
    }
};
middleware.check_Comment_Owner = function(req,res,next){
    if(!req.isAuthenticated()){
        req.flash("error","You need to be logged in to do that");
        res.redirect("/login");
    }
    else{
        comment.findById(req.params.comment_id,function(err,com){
            if(err){
                req.flash("error","Comment cannot be changed");
                res.redirect("/location/"+req.params.id);
            }
            else{
                if(com.authorid == req.user._id){
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
}
middleware.check_Location_Owner = function(req,res,next){
    if(!req.isAuthenticated()){
        req.flash("error","You need to be logged in to do that");
        res.redirect("/login");
    }
    else{
        location.findById(req.params.id,function(err,loc){
            if(err){
                req.flash("error","Location cannot be changed");
                res.redirect("/Location/"+req.params.id);
            }
            else{
                if(loc.userid == req.user._id){
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
}

module.exports = middleware;