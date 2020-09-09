var express = require("express");
var router = express.Router({mergeParams:true});
var users = require("../models/users");
var ng = require("../models/campground");
var comment = require("../models/comments");
var auth = require("../routes/Auth");
var middleware = require("../middleware/middleware");

isloggedin = middleware.isloggedin;
console.log(isloggedin);

router.get("comment",isloggedin,function(req,res){
    ng.findById(req.params.id,function(err,camp){
        if(err){
            console.log(err);
        }
        else{
        res.render("comments",{campground:camp});
        }
    });
});
router.get("/:comment_id/update",middleware.check_Comment_Owner,function(req,res){
    comment.findById(req.params.comment_id,function(err,com){
        if(err){
            req.flash("error","comment cannot be edited")
            res.redirect("/campgrounds/"+req.params.id);
        }
        else{
            res.render("updatecomment",{comment:com,campgroundid:req.params.id});
        }
    });
});
router.put("/:comment_id",middleware.check_Comment_Owner,function(req,res){

    name = req.user.username;
    name = name[0].toUpperCase() + name.slice(1);
    newcomment = {
        author: name,
        authorid:req.user._id,
        text: req.body.text
    };
    comment.findByIdAndUpdate(req.params.comment_id,newcomment,function(err,comment){
        if(err){
            req.flash("error","Comment not Updated");
            res.redirect("/campgrounds/"+req.params.id);
        }  else {
            req.flash("success","Comment Updated");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
router.post("/",isloggedin,function(req,res){
    ng.findById(req.params.id,function(err,camp){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{  
                name = req.user.username;
                name = name[0].toUpperCase() + name.slice(1);
                newcomment = {
                    author: name,
                    authorid:req.user._id,
                    text: req.body.text
                }
                comment.create(newcomment,function(err,com){
                    if(err){
                        console.log(err);
                        return;
                    }
                camp.comment.push(com);
                camp.save();
                res.redirect("/campgrounds/"+req.params.id);
        });
    }
    });
});
router.delete("/:comment_id",middleware.check_Comment_Owner,function(req,res){
    comment.findByIdAndDelete(req.params.comment_id,function(err,com){
        if(err){
            req.flash("error","Cannot Delete Comment");
            res.redirect("/campgrounds/"+req.params.id);
        }
        else{
            req.flash("success","Comment deleted successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;