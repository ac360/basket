angular.module('mean.system').controller('UserController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Initialization Methods At Bottom
   
    $scope.initializeUser = function() {
        Users.getUser({ username: $stateParams.username }, function(user) {
        	if (user) {
        		$scope.user_profile = user;
        		console.log("User Loaded: ", $scope.user_profile);
        		Medleys.getUserMedleys({ userId: user._id },function(medleys){
        			$scope.user_profile.medleys = [];
        			angular.forEach(medleys, function(medley) {
        				$scope.user_profile.medleys.push( Global.sizeMedleySmall(medley) );
        			})
		        });
        	} else {
        		$scope.user_profile = null;
        		console.log("User Not Found: ", $scope.user_profile);
        	};
        });
    }; // initializeUser();

    // Initialize

        // Listeners - Medley Updated
        $scope.$on('UserUpdated', function(e, user){});

        $scope.initializeUser();
    
}]);