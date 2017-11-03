var Promise = require("bluebird");

var Game = require('server/models/game.js');

var service = {};

service.getGames = getGames;
service.getAll = getAll;
service.search = search;

module.exports = service;

function getGames(genre) {
    return new Promise((resolve, reject) => {
        Game.find({ genre: genre }).then(data => {
            resolve(data);
        });      
    });
}

function getAll() {
    return new Promise((resolve, reject) => {
        Game.find({}).then(data => {
            resolve(data);
        });      
    });
}

function search(searchTerm) {
     return new Promise((resolve, reject) => {
        Game.find({ title: new RegExp(searchTerm, 'i') }).then(data => {
            resolve(data);
        });      
    });
}

