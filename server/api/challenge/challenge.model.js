'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChallengeSchema = new Schema({
  challenger: String,
  adversary: String,
  active: String,
});

module.exports = mongoose.model('Challenge', ChallengeSchema);