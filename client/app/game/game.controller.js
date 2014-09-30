'use strict';

angular.module('3dchessApp')
  .controller('GameCtrl', function ($scope, Auth, $location, $http, socket, $stateParams) {

    $scope.gameId = $stateParams.gameId;
    $scope.curUser = Auth.getCurrentUser()._id;

    $http.get('/api/games/' + $scope.gameId)
    .success(function(game) {
      $scope.game = game;
      $scope.buildBoard(game);
      socket.syncUpdates('game', $scope.game);
    });

    $scope.buildBoard = function(game){
    //   var onDragStart = function(source, piece, position, orientation){
    //     //TODO: Validate to make sure the person whose turn
    //     //it is is the only person who can play.
    //     //This includes validating that people who aren't
    //     //members of this game can't play, and that
    //     //the black user can't move the white user's pieces.
    //     $http.get('/api/games/'+ $scope.gameId, {
    //       params: {
    //         me: $scope.curUser
    //       }
    //     }).then(function(){

    //     }).catch(function(){

    //     });
    //   };

      // var onDrop = function(source, target){
      //   $http.put('/api/games/' + $scope.gameId, {source: source, target: target})
      //   .catch(function(err){
      //     console.log('Something went wrong: ', err);
      //   })
      //   .then(function(){
      //     $scope.board = new ChessBoard('board', cfg);
      //   });
      // };

      var cfg = {
        position: game.fenstring,
        draggable: true,
      };
      
      if($scope.curUser === game.black){
        cfg.orientation = 'black';
      }

      $scope.board = new ChessBoard('board', cfg);
    };
  });
