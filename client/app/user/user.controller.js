'use strict';

angular.module('3dchessApp')
  .controller('UserCtrl', function ($scope, Auth, $location, $http, socket) {
    if(!Auth.isLoggedIn()){
      $location.path('/');
    }

    $scope.curUser = Auth.getCurrentUser()._id;

    //Lists pending challenges
    $scope.newChallenges = [];
    $scope.getNewChallenges = function(){
      $http.get('/api/challenges/new', {
        params: {
          adversary: $scope.curUser
        }
      }).success(function(newChallenges) {
        $scope.newChallenges = newChallenges;
      });
    };
    $scope.getNewChallenges();
    socket.syncUpdates('challenge', $scope.newChallenges, function () {
      $scope.getNewChallenges();
    });

    //Lists your rejected challenges
    $scope.cancelledChallenges = [];
    $scope.getCancelledChallenges = function(){
      $http.get('/api/challenges/cancelled',{
        params: {
          challenger: $scope.curUser
        }
      }).success(function(cancelledChallenges) {
        $scope.cancelledChallenges = cancelledChallenges;
      });
    };
    $scope.getCancelledChallenges();
    socket.syncUpdates('challenge', $scope.cancelledChallenges, function () {
      $scope.getCancelledChallenges();
    });
    

    //Lists current games
    //TODO:
    //Needs to delete/hide the game when you finish
    $scope.myGames = [];
    $scope.getMyGames = function(){
      $http.get('/api/games/me',{
        params: {
          me: $scope.curUser
        }
      }).success(function(myGames) {
        $scope.myGames = myGames;
      });
    };
    $scope.getMyGames();
    socket.syncUpdates('games', $scope.myGames, function(){
      $scope.getMyGames();
    });
    

    $scope.challenge = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        $http.get('api/users/findUserByEmail', {
          params: {
            email: form.email
          }
        }).success(function(data) {
          $http.post('api/challenges', {
            challenger: $scope.curUser,
            adversary: data._id,
            status: 'pending'
          }).success(function() {
            $scope.challengeMessage = 'Your challenge to '+ data.name + ' has been sent!';
          }).catch(function(){
            $scope.challengeMessage = 'You cannot challenge yourself.';
          });
        }).catch(function(){
          $scope.challengeMessage = 'That user does not exist.';
        });
      }
    };

    $scope.deleteChallenge = function(challenge) {
      $http.delete('/api/challenges/' + challenge._id);
    };

    $scope.deleteGame = function(game){
      $http.delete('/api/games/' + game._id);
    };

    $scope.cancelChallenge = function(challenge){
      $http.put('/api/challenges/cancel/' + challenge._id)
      .catch(function(err){
        console.log('Cancel Challenge Error: ', err);
      });
    };

    $scope.createGame = function(white, black, challenge){
      $http.post('api/games', {
        white: white,
        black: black
      }).then(function(res){
        $location.path('/game/' + res.data._id);
      }).catch(function(err){
        console.log(err.data);
      }).then(function(){
        $http.delete('/api/challenges/' + challenge._id);
      });
    };

    $scope.goToGame = function(gameId){
      $location.path('/game/' + gameId);
    };

    $scope.$on('$destroy', function(){
      socket.unsyncUpdates('challenge');
    });
  });

