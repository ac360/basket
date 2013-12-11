angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Issues', function ($scope, Global, Issues) {
    
    $('#bettertown-map-container').slideDown("slow");
    // Set Defaults
    $scope.global = Global;
    $scope.gPlace;
    $scope.town = false;

    $scope.loadTown = function() {
        // Set Defaults
        $scope.town = {}
        $scope.town.new_issue = {};
            $scope.town.new_issue.title = null;
            $scope.town.new_issue.description = null;
            $scope.town.new_issue.marker = null;
            $scope.town.new_issue.map = null;
        $('#issue-map-options').hide()
        // Get Google Place Object
        $scope.town.place_object = $scope.gPlace.getPlace();
        console.log("Town Place Object: ", $scope.town.place_object);
        // Instantiate Map
        $scope.town.map_options = {
            center: new google.maps.LatLng($scope.town.place_object.geometry.location.nb, $scope.town.place_object.geometry.location.ob),
            zoom: 12,
            panControl: false
        };
        $scope.town.map = new google.maps.Map(document.getElementById("bettertown-map"), $scope.town.map_options);
        // Animated Elements
        mZoomIn('.mZoomIn');
    }; // loadCity

    $scope.newIssue = function() {
        $('#issueModal').modal('show');
        $('#issueModal').on('shown.bs.modal', function (e) {
            // Instantiate Second Map for Adding Issue
            if (!$scope.town.new_issue.map) {
                $scope.town.new_issue.map = new google.maps.Map(document.getElementById("issue-map-container"), $scope.town.map_options);
            };
            // Event Listeners
            google.maps.event.addListener($scope.town.new_issue.map, 'click', function(event) {
                if (!$scope.town.new_issue.marker) {
                    $scope.town.new_issue.marker = new google.maps.Marker({
                        position: event.latLng,
                        map: $scope.town.new_issue.map,
                        draggable: true
                    });
                    $('#issue-map-options').slideDown('fast');
                    console.log("Marker: ", $scope.town.new_issue.marker);
                    // google.maps.event.addListener($scope.new_issue.marker, 'dragend', function(event) {});
                }
            });
        })
    };

    $scope.removeIssueMarker = function() {
        if ($scope.town.new_issue.marker) {
            $scope.town.new_issue.marker.setMap(null)
            $scope.town.new_issue.marker = null;
            $('#issue-map-options').slideUp('fast');
        };
    };

    $scope.createIssue = function() {
    	if (this.title == undefined || this.description == undefined || this.title.length == 0 || this.description.length == 0 || this.city.length == 0 ) {
    		alert("Empty fields!");
    		return false;
    	};
        var issue = new Issues({
            title:       $scope.town.new_issue.title,
            description: $scope.town.new_issue.description,
            location:    $scope.town.new_issue.marker.position,
        });
        issue.$save(function(response) {
            console.log(response);
            
        });
    };

    $scope.getIssues = function(city) {
        Issues.query({city: city.name, admin1: city.admin1_code }, function(issues, err) {
            $scope.issues = issues;
            console.log("Issues: ", issues);
        })
    };

}]);