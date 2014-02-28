angular.module('mean.system').controller('HashtagController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Defaults
    $scope.hashtagpage         = {};
    $scope.hashtagpage.medleys = false;

    $scope.initializeHashtagPage = function() {
        $scope.MedleysByHashtag();
    };
    $scope.MedleysByHashtag = function(hashtag) {
        if (hashtag) {
            $scope.hashtagpage.hashtag = hashtag;
        } else {
            $scope.hashtagpage.hashtag = $stateParams.hashtag;
        };
        Global.getMedleysByHashtag($scope.hashtagpage.hashtag, function(medleys) { 
            $scope.hashtagpage.medleys = [];
            // Set Medley Size
            angular.forEach(medleys, function(medley) {
                $scope.hashtagpage.medleys.push( Global.sizeMedleySmall(medley) );
                Global.updateMedleyViewCount(medley.short_id);
            });
            console.log("Medleys by hashtag "+$scope.hashtagpage.hashtag+" loaded:", $scope.hashtagpage.medleys);
        });
    };
    
    // Initialize
        // Listeners - Medley Updated
        $scope.$on('MedleyUpdated', function(e, medley){
            angular.forEach($scope.hashtagpage.medleys, function(m) {
                if (m._id == medley._id) { 
                    m.votes = medley.votes
                };
            });
        });
         // Listener - Medley Deleted
        $scope.$on('MedleyDeleted', function(e, medley) {
            angular.forEach($scope.hashtagpage.medleys, function(m, index) {
                if (m._id  == medley._id) { 
                    $scope.hashtagpage.medleys.splice(index, 1);
                };
            }); 
        });
}]); // hashtagController