'use strict';

angular.module('meanChessApp')
  .service('gameService', function ($http, $location, Auth, challengeService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var curUser = Auth.getCurrentUser()._id;
    
    this.getMyGames = function(callback){
      $http.get('/api/games/me',{
        params: {
          me: curUser
        }
      }).success(function(myGames) {
        callback(myGames);
      });
    };

    this.getActiveGame = function(gameId, callback){
      var self = this;
      $http.get('/api/games/' + gameId)
      .success(function(game) {
        self.buildBoard(game, function(cfg){
          callback(cfg, game);
        });
      });
    };

    this.createGame = function(white, black, challenge){
      $http.post('api/games', {
        white: white,
        black: black
      }).then(function(res){
        $location.path('/game/' + res.data._id);
      }).catch(function(err){
        console.log(err.data);
      }).then(function(){
        challengeService.deleteChallenge(challenge);
      });
    };

    this.deleteGame = function(game){
      $http.delete('/api/games/' + game._id);
    };

    //Keeping comment for when I can actually get this refactor to work

    // this.buildBoard = function(game, callback){
    //   var chess = new Chess(game.fenstring);

    //   var onDragStart = function(source, piece){
    //     if(chess.game_over() ||
    //       (game.black !== curUser && game.white !== curUser) ||
    //       (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
    //       (chess.turn() === 'b' && piece.search(/^w/) !== -1) ||
    //       (chess.turn() === 'w' && game.black === curUser) ||
    //       (chess.turn() === 'b' && game.white === curUser)){
    //       return false;
    //     }
    //   };

    //   var onDrop = function(source, target){
    //     $http.put('/api/games/' + game._id, {source: source, target: target})
    //     .catch(function(err){
    //       console.log('Something went wrong: ', err);
    //     });
    //     return 'snapback';
    //   };


    //   var cfg = {
    //     position: game.fenstring,
    //     draggable: true,
    //     onDrop: onDrop,
    //     onDragStart: onDragStart
    //   };

    //   if(curUser === game.black){
    //     cfg.orientation = 'black';
    //   }

    //   callback(cfg);
    // };

    // this.updateStatus = function(game) {
    //   var chess = new Chess(game.fenstring);
    //   var status = '';

    //   var moveColor = 'White';
    //   if (chess.turn() === 'b') {
    //     moveColor = 'Black';
    //   }

    //   // checkmate?
    //   if (chess.in_checkmate() === true) {
    //     status = 'Game over, ' + moveColor + ' is in checkmate.';
    //   }
    //   // draw?
    //   else if (chess.in_draw() === true) {
    //     status = 'Game over, drawn position';
    //   }
    //   // game still on
    //   else {
    //     status = moveColor + ' to move';
    //     // check?
    //     if (chess.in_check() === true) {
    //       status += ', ' + moveColor + ' is in check';
    //     }
    //   }
    //   return status;
    // };
  });
