db =  require("mongoose");

comment = new db.Schema({
    author: String,
    authorid : String,
    text : String
});
module.exports = db.model("comments",comment);