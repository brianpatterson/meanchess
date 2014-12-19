'use strict';

angular.module('meanChessApp')
  .controller('UserCtrl', function ($scope, $state, Auth, $location, $http, socket, challengeService, gameService) {
    if(!Auth.isLoggedIn()){
      $location.path('/');
    }

    $scope.curUser = Auth.getCurrentUser()._id;
    $scope.gameService = gameService;
    $scope.challengeService = challengeService;

    //Lists pending challenges
    challengeService.getNewChallenges(function (newChallenges){
      $scope.newChallenges = newChallenges;
      socket.syncUpdates('challenge', $scope.newChallenges, function(){
        $state.go($state.current, {}, {reload: true});
      });
    });

    //Lists your rejected challenges
    challengeService.getCancelledChallenges(function (cancelledChallenges){
      $scope.cancelledChallenges = cancelledChallenges;
      socket.syncUpdates('challenge', $scope.cancelledChallenges, function(){
        $state.go($state.current, {}, {reload: true});
      });
    });
    

    //Lists current games
    gameService.getMyGames(function (myGames){
      $scope.myGames = myGames;
      socket.syncUpdates('games', $scope.myGames, function(){
        $state.go($state.current, {}, {reload: true});
      });
    });

    $scope.challenge = function(form) {
      $scope.challengeMessage = challengeService.challenge(form);
    };

    $scope.goToGame = function(gameId){
      $location.path('/game/' + gameId);
    };

  });

