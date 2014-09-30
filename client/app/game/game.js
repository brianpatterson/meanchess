'use strict';

angular.module('3dchessApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('game', {
        url: '/game/:gameId',
        templateUrl: 'app/game/game.html',
        controller: 'GameCtrl'
      });
  });