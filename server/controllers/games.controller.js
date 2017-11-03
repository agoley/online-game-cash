var config = require('config.json');
var express = require('express');
var router = express.Router();
var gameService = require('server/services/game.service');

// routes
router.post('/', getGames);
router.get('/', getAll);
router.post('/search', search);

module.exports = router;

function getGames(req, res) {
    gameService.getGames(req.body.genre).then(data => {
        res.send(data);
    })
}

function getAll(req, res) {
    gameService.getAll().then(data => {
        res.send(data);
    })
}

function search(req, res) {
    gameService.search(req.body.searchTerm).then(data => {
        res.send(data);
    })
}