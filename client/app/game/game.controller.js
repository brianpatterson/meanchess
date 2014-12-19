'use strict';

angular.module('meanChessApp')
  .controller('GameCtrl', function ($scope, Auth, $location, $http, socket, $stateParams, gameService) {
    if(!Auth.isLoggedIn()){
      $location.path('/');
    }
    $scope.gameId = $stateParams.gameId;
    $scope.curUser = Auth.getCurrentUser()._id;

    gameService.getActiveGame($scope.gameId, function (cfg, game) {
      $scope.board = new ChessBoard('board', cfg);
      $scope.status = gameService.updateStatus(game);
      $scope.game = game;
      socket.syncModelUpdates('game', $scope, function (game) {
        gameService.buildBoard(game, function (cfg) {
          $scope.board = new ChessBoard('board', cfg);
          $scope.status = gameService.updateStatus(game);
        });
      });
    });

  });
