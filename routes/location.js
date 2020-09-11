var express = require("express");
var multer = require('multer');
var path = require('path');
var router = express.Router({mergeParams:true});
var users = require("../models/user");
var location = require("../models/location");
var comment = require("../models/comment");
var auth = require("../routes/auth");
var middleware = require("../middleware/middleware");
 
storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

router.get("/",function(req,res){
    location.find({},function(err,locs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{locations:locs});
        }
    });
    
});
router.get("/new",isloggedin,function(req,res){
    res.render("location/new");
});
router.post("/",isloggedin,function(req,res){
    var loc = req.body.loc;
    loc.userid = req.user._id;
    location.create(loc,function(err,ret){
        if(err){
            req.flash("error","location cannot be added");
            console.log(err);
            res.redirect("/location");
        }
        else{
            req.flash("success","Location added successfully");
            console.log(ret);
            res.redirect("/location/"+ret._id+"/upload");
        }
    });
});
router.get("/:id",function(req,res){
    location.findById(req.params.id).populate("comment").exec(function(err,loc){
        if(err){
            console.log(err);
        }
        else{
            res.render("location/description",{loc : loc});
        }
    });
});

router.get("/:id/update",middleware.check_Location_Owner,function(req,res){
    location.findById(req.params.id, function(err,loc){
        if(err){
            res.redirect("/location");
        }
        else{
            res.render("location/update",{loc:loc});
        }
    });
});
router.put("/:id",middleware.check_Location_Owner,function(req,res){
    var location_Update = req.body.loc;
    location.findByIdAndUpdate(req.params.id, location_Update, function(err, updatedBlog){
        if(err){
            req.flash("error", "Location could not be updated");
            res.redirect("/location");
        }  else {
            req.flash("success","Location updated successfully");
            res.redirect("/location/" + req.params.id);
        }
     });
});
router.delete("/:id",middleware.check_Location_Owner,function(req,res){
    location.findByIdAndDelete(req.params.id,function(err,loc){
        if(err){
            req.flash("error","Cannot Delete Location");
            res.redirect("/location");
        }
        else{
            req.flash("success","Location deleted successfully");
            res.redirect("/location");
        }
    });
});
router.get("/:id/upload",middleware.check_Location_Owner,function(req,res){
        res.render("location/upload",{id:req.params.id});
});
router.post("/:id/upload",middleware.check_Location_Owner,function(req,res){
    upload = multer({ storage: storage, fileFilter: imageFilter }).single('profile_pic');
    upload(req, res, function(err) {
        if(err) {
            res.send(err) 
        } 
        else {
            location.findById(req.params.id,function(e,loc){
                if(e){
                    req.flash("error","image cannot be uploaded");
                    res.redirect("/location/"+req.params.id);
                }
                else{
                loc.src.push((req.file.path).substr(6));
                loc.save(function(a,b){
                    res.redirect("/location/"+req.params.id);
                });
                }
            });
        } 
    });
});
router.delete("/:id/image/delete",middleware.check_Location_Owner,function(req,res){
    console.log(req.body.index);
    location.findById(req.params.id,function(err,loc){
        loc.src.splice(req.body.index-1,1);
        loc.save(function(a,b){
            res.redirect("/location/"+req.params.id);
        });
    });
});
module.exports = router;