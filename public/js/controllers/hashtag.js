angular.module('mean.system').controller('HashtagController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Defaults
    $scope.hashtagpage              = {};
    $scope.hashtagpage.medleys      = false;
    $scope.hashtag_offset           = 0;
    $scope.fetching_hashtag_medleys = false;
    $scope.hashtagpage.medleys      = [];

    $scope.initializeHashtagPage = function() {
        $scope.MedleysByHashtag();
    };
    $scope.MedleysByHashtag = function(hashtag) {
        $scope.fetching_hashtag_medleys = true;
        if (hashtag) {
            $scope.hashtagpage.hashtag = hashtag;
        } else {
            $scope.hashtagpage.hashtag = $stateParams.hashtag;
        };
        Global.getMedleysByHashtag($scope.hashtag_offset, $scope.hashtagpage.hashtag, function(medleys) { 
            // Set Medley Size
            angular.forEach(medleys, function(medley) {
                $scope.hashtagpage.medleys.push( Global.sizeMedleySmall(medley) );
                Global.updateMedleyViewCount(medley.short_id);
            });
            console.log("Medleys by hashtag "+$scope.hashtagpage.hashtag+" loaded:", $scope.hashtagpage.medleys);
            $scope.hashtag_offset           = $scope.hashtag_offset + 20;
            $timeout(function(){
                $scope.fetching_hashtag_medleys = false;
            },1000);
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
        // Listener - Scroll for Infinite Loading
            $(window).scroll(function() {
                if ( $(window).scrollTop() >= ( $(document).height() - $(window).height() ) ) {
                    if ($state.current.name === "hashtag") {
                        // Browse Medleys Infinite Scroll
                        if ($scope.fetching_hashtag_medleys === false) {
                            console.log("infinite scroll activated")
                            $scope.MedleysByHashtag();
                        };
                    };
                };
            });
}]); // hashtagController