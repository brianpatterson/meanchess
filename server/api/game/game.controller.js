'use strict';

var _ = require('lodash');
var Game = require('./game.model');
var User = require('../user/user.model');
var ch = require('./chess.js');

// Get list of games
exports.index = function(req, res) {
  Game.find(function (err, games) {
    if(err) { return handleError(res, err); }
    return res.json(200, games);
  });
};

// List all of the games that match my userID
exports.myGames = function(req, res) {
  Game.find({$or: [{white: req.query.me},{black: req.query.me}]},function (err, games) {
    User.populate(games, [{path: 'white', select: 'name'}, {path: 'black', select: 'name'}])
    .then(function(){
      if(err) { return handleError(res, err); }
      return res.json(200, games);
    });
  });
};

// Get a single game
exports.show = function(req, res) {
  Game.findById(req.params.id, function (err, game) {
    if(err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
    return res.json(game);
  });
};

// var chess = new ch.Chess(game.fenstring);

// if(chess.game_over() ||
//   (game.black !== req.query.me && game.white !== req.query.me) ||
//   (chess.turn() === 'w' && game.black === req.query.me) ||
//   (chess.turn() === 'b' && game.white === req.query.me)) {
//   return false;
// }

// Creates a new game in the DB.
exports.create = function(req, res) {
  Game.create(req.body, function(err, game) {
    if(err) { return handleError(res, err); }
    return res.json(201, game);
  });
};

// Updates an existing game in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Game.findById(req.params.id, function (err, game) {
    if (err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
    
    //custom code
    var chess = new ch.Chess(game.fenstring);
    var move = chess.move({
      from: req.param('source'),
      to: req.param('target'),
      promotion: 'q' //Note: will always promote to queen. Add functionality later for b,n,r promotion
    });

    if (move === null) {
      return res.send(403);
    }

    var fenObject = {fenstring: chess.fen()}

    var updated = _.merge(game, fenObject);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, game);
    });
  });
};

// Deletes a game from the DB.
exports.destroy = function(req, res) {
  Game.findById(req.params.id, function (err, game) {
    if(err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
    game.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}