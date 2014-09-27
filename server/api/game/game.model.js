'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
  user1: String,
  user2: String,
  fenstring: String
});

module.exports = mongoose.model('Game', GameSchema);