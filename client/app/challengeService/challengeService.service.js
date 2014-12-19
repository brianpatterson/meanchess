'use strict';

angular.module('meanChessApp')
  .service('challengeService', function ($http, Auth) {
    // AngularJS will instantiate a singleton by calling "new" on this function
  
    var curUser = Auth.getCurrentUser()._id;

    this.getNewChallenges = function(callback){
      $http.get('/api/challenges/new', {
        params: {
          adversary: curUser
        }
      }).success(function(newChallenges) {
        callback(newChallenges);
      });
    };

    this.getCancelledChallenges = function(callback){
      $http.get('/api/challenges/cancelled',{
        params: {
          challenger: curUser
        }
      }).success(function(cancelledChallenges) {
        callback(cancelledChallenges);
      });
    };

    this.challenge = function(form) {
      if(form.$valid) {
        $http.get('api/users/findUserByEmail', {
          params: {
            email: form.email
          }
        }).success(function(data) {
          $http.post('api/challenges', {
            challenger: curUser,
            adversary: data._id,
            status: 'pending'
          }).success(function() {
            return 'Your challenge to '+ data.name + ' has been sent!';
          }).catch(function(){
            return 'You cannot challenge yourself.';
          });
        }).catch(function(){
          return 'That user does not exist.';
        });
      }
    };

    this.deleteChallenge = function(challenge) {
      $http.delete('/api/challenges/' + challenge._id);
    };

    this.cancelChallenge = function(challenge){
      $http.put('/api/challenges/cancel/' + challenge._id)
      .catch(function(err){
        console.log('Cancel Challenge Error: ', err);
      });
    };

  });
