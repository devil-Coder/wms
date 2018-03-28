var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");

var worker = require('../model/worker.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/register', function(req, res, next) {
    var data =  new worker(req.body);
    console.log(data);
    data.save((err,doc)=>{
        if(err)
            console.log(err);
        else{
            var uid = randomstring.generate(7);
            var accountNumber = randomstring.generate({
                charset: '0123456789'
            });
            worker.update({_id : doc._id},{uid,accountNumber},(e,done)=>{
                if(e)
                    console.log(e);
                else
                    res.send({code : 0,uid : uid});
            })
        }
    })
});

router.get('/login', function(req, res, next) {
    res.render('login');
});
router.post('/login', function(req, res, next) {
    worker.findOne({uid : req.body.uid},(err,user)=>{
        if(err)
            console.log(err);
        else if(!user){
            res.send({code : 1,message : req.body.uid+" doesn't exists."});
        }
        else{
            if(user.password === req.body.password){
                res.send({code : 0,message : req.body.uid+" is successfully loggedIn."});
            }else{
                res.send({code : 1,message : "Incorrect Password for "+req.body.uid});
            }
        }
    })
});

router.get('/dashboard', function(req, res, next) {
    res.render('dashboard');
});
router.post('/dashboard', function(req, res, next) {
    worker.findOne({uid : req.body.uid},(err,user)=>{
        if(err)
            console.log(err);
        else if(!user){
            res.send({code : 1,message : req.body.uid+" doesn't exists."});
        }
        else{
            if(user.password === req.body.password){
                res.send({code : 0,message : req.body.uid+" is successfully loggedIn."});
            }else{
                res.send({code : 1,message : "Incorrect Password for "+req.body.uid});
            }
        }
    })
});

router.post('/updatepin', function(req, res, next) {
    worker.findOne({accountNumber : req.body.accountNumber},(err,user)=>{
        if(err)
            console.log(err);
        else if(!user){
            res.send({code : 1,message : "Account Number "+ req.body.accountNumber+" doesn't exists."});
        }
        else{
            worker.update({accountNumber : req.body.accountNumber},{pin : req.body.pin},(err,done)=>{
                if(err){
                    res.send({code : 0,message : "something went wrong!"});
                }else{
                    res.send({code : 0,message : "Pin set. New PIN is "+req.body.pin});
                }
            })
        }
    })
});

module.exports = router;
