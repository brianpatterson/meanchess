'use strict';

angular.module('3dchessApp')
  .controller('UserCtrl', function ($scope, Auth, $location, $http, socket) {
    if(!Auth.isLoggedIn()){
      $location.path('/');
    }

    $scope.curUser = Auth.getCurrentUser();

    $http.get('/api/challenges/new', {
      params: {
        adversary: $scope.curUser._id
      }
    }).success(function(newChallenges) {
      $scope.newChallenges = newChallenges;
      socket.syncUpdates('challenge', $scope.newChallenges);
    });

    $http.get('/api/challenges/cancelled',{
      params: {
        challenger: $scope.curUser._id
      }
    }).success(function(cancelledChallenges) {
      $scope.cancelledChallenges = cancelledChallenges;
      socket.syncUpdates('challenge', $scope.cancelledChallenges);
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
            challenger: $scope.curUser._id,
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
  });

