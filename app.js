var exp = require("express"),
    app = exp(),
    db = require("mongoose"),
    bp = require("body-parser"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localstrategy = require("passport-local"),
    passportlocalmongoose = require("passport-local-mongoose"),
    mo = require("method-override"),
    multer = require("multer");
    path = require("path");


    comment = require("./models/comment");
    location = require("./models/location");  
    user = require("./models/user");  
    var middleware = require("./middleware/middleware");
    console.log(middleware);

    isloggedin = middleware.isloggedin;

var AuthRoutes      = require("./routes/auth"),
    commentRoutes    = require("./routes/comment"),
    locationRoutes = require("./routes/location");
    
app.use(exp.static(__dirname + "/public"));    
app.use(mo("_method"));
app.use(flash());
db.set('useUnifiedTopology',true);
db.set('useFindAndModify', false);
db.connect("mongodb://localhost:27017/cryptic_retreats",{useNewUrlParser: true});

// seeddb =  require("./seed");
// seeddb();

app.use(require("express-session")({
    secret: "this is @ $ecr3t which c@nn0t be cr@cked e@&1ly",
    resave: false,
    saveUninitialized: false
}));

passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(bp.urlencoded({extended:true}));
app.set("view engine","ejs");

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.currentuser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.get("/",function(req,res){
    res.render("home");
});

app.use(AuthRoutes);
app.use("/location",locationRoutes);
app.use("/location/:id",commentRoutes);
var a = 3000;
app.listen(process.env.PORT, process.env.IP,function(req,res){
    console.log("server started");
});
