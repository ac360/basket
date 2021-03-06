angular.module('mean.system').controller('AdminController', ['$scope', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', 'Admin', function ($scope, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals, Admin) {

    // Defaults
    $scope.admin = {};

    $scope.InitializeAdmin = function() {
    	Admin.getUsers(function(users){
    		console.log("Users - Most Recent 40 Loaded: ", users);
    		$scope.admin.users = users;
    	});
    };

    $scope.deleteTestMedleys = function() {
        Admin.deleteTestMedleys(function(response){
            console.log("Tests Deleted!", response);
        });
    };

    $scope.deleteSessions = function() {
        Admin.deleteSessions(function(response){
            console.log(response);
        })
    };

    // Initialize
    if ($scope.user.admin) {
        $scope.InitializeAdmin();
    } else {
        // Listener - Authetication
        $scope.$on('SignedInViaFacebook', function(e, user){
            if ($scope.user.admin) {
            	$scope.InitializeAdmin();
            };
        });
    };

}]);