angular.module('mean.system').controller('ProfileController', ['$rootScope', '$scope', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($rootScope, $scope, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Defaults

    $scope.initializeProfilePage = function() {
        // Fetch Medleys
        Users.getUser({ username: $stateParams.username, offset: $rootScope.medley_offset }, function(profile) {
            if (profile) {
                $rootScope.profile = profile;
                console.log("Profile Loaded: ", $rootScope.profile);
                $rootScope.getFeed("Profile Medleys");
            } else {
                $rootScope.profile = null;
                console.log("User Not Found: ", $rootScope.profile);
            };
        });
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
}]); // ProfileController