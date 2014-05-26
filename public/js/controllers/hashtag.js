angular.module('mean.system').controller('HashtagController', ['$rootScope', '$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($rootScope, $scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {
    
    $scope.initializeHashtagPage = function() {
        // Defaults
        if ($stateParams.hashtag)       { $rootScope.hashtag = $stateParams.hashtag };
        // Fetch Medleys
        $rootScope.getFeed('Hashtag Medleys');
    };

    // Listeners - Medley Updated
    $scope.$on('MedleyUpdated', function(e, medley){
        angular.forEach($rootScope.medleys, function(m) {
            if (m._id == medley._id) { 
                m.votes = medley.votes
            };
        });
    });
     // Listener - Medley Deleted
    $scope.$on('MedleyDeleted', function(e, medley) {
        angular.forEach($rootScope.medleys, function(m, index) {
            if (m._id  == medley._id) { 
                $rootScope.medleys.splice(index, 1);
            };
        }); 
    });
}]); // hashtagController