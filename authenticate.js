/**
 * Created by Raj Chandra on 7/26/2017.
 */

var jwt = require('jsonwebtoken');
var worker = require('./model/worker.js');

function check_token(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.cookies[process.env.TOKEN_NAME];
    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                res.redirect('/');
                // return res.json({code: 0,message: "Your session expired or You haven't logged in! Please try logging in :)"});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        return res.status(403).send('You do not belong here. Go back to hackerland ;)');
        //    json({code :0,message: "You are not authorized to visit this URL."});
    }
}

module.exports = {verify_token: check_token};