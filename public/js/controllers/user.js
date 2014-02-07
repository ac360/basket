angular.module('mean.system').controller('UserController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Defaults
    $scope.userpage = {}

    // Methods
    $scope.initializeUser = function() {
        Users.getUser({ username: $stateParams.username }, function(user) {
        	if (user) {
        		$scope.userpage.user = user;
        		console.log("User Loaded: ", $scope.userpage.user);
        		Medleys.getUserMedleys({ userId: $scope.userpage.user._id },function(medleys){
        			$scope.userpage.medleys = [];
        			angular.forEach(medleys, function(medley) {
        				$scope.userpage.medleys.push( Global.sizeMedleySmall(medley) );
                        Global.updateMedleyViewCount(medley.short_id);
        			})
		        });
        	} else {
        		$scope.userpage.user = null;
        		console.log("User Not Found: ", $scope.userpage.user);
        	};
        });
    }; // initializeUser();

    // Initialize

        // Listeners - User Updated
        $scope.$on('UserUpdated', function(e, user){});
        // Listeners - Medley Updated
        $scope.$on('MedleyUpdated', function(e, medley){
            angular.forEach($scope.userpage.medleys, function(m) {
                if (m._id == medley._id) { 
                    m.votes = medley.votes
                };
            });
        });

        $scope.initializeUser();
    
}]);