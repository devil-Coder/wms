var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var jwt = require('jsonwebtoken');

var worker = require('../model/worker.js');
var leave = require('../model/leaves.js');
var authenticate = require('../authenticate');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/register', function(req, res, next) {
    var data =  new worker(req.body);
    data.uid = randomstring.generate(7);
    data.accountNumber = randomstring.generate({
        length: 12,
        charset: '0123456789'
    });
    data.dailyPay = data.appliedFor == 'Employee'?100:200;
    data.save((err,doc)=>{
        if(err)
            console.log(err);
        else{
            res.send({code : 0,uid : data.uid});
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
                user.password = '';
                console.log(user);
                res.cookie(process.env.TOKEN_NAME,user);
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

router.get('/user', function(req, res, next) {
    var user = req.cookies['wms'];
    worker.findOne({email : user.email},(err,doc)=>{
        if(err)
            console.log(err);
        else{
            res.send(doc);
        }
    })
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
                    console.log(err);
                    res.send({code : 1,message : "Something went wrong!"});
                }else{
                    res.send({code : 0,message : "Pin set.\n New PIN is "+req.body.pin});
                }
            })
        }
    })
});

router.get('/applyleave', function(req, res, next) {
    var userData = req.cookies['wms'];
    leave.find({ 'applicant.email' : userData.email},(e,leaveData)=>{
        if(e)
            console.log(e);
        else{
                console.log(leaveData);
                res.send(leaveData);
            }
        })
});

router.post('/applyleave', function(req, res, next) {
    var userData = req.cookies['wms'];
    worker.findOne({accountNumber : userData.accountNumber},(err,user)=>{
        if(err)
            console.log(err);
        else if(!user){
                res.send({code : 1,message : "Unauthorised Access!!"});
            }
        else{
            var dates = {
                from : new Date(req.body.from).getTime(),
                to : new Date(req.body.to).getTime()
            };
            var leaveData = new leave({
                'applicant.name' : userData.name,
                'applicant.email' : userData.email,
                'applicant.worksAs' : userData.appliedFor,
                reason : req.body.reason,
                'dates.to' : dates.to,
                'dates.from' : dates.from
            });
            leaveData.save((err,done)=>{
                if(err){
                    console.log(err);
                }else{
                    res.send({code : 0,message : "Leave placed !"});
                }
            })
        }
    })
});

router.get('/admin', function(req, res, next) {
    res.render('admin');
});

router.get('/fetchLeave', function(req, res, next) {
    leave.find({},(err,allLeave)=>{
        if(err)
            console.log(err);
        else
            res.send(allLeave);
    })
});

router.post('/approveLeave', function(req, res, next) {
    leave.update({_id : req.body.leaveID},{status : true},(error,doc)=>{
        if(error) {
            console.log(error);
        }
        else
        {
            console.log(req.body);
            var totalLeave = (req.body.to - req.body.from)/86400000;
            worker.update({email: req.body.email}, {$inc : {numberOfLeave : totalLeave}}, (e, done) => {
            if(e) {
                console.log(e);
            }
            else
            {
                leave.find({}, (e, docs) => {
                    res.send(docs);
                    });
                }
            });
        }
    });
});

router.post('/deleteLeave', function(req, res, next) {
    leave.findOne({_id : req.body.leaveID},(err,data)=>{
        console.log(data);
        if(err)
            console.log(err);
        else{
            data.remove();
            leave.find({},(e,docs)=>{
                res.send(docs);
            });
        }
    })
});
module.exports = router;
