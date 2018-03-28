/**
 * Created by Raj Chandra on 05-02-2018.
 */
var mongoose=require("mongoose");

var workerSchema=new mongoose.Schema({
    name : {type:String,required:true,lowercase : true},
    email : {type : String,required : true,lowercase :true, unique: true},
    password: {type:String,required : true,maxLength : 20}, //max length 20
    uid : String,
    age : Number,
    languages : Number,
    experience : Number,
    nation : String,
    appliedFor : String,
    accountNumber : String,
    numberOfLeave : {type : Number, default : 0},
    pin : String,
    admin : {type : Boolean, default : false}
});

var worker=mongoose.model("worker",workerSchema);

module.exports=worker;