angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Issues', function ($scope, Global, Issues) {
    
    $('#bettertown-map-container').slideDown("slow");
    // Set Defaults
    $scope.global = Global;
    $scope.gPlace;
    $scope.town = false;
    $scope.town.issues = false;

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
        // Load Issues
        this.loadCityIssues();
        // Animated Elements
        mZoomIn('.mZoomIn');
    }; // loadCity

    $scope.loadCityIssues = function() {
        // Load Issues
        Issues.query({ google_place_formatted_address: $scope.town.place_object.formatted_address}, function(issues) {
            console.log(issues);
            $scope.town.issues = issues;
            $scope.town.issues.forEach(function(i) {
                var l = new google.maps.LatLng(i.location.nb, i.location.ob)
                i.marker = new google.maps.Marker({
                    position: l,
                    map: $scope.town.map
                });
            });
        });
    };

    $scope.removeIssues = function() {
        // Clear Existing Issues
        if ($scope.town.issues) {
            $scope.town.issues.forEach(function(i){
                i.marker.setMap(null)
            });
            $scope.town.issues = false;
        };
    };

    $scope.newIssue = function() {
        $('#issueModal').modal('show');
        $('#issueModal').on('shown.bs.modal', function (e) {
            // Instantiate Second Map for Adding Issue
            if (!$scope.town.new_issue.map) {
                var viewport = $scope.town.map.getBounds()
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
                    console.log("Marker Object: ", $scope.town.new_issue.marker);
                    console.log("Marker getPosition Result: ", $scope.town.new_issue.marker.getPosition());
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
        var issue = new Issues({
            title:                               $scope.town.new_issue.title,
            description:                         $scope.town.new_issue.description,
            location:                            $scope.town.new_issue.marker.position,
            google_place_name:                   $scope.town.place_object.name,
            google_place_formatted_address:      $scope.town.place_object.formatted_address,
            google_place_id:                     $scope.town.place_object.id,
            google_place_reference:              $scope.town.place_object.reference
        });
        issue.$save(function(response) {
            console.log(response);
            $('#issueModal').modal('hide');
        });
    };

    $scope.getIssues = function(city) {
        Issues.query({city: city.name, admin1: city.admin1_code }, function(issues, err) {
            $scope.issues = issues;
            console.log("Issues: ", issues);
        })
    };

    $scope.testFunction = function() {
        var viewport = $scope.town.map.getBounds()
        console.log(viewport);
    };

}]);