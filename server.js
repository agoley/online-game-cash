// dependencies ------------------------------------------------------------------
require('rootpath')();

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var path = require('path');
var expressJwt = require('express-jwt');
var bodyParser = require('body-parser');
var cors = require('cors')
var config = require('config.json');

// configuration -----------------------------------------------------------------
app.use(cors()) // enable cors

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist'))); // client resources

var port = process.env.PORT || 3000; // set our port

mongoose.Promise = require('bluebird'); // use bluebird promises with mongoose

// use JWT auth to secure the api
app.use(expressJwt({ secret: process.env.JWT_SECRET })
    .unless({
        path:
        [
            '/api/users',
            '/api/users/auth',
            '/shop',
            '/login',
            '/signup',
            '/api/games',
            '/api/games/search',
            '/assets/*',
            '/dist/*'
        ]
    }));

// connect to mongodb ------------------------------------------------------------
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Server.js: succesfully connected to mongodb");
}, err => {
    console.log("Server.js: failed to connect to mongodb with connection url: " +
        process.env.MONGODB_URL +
        ` Ensure the following conditions are met:
        1. connection parameters are correct
        2. connection host and port are correct
        3. the database is running`);
});

// routes ------------------------------------------------------------------------
app.use('/api/users', require('server/controllers/users.controller'));
app.use('/api/games', require('server/controllers/games.controller'));

app.get('*', function (req, res) {
    // route all none api requests to Angular
    res.sendFile('index.html',
        { root: path.join(__dirname, 'dist/') });
});

// start -------------------------------------------------------------------------
app.listen(port, function () {
    console.log('server.js: online-game-cash is listening on port:' + port);
});