angular.module('mean.system').controller('HashtagController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Defaults
    $scope.hashtagpage = {};

    $scope.initializeHashtag = function() {
        	$scope.hashtagpage.hashtag = $stateParams.hashtag;
        	$scope.hashtagpage.medleys = [];
        	Global.getMedleysByHashtag($scope.hashtagpage.hashtag, function(medleys){
        		// Set Medley Size
	            angular.forEach(medleys, function(medley) {
	                $scope.hashtagpage.medleys.push( Global.sizeMedleySmall(medley) );
	                Global.updateMedleyViewCount(medley.short_id);
	            });
	            console.log("Hashtag Medleys Loaded:", $scope.hashtagpage.medleys)
        	});
    }; // initializeHashtag();

    // Initialize

        // Listeners - Medley Updated
        $scope.$on('MedleyUpdated', function(e, medley){
            angular.forEach($scope.hashtagpage.medleys, function(m) {
                if (m._id == medley._id) { 
                    m.votes = medley.votes
                };
            });
        });

        $scope.initializeHashtag();
    
}]);