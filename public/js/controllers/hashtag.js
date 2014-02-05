angular.module('mean.system').controller('HashtagController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Initialization Methods At Bottom

    $scope.initializeHashtag = function() {
        	$scope.hashtag = $stateParams.hashtag;
    }; // initializeHashtag();

    // Initialize

        // Listeners - Medley Updated
        $scope.$on('HashtagUpdated', function(e, user){});

        $scope.initializeHashtag();
    
}]);