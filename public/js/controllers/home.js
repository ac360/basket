angular.module('mean.system').controller('HomeController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'storage', '$state', '$stateParams', '$location', '$timeout', function ($scope, Global, Medleys, Retailers, Users, storage, $state, $stateParams, $location, $timeout) {

    // Initialization Methods At Bottom

    // Defaults

    // Methods

    $scope.getMostVotedMedleys = function(cb){
        console.log("hello")
        Medleys.getMostVoted({}, function(medleys) {
            $scope.most_voted = [];
            // Set Medley Size
            angular.forEach(medleys, function(medley) {
                $scope.most_voted.push( Global.sizeMedleySmall(medley) );
                Global.updateMedleyViewCount(medley.short_id);
            });
            console.log($scope.most_voted)
        }); // Medleys.getMostVoted
    };

    $scope.getMostViewedMedleys = function(cb){
        Medleys.getMostViewed({}, function(medleys) {
            $scope.most_viewed = [];
            // Set Medley Size
            angular.forEach(medleys, function(medley) {
                $scope.most_viewed.push( Global.sizeMedleySmall(medley) );
                Global.updateMedleyViewCount(medley.short_id);
            });
            console.log($scope.most_viewed)
            if(cb) { cb() };
        }); // Medleys.getMostViewed
    };

    $scope.initializeHome = function() {
        if (!$scope.most_voted){
            $scope.getMostVotedMedleys();
        }
        if (!$scope.most_viewed){
            $scope.getMostViewedMedleys();
        }
    };

    // Initialize
        $timeout(function(){
            $scope.initializeHome();
        });

        // Listeners
        $scope.$on('MedleyUpdated', function(e, medley){
            console.log(medley);
            angular.forEach($scope.most_voted, function(m) {
                if (m._id == medley._id) { 
                    m.votes = medley.votes
                };
            });
            angular.forEach($scope.most_viewed, function(m) {
                if (m._id == medley._id) { 
                    m.votes = medley.votes
                };
            });
        });



}]);






