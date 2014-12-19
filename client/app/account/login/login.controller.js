'use strict';

angular.module('meanChessApp')
  .controller('LoginCtrl', function ($scope, $state, Auth) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $state.go('user');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
