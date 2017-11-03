var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('server/services/user.service');

// routes
router.post('/auth', authenticate);
router.post('/', create);
router.get('/:email', get);

module.exports = router;

function get(req, res) {
    userService.get(req.params.email).then(data => {
        if (typeof data === 'string') {
            // user not found
            console.log("auth failed with status: " + data);
            res.status(401).send(data);
        } else {
             res.send(data);
        }
    })
}

function authenticate(req, res) {
    userService.authenticate(req.body.email, req.body.password)
        .then(function (data) {
            if (typeof data === 'string') {
                // authentication failed
                console.log("auth failed with status: " + data);
                res.status(401).send(data);
            } else {
                // authentication successful
                res.send(data);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function create(req, res) {
    userService.create(req.body)
        .then((data) => {
            if (typeof data === 'string') {
                // authentication failed
                console.log("create failed with status: " + data);
                res.status(401).send(data);
            } else {
                res.status(200).send(data);
            }
        })
        .catch(err => {
            console.log("create failed with status: " + data);
            res.status(400).send(err)
        });
}