db =  require("mongoose");

location = new db.Schema({
    name: String,
    region:String,
    coordinate:String,
    des:String,
    src: [{
        type: String
    }],
    comment:[
        {
            type: db.Schema.Types.ObjectId,
            ref: "comments"
        }
    ],
    userid: String
});
module.exports = db.model("locations",location);