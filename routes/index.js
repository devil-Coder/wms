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
            worker.update({_id : doc._id},{uid :uid},(e,done)=>{
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

module.exports = router;
