var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Promise = require("bluebird");

var User = require('server/models/user.js');
 
var service = {};
 
service.authenticate = authenticate; // authenticate a user
service.create = create; // create a user
service.get = get // get a user

module.exports = service;

function get(email) {
    return new Promise((resolve, reject) => {
        User.findOne({email: email}).then(data => {
            if (data) {
                    resolve(data);
            } else {
                // no user found with the given email
                resolve("not_found");
            }
        });
    });
}
 
function authenticate(email, password) {
    return new Promise((resolve, reject) => {
        User.findOne({email: email}).then(data => {
            if (data) {
                // user was found with email
                if (bcrypt.compareSync(password, data.password)) {
                    // authentication successful, create a jwt for the user
                    data.token = jwt.sign({ sub: data._id }, process.env.JWT_SECRET);
                    resolve(data);
                } else {
                    // authentication failed with password
                    resolve("incorrect_password");
                }
            } else {
                // authentication failed with email
                resolve("not_found");
            }
        });
    });
}


function create(userParam) {
    return new Promise((resolve, reject) => {
        User.findOne({email: userParam.email}).then(data => {
            if (data) {
                // a user already exits with the given email
                resolve("email_in_use");
            } else {
                createUser(); // createUser is defined seperately
            }
        }, err => { 
            reject(err.name) 
        });

        function createUser() {
            // create a new user with the given email
            var user = new User({ email: userParam.email });

            // add hashed password to user object
            user.set('password', bcrypt.hashSync(userParam.password, 10));

            // create and set a token for the user
            user.set('token', jwt.sign({ sub: user._id }, process.env.JWT_SECRET));
            
            user.save().then(data => { 
                resolve(data)
             }, err => { 
                 console.log("err saving user: " + err.message);
                 reject(err.name) 
            });
        }
    });
}