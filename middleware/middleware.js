var comments = require("../models/comments");
var campground = require("../models/campground");
var user = require("../models/users");
var ng = require("../models/campground");
var comment = require("../models/comments");
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
                res.redirect("/campgrounds/"+req.params.id);
            }
            else{
                console.log(com.authorid);
                console.log(req.user._id);
                console.log(typeof(com.authorid));
                console.log(typeof(req.user._id));
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
middleware.check_Campground_Owner = function(req,res,next){
    if(!req.isAuthenticated()){
        req.flash("error","You need to be logged in to do that");
        res.redirect("/login");
    }
    else{
        ng.findById(req.params.id,function(err,camp){
            if(err){
                req.flash("error","Campground cannot be changed");
                res.redirect("/campgrounds/"+req.params.id);
            }
            else{
                if(camp.userid == req.user._id){
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