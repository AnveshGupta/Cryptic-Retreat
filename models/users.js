db =  require("mongoose");
passportlocalmongoose = require("passport-local-mongoose");

userschema = new db.Schema({
    username : String,
    password : String
});

userschema.plugin(passportlocalmongoose);

module.exports = db.model("User",userschema);