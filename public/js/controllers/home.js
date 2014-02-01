angular.module('mean.system').controller('HomeController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'storage', '$state', '$stateParams', '$location', '$timeout', function ($scope, Global, Medleys, Retailers, Users, storage, $state, $stateParams, $location, $timeout) {

    // Initialization Methods At Bottom

    // Set Defaults
    $scope.global                   = Global;
    $scope.homeMedleys              = {};
    $scope.homeMedleys.most_voted   = {};
    $scope.homeMedleys.most_viewed  = {};
    $scope.homeMedleys.most_recent  = {};


    $scope.getMostVotedMedleys = function(cb){
        var self = this;
        Medleys.getMostVoted({}, function(medleys) {
            $scope.homeMedleys.most_voted.left_column  = [];
            $scope.homeMedleys.most_voted.right_column = [];
            for (var i=0;i<medleys.length;i++){
                // Set Medley Size
                angular.forEach(medleys[i].items, function(item) {
                    medleys[i] = Global.sizeMedleySmall(medleys[i]);
                });
                if ((i+2)%2==0) {
                    $scope.homeMedleys.most_voted.left_column.push(medleys[i]);
                }
                else {
                    $scope.homeMedleys.most_voted.right_column.push(medleys[i]);
                };
            }; // for
            // Callback
            if(cb){cb()};
        }); // Medleys.getMostVoted
    };

    $scope.getMostViewedMedleys = function(cb){
        var self = this;
        Medleys.getMostViewed({}, function(medleys) {
            $scope.homeMedleys.most_viewed.left_column  = [];
            $scope.homeMedleys.most_viewed.right_column = [];
            for (var i=0;i<medleys.length;i++){
                // Set Medley Size
                angular.forEach(medleys[i].items, function(item) {
                    medleys[i] = Global.sizeMedleySmall(medleys[i]);
                });
                if ((i+2)%2==0) {
                    $scope.homeMedleys.most_viewed.left_column.push(medleys[i]);
                }
                else {
                    $scope.homeMedleys.most_viewed.right_column.push(medleys[i]);
                };
            }; // for
            // Callback
            if(cb){cb()};
            console.log($scope.homeMedleys.most_viewed.left_column, $scope.homeMedleys.most_viewed.right_column)
        }); // Medleys.getMostViewed
    };

    // Initialize
    $scope.initializeHome = function() {
        var self = this;
        this.getMostVotedMedleys(function(){
          self.getMostViewedMedleys(function(){
            // Callback
          });
        });
    };

    $scope.initializeHome();
    
}]);