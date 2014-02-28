angular.module('mean.system').controller('ProfileController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Defaults
    $scope.profilepage = {};
    $scope.profilepage.medleys = false;

    $scope.initializeProfilePage = function() {
        Users.getUser({ username: $stateParams.username }, function(profile) {
            if (profile) {
                $scope.profilepage.profile = profile;
                console.log("Profile Loaded: ", $scope.profilepage.profile);
                $scope.MedleysByProfile($scope.profilepage.profile.username);
            } else {
                $scope.profilepage.profile = null;
                console.log("User Not Found: ", $scope.profilepage.profile);
            };
        });
    };
    $scope.MedleysByProfile = function(username) {
        // Fetch Your Medleys
        Medleys.getUserMedleys({ username: username },function(medleys) {
            $scope.profilepage.medleys = [];
            angular.forEach(medleys, function(medley) {
                $scope.profilepage.medleys.push( Global.sizeMedleySmall(medley) );
                Global.updateMedleyViewCount(medley.short_id);
            });
            console.log("Medleys by profile "+$scope.profilepage.profile.username+" loaded:", $scope.profilepage.medleys);
        });
    };
    
    // Initialize
        // Listeners - Medley Updated
        $scope.$on('MedleyUpdated', function(e, medley){
            angular.forEach($scope.profilepage.medleys, function(m) {
                if (m._id == medley._id) { 
                    m.votes = medley.votes
                };
            });
        });
         // Listener - Medley Deleted
        $scope.$on('MedleyDeleted', function(e, medley) {
            angular.forEach($scope.profilepage.medleys, function(m, index) {
                if (m._id  == medley._id) { 
                    $scope.profilepage.medleys.splice(index, 1);
                };
            }); 
        });
}]); // ProfileController