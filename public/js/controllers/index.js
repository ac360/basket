angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Issues', function ($scope, Global, Issues) {
    // Set Defaults
    $scope.global = Global;
    $scope.cityMode = false;
    $scope.gPlace;
   
    angular.extend($scope, {
        center: {
            latitude: 0, // initial map center latitude
            longitude: 0, // initial map center longitude
        },
        markers: [], // an array of markers,
        zoom: 8, // the zoom level
    });

    $scope.loadCity = function() {
        $scope.cityMode = true;
        $scope.city = $scope.gPlace.getPlace()
        console.log($scope.city);
    };

  

    $scope.newIssue = function() {
        $('#issueModal').modal('toggle');
    };

    $scope.createIssue = function() {
    	console.log(this.title, this.description);
    	if (this.title == undefined || this.description == undefined || this.title.length == 0 || this.description.length == 0 || this.city.length == 0 ) {
    		alert("Empty fields!");
    		return false;
    	};
     //    var issue = new Issues({
	    //     title:       this.title,
	    //     description: this.description
	    // });
	    // issue.$save(function(response) {
	    //     console.log(response);
	    // });
    };

    $scope.getIssues = function(city) {
        Issues.query({city: city.name, admin1: city.admin1_code }, function(issues, err) {
            $scope.issues = issues;
            console.log("Issues: ", issues);
        })
    };

}]);