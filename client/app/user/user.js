'use strict';

angular.module('3dchessApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/user',
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl'
      });
  });