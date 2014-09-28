'use strict';

angular.module('3dchessApp')
  .controller('UserCtrl', function ($scope, Auth, $location, $http, socket) {
    // if(!Auth.isLoggedIn()){
    //   $location.path('/');
    // }

    $scope.curUser = Auth.getCurrentUser()._id;

    $http.get('/api/challenges/new', {
      params: {
        adversary: $scope.curUser
      }
    }).success(function(newChallenges) {
      $scope.newChallenges = newChallenges;
      socket.syncUpdates('challenge', $scope.newChallenges);
    });

    $http.get('/api/challenges/cancelled',{
      params: {
        challenger: $scope.curUser
      }
    }).success(function(cancelledChallenges) {
      $scope.cancelledChallenges = cancelledChallenges;
      socket.syncUpdates('challenge', $scope.cancelledChallenges);
    });

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

    $scope.createGame = function(white, black){
      $http.post('api/games', {
        white: white,
        black: black
      }).then(function(){
        $location.path('/game');
      }).catch(function(err){
        console.log(err.data);
      });
    };

    $scope.goToGame = function(gameId){
      $location.path('/game/' + gameId);
    };
  });

