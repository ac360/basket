angular.module('mean.system').controller('ProfileController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Defaults
    $scope.profilepage = {}

    // Methods
    $scope.initializeProfile = function() {
            // Fetch Your Medleys
        	if ($scope.user) {
        		Medleys.getUserMedleys({ userId: $scope.user._id },function(medleys){
        			$scope.profilepage.medleys = [];
        			angular.forEach(medleys, function(medley) {
        				$scope.profilepage.medleys.push( Global.sizeMedleySmall(medley) );
        			});
		        });
        	} else {
        		console.log("User Not Logged In: ", $scope.user);
        	};
    }; // initializeProfile();

    // Initialize

        // Listeners - Profile Updated
        $scope.$on('ProfileUpdated', function(e, user){});
        // Listeners - Medley Updated
        $scope.$on('MedleyUpdated', function(e, medley){
            angular.forEach($scope.profilepage.medleys, function(m) {
                if (m._id == medley._id) { 
                    m.votes = medley.votes
                };
            });
        });

        $scope.initializeProfile();
    
}]);