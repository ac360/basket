angular.module('mean.system').controller('HashtagController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Initialization Methods At Bottom

    $scope.initializeHashtag = function() {
        	if ($scope.user) {
        		Medleys.getUserMedleys({ userId: $scope.user._id },function(medleys){
        			$scope.user.medleys = [];
        			angular.forEach(medleys, function(medley) {
        				$scope.user.medleys.push( Global.sizeMedleySmall(medley) );
        			})
		        });
        	} else {
        		console.log("User Not Logged In: ", $scope.user);
        	};
    }; // initializeProfile();

    // Initialize

        // Listeners - Medley Updated
        $scope.$on('HashtagUpdated', function(e, user){});

        $scope.initializeHashtag();
    
}]);