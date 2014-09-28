'use strict';

angular.module('3dchessApp')
  .controller('GameCtrl', function ($scope, Auth, $location, $http, socket, $stateParams) {

    $scope.hello = $stateParams;

    // $http.get('/api/game', {
    //   params: {
    //     adversary: $scope.curUser
    //   }
    // }).success(function(newChallenges) {
    //   $scope.newChallenges = newChallenges;
    //   socket.syncUpdates('challenge', $scope.newChallenges);
    // });
  });
