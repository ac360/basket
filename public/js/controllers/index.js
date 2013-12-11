angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Issues', function ($scope, Global, Issues) {
    // Set Defaults
    $scope.global = Global;
    $scope.gPlace;
    $scope.townMode = false;
    $scope.new_issue = {};
        $scope.new_issue.title;
        $scope.new_issue.description;
        $scope.new_issue.map;
        $scope.new_issue.marker = null;

    $scope.loadCity = function() {
        $scope.townMode = true;
        $scope.town = $scope.gPlace.getPlace();
        console.log("Town: ", $scope.town);
        $scope.map_options = {
            center: new google.maps.LatLng($scope.town.geometry.location.nb, $scope.town.geometry.location.ob),
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
        console.log($scope);
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
        $('#issueModal').modal('show');
        $('#issueModal').on('shown.bs.modal', function (e) {
            $scope.new_issue.map = new google.maps.Map(document.getElementById("issue-map-container"), $scope.map_options);
              google.maps.event.addListener($scope.new_issue.map, 'click', function(event) {
                if (!$scope.new_issue.marker) {
                    $scope.new_issue.marker = new google.maps.Marker({
                        position: event.latLng,
                        map: $scope.new_issue.map,
                        title: 'Issue',
                        draggable: true
                    });
                    // google.maps.event.addListener($scope.new_issue.marker, 'dragend', function(event) {});
                } else {};
            });
        })
    };

    $scope.removeIssueMarker = function() {
        if ($scope.new_issue.marker) {
            $scope.new_issue.marker.setMap(null)
            $scope.new_issue.marker = null;
        };
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