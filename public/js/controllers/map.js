angular.module('mean.system').controller('MapController', ['$scope', 'Global', 'Issues', function ($scope, Global, Issues) {

	$scope.center = { latitude: 0, longitude: 0 }
	$scope.markers = [];
	$scope.zoom = 8;

    $scope.tester = "helloW";

}]);