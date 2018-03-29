/**
 * Created by Raj Chandra on 05-02-2018.
 */
var mongoose=require("mongoose");

var leaveSchema=new mongoose.Schema({
    applicant : {
        name : String,
        email : String,
        worksAs : String
    },
    dates : {
        from : String,
        to : String
    },
    reason : String,
    status : {type : Boolean, default : false}
});

var leave=mongoose.model("leave",leaveSchema);

module.exports=leave;