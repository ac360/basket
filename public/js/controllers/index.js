angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Issues', function ($scope, Global, Issues) {
    // Set Defaults
    $scope.global = Global;
    $scope.gPlace;

    $scope.loadCity = function() {
        $scope.cityMode = true;
        $scope.place = $scope.gPlace.getPlace();
        console.log($scope.place);
        $scope.coordinates = $scope.place.geometry.location;
        $scope.map_options = {
            center: new google.maps.LatLng($scope.coordinates.pb, $scope.coordinates.qb),
            zoom: 12,
            panControl: false
        };
        $scope.map = new google.maps.Map(document.getElementById("bettertown-map"), $scope.map_options);

        google.maps.event.addListener($scope.map, 'click', function(event) {
            console.log(event);
            $scope.marker = new google.maps.Marker({
                position: event.latLng,
                map: $scope.map,
                title: 'Issue',
                draggable: true
            });
            google.maps.event.addListener($scope.marker, 'dragend', function(event) {
                console.log(event);
            });
        });
    }; // loadCity

    $scope.addMarker = function() {
        alert("Tap location in this map");
        google.maps.event.addListener(map, 'click', function(event) {
            console.log(event);
            // mArray[count] = new google.maps.Marker({
            //     position: event.latLng,
            //     map: map
            // });
            // mArray[count].getPosition();
        });
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