'use strict';

angular.module('3dchessApp')
  .controller('UserCtrl', function ($scope, Auth, $location, $http, socket) {
    // if(!Auth.isLoggedIn()){
    //   $location.path('/');
    // }

    $scope.curUser = Auth.getCurrentUser()._id;

    //Lists pending challenges
    $http.get('/api/challenges/new', {
      params: {
        adversary: $scope.curUser
      }
    }).success(function(newChallenges) {
      $scope.newChallenges = newChallenges;
      socket.syncUpdates('challenge', $scope.newChallenges);
    });

    //Lists your rejected challenges
    $http.get('/api/challenges/cancelled',{
      params: {
        challenger: $scope.curUser
      }
    }).success(function(cancelledChallenges) {
      $scope.cancelledChallenges = cancelledChallenges;
      socket.syncUpdates('challenge', $scope.cancelledChallenges);
    });

    //Lists current games
    //TODO:
    //Needs to delete/hide the game when you finish
    //Also needs to display your opponent's name
    $http.get('/api/games/me',{
      params: {
        me: $scope.curUser
      }
    }).success(function(myGames) {
      $scope.myGames = myGames;
      socket.syncUpdates('games', $scope.myGames);
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
          });
        }).catch(function(err){
          $scope.challengeMessage = err.message;
        });
      }
    };

    $scope.deleteChallenge = function(challenge) {
      $http.delete('/api/challenges/' + challenge._id);
    };

    $scope.$on('$destroy', function(){
      socket.unsyncUpdates('challenge');
    });

// ----------------------------------------------
// You need to modify the createGame function to 
// Redirect you to the game's ID
// Start by console.logging the result of the post
// request to see if you can find the game info.
// ----------------------------------------------

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
  });

