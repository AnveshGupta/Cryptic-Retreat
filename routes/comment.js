var express = require("express");
var router = express.Router({mergeParams:true});
var user = require("../models/user");
var location = require("../models/location");
var comment = require("../models/comment");
var auth = require("../routes/auth");
var middleware = require("../middleware/middleware");

isloggedin = middleware.isloggedin;
console.log(isloggedin);

router.get("/comment",isloggedin,function(req,res){
    location.findById(req.params.id,function(err,loc){
        if(err){
            console.log(err);
        }
        else{
        res.render("comment/new",{location:loc});
        }
    });
});
router.post("/",isloggedin,function(req,res){
    location.findById(req.params.id,function(err,loc){
        if(err){
            console.log(err);
            res.redirect("/location");
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
                loc.comment.push(com);
                loc.save();
                res.redirect("/location/"+req.params.id);
        });
    }
    });
});
router.get("/:comment_id/update",middleware.check_Comment_Owner,function(req,res){
    comment.findById(req.params.comment_id,function(err,com){
        if(err){
            req.flash("error","comment cannot be edited")
            res.redirect("/location/"+req.params.id);
        }
        else{
            res.render("comment/update",{comment:com,locationid:req.params.id});
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
            res.redirect("/location/"+req.params.id);
        }  else {
            req.flash("success","Comment Updated");
            res.redirect("/location/"+req.params.id);
        }
    });
});
router.delete("/:comment_id",middleware.check_Comment_Owner,function(req,res){
    comment.findByIdAndDelete(req.params.comment_id,function(err,com){
        if(err){
            req.flash("error","Cannot Delete Comment");
            res.redirect("/location/"+req.params.id);
        }
        else{
            req.flash("success","Comment deleted successfully");
            res.redirect("/location/"+req.params.id);
        }
    });
});

module.exports = router; 