'use strict';

angular.module('3dchessApp')
  .controller('UserCtrl', function ($scope, Auth, $location, $http, socket) {
    if(!Auth.isLoggedIn()){
      $location.path('/');
    }

    $scope.challenger = Auth.getCurrentUser();

    $scope.challenge = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        $http.get('api/users/findUserByEmail', {
          params: {
            email: form.email
          }
        }).success(function(data) {
          $http.post('api/challenges', {
            challenger: $scope.challenger._id,
            adversary: data._id,
            active: 'pending'
          }).success(function() {
            $scope.challengeMessage = 'Your challenge to '+ data.name + ' has been sent!';
          });
        }).catch(function(err){
          $scope.challengeMessage = err.message;
        });
      }
    };

    $http.get('/api/challenges').success(function(challenges) {
      $scope.challenges = challenges;
      socket.syncUpdates('challenges', $scope.challenges);
    });
  });

  // $scope.addThing = function() {
  //   if($scope.newThing === '') {
  //     return;
  //   }
  //   $http.post('/api/things', { name: $scope.newThing });
  //   $scope.newThing = '';
  // };

