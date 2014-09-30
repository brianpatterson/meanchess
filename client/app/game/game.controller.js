'use strict';

angular.module('3dchessApp')
  .controller('GameCtrl', function ($scope, Auth, $location, $http, socket, $stateParams) {

    $scope.gameId = $stateParams.gameId;
    $scope.curUser = Auth.getCurrentUser()._id;

    $http.get('/api/games/' + $scope.gameId)
    .success(function(game) {
      $scope.game = game;
      $scope.buildBoard(game);
      socket.syncModelUpdates('game', $scope, function(game){
        $scope.buildBoard(game);
      });
    });

    $scope.buildBoard = function(game){
      var onDragStart = function(source, piece, position, orientation){
        //TODO: Validate to make sure the person whose turn
        //it is is the only person who can play.
        //This includes validating that people who aren't
        //members of this game can't play, and that
        //the black user can't move the white user's pieces.
        var chess = new Chess(game.fenstring);

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
        })
        return 'snapback';
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

      $scope.board = new ChessBoard('board', cfg);
    };
  });
