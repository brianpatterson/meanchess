'use strict';

angular.module('meanChessApp')
  .controller('GameCtrl', function ($scope, Auth, $location, $http, socket, $stateParams) {
    if(!Auth.isLoggedIn()){
      $location.path('/');
    }
    $scope.gameId = $stateParams.gameId;
    $scope.curUser = Auth.getCurrentUser()._id;

    //Keeping comment for when I have time to get this refactor to actually work

    // gameService.getActiveGame($scope.gameId, function (cfg, game) {
    //   $scope.board = new ChessBoard('board', cfg);
    //   $scope.status = gameService.updateStatus(game);
    //   socket.syncModelUpdates('game', $scope, function (game) {
    //     gameService.buildBoard(game, function (cfg) {
    //       $scope.board = new ChessBoard('board', cfg);
    //       $scope.status = gameService.updateStatus(game);
    //     });
    //   });
    // });


    $http.get('/api/games/' + $scope.gameId)
    .success(function(game) {
      $scope.game = game;
      $scope.buildBoard(game);
      socket.syncModelUpdates('game', $scope, function(game){
        $scope.buildBoard(game);
      });
    });

    $scope.buildBoard = function(game){

      var chess = new Chess(game.fenstring);

      var onDragStart = function(source, piece){
        if(chess.game_over() ||
          (game.black !== $scope.curUser && game.white !== $scope.curUser) ||
          (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
          (chess.turn() === 'b' && piece.search(/^w/) !== -1) ||
          (chess.turn() === 'w' && game.black === $scope.curUser) ||
          (chess.turn() === 'b' && game.white === $scope.curUser)){
          return false;
        }
      };

      var onDrop = function(source, target){
        $http.put('/api/games/' + $scope.gameId, {source: source, target: target})
        .catch(function(err){
          console.log('Something went wrong: ', err);
        });
        return 'snapback';
      };

      var updateStatus = function() {
        var status = '';

        var moveColor = 'White';
        if (chess.turn() === 'b') {
          moveColor = 'Black';
        }

        // checkmate?
        if (chess.in_checkmate() === true) {
          status = 'Game over, ' + moveColor + ' is in checkmate.';
        }
        // draw?
        else if (chess.in_draw() === true) {
          status = 'Game over, drawn position';
        }
        // game still on
        else {
          status = moveColor + ' to move';
          // check?
          if (chess.in_check() === true) {
            status += ', ' + moveColor + ' is in check';
          }
        }
        $scope.status = status;
      };

      var cfg = {
        position: game.fenstring,
        draggable: true,
        onDrop: onDrop,
        onDragStart: onDragStart
      };

      if($scope.curUser === game.black){
        cfg.orientation = 'black';
      }

      updateStatus();
      $scope.board = new ChessBoard('board', cfg);
    };
  });
