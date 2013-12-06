angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Issues', function ($scope, Global, Issues) {
    // Set Defaults
    $scope.global = Global;
    $scope.gPlace;

    $scope.loadCity = function() {
        $scope.cityMode = true;
        $scope.place = $scope.gPlace.getPlace()
        console.log($scope.place);
        $scope.coordinates = $scope.place.geometry.location;
        var mapOptions = {
          center: new google.maps.LatLng($scope.coordinates.pb, $scope.coordinates.qb),
          zoom: 13
        };
        var map = new google.maps.Map(document.getElementById("bettertown-map"), mapOptions);
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