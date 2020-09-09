var express =  require("express");
var router =  express.Router();
var passport  = require("passport");
var users = require("../models/users");

router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req, res){
});

router.get("/signup",function(req,res){
    res.render("signup");
});
router.post("/signup",function(req,res){
    users.register(new users({username: req.body.username}),req.body.password,function(err, user){
        if(err){
            console.log(err);
            return res.redirect('/signup');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds");
        });
    });
});

router.get("/signout",function(req,res){
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/login");
});

module.exports = router;