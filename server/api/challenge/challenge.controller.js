'use strict';

var _ = require('lodash');
var Challenge = require('./challenge.model');
var User = require('../user/user.model');

// Get list of challenges
exports.index = function(req, res) {
  Challenge.find(function (err, challenges) {
    if(err) { return handleError(res, err); }
    return res.json(200, challenges);
  });
};

//Get a list of challenges that are pending for that user
exports.newChallenges = function(req, res) {
  Challenge.find({status: 'pending', adversary: req.query.adversary }, function (err, challenges) {
    User.populate(challenges, {path: 'challenger', select: 'name'})
    .then(function(){
      if(err) return handleError(res,err);
      return res.json(200, challenges);
    });
  });
};

//Get a list of challenges that are cancelled for that user
exports.cancelledChallenges = function(req, res) {
  Challenge.find({status: 'cancelled', challenger: req.query.challenger}, function (err, challenges) {
    User.populate(challenges, {path: 'adversary', select: 'name'})
    .then(function(){
      if(err) return handleError(res,err);
      return res.json(200, challenges);
    });
  });
};

// Get a single challenge
exports.show = function(req, res) {
  Challenge.findById(req.params.id, function (err, challenge) {
    if(err) { return handleError(res, err); }
    if(!challenge) { return res.send(404); }
    return res.json(challenge);
  });
};

// Creates a new challenge in the DB.
exports.create = function(req, res) {
  if (req.body.challenger === req.body.adversary) {return res.send(403)}
  Challenge.create(req.body, function(err, challenge) {
    if(err) { return handleError(res, err); }
    return res.json(201, challenge);
  });
};

// Updates an existing challenge in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Challenge.findById(req.params.id, function (err, challenge) {
    if (err) { return handleError(res, err); }
    if(!challenge) { return res.send(404); }
    var updated = _.merge(challenge, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, challenge);
    });
  });
};

// Updates a challenge's status to cancelled
exports.cancelChallenge = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Challenge.findById(req.params.id, function (err, challenge) {
    if (err) { return handleError(res, err); }
    if(!challenge) { return res.send(404); }
    var status = {status: 'cancelled'};
    var updated = _.merge(challenge, status);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, challenge);
    });
  });
};

// Deletes a challenge from the DB.
exports.destroy = function(req, res) {
  Challenge.findById(req.params.id, function (err, challenge) {
    if(err) { return handleError(res, err); }
    if(!challenge) { return res.send(404); }
    challenge.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}