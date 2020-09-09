var exp = require("express"),
    app = exp(),
    db = require("mongoose"),
    bp = require("body-parser"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localstrategy = require("passport-local"),
    passportlocalmongoose = require("passport-local-mongoose"),
    mo = require("method-override"),


    comment = require("./models/comments");
    ng = require("./models/campground");  
    users = require("./models/users");  
    var middleware = require("./middleware/middleware");
    console.log(middleware);

    isloggedin = middleware.isloggedin;

var AuthRoutes      = require("./routes/Auth");
    commentRoutes    = require("./routes/comment"),
    campgroundRoutes = require("./routes/campground"),
    
app.use(mo("_method"));
app.use(flash());
db.set('useUnifiedTopology',true);
db.connect("mongodb://localhost:27017/campground_auth",{useNewUrlParser: true});

// seeddb =  require("./seed");
// seeddb();

app.use(require("express-session")({
    secret: "this is a secret which c@nn0t be cr@cked e@&1ly",
    resave: false,
    saveUninitialized: false
}));

passport.use(new localstrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

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
    res.render("landing");
});

app.use(AuthRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(commentRoutes);

app.listen(3000,function(req,res){
    console.log("server started");
});
