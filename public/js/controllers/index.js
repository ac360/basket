angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Issues', 'Users', 'storage', '$stateParams', '$location', function ($scope, Global, Issues, Users, storage, $stateParams, $location) {
    
    // Set Defaults
    $scope.global = Global;
    $scope.gPlace;
    $scope.town = false;
    $scope.town.issues = false;
    $scope.status = false;

    // Check Local Storage
        // storage.set('status', 'one');
    switch (storage.get('status')) {
        case "registered":
            
        break;
    };
    console.log($stateParams.id);

    $scope.loadTown = function() {
        // Set Defaults
        $scope.town = {}
        $scope.town.issues = null;
        $scope.town.no_issues = false;
        $scope.town.new_issue = {};
            $scope.town.new_issue.title = null;
            $scope.town.new_issue.description = null;
            $scope.town.new_issue.anonymous = false;
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
        this.loadTownIssues();
        // Animated Elements
        mZoomIn('.mZoomIn');
    }; // loadCity

    $scope.loadTownIssues = function() {
        // Load Issues
        console.log("loading issues for: ", $scope.town.place_object.name);
        Issues.get({ google_place_id: $scope.town.place_object.id }, function(issues) {
            console.log(issues);
            $scope.town.issues = issues;
            if ($scope.town.issues.length < 1) {
                $scope.town.no_issues = true;
            } else {
                $scope.town.no_issues = false;
                $scope.town.issues.forEach(function(i) {
                    var l = new google.maps.LatLng(i.location.nb, i.location.ob)
                    i.marker = new google.maps.Marker({
                        position: l,
                        map: $scope.town.map
                    });
                });
            };
        });
    };

    $scope.getCurrentUser = function(cb) {
        Users.get({}, function(user) {
            console.log("Current User Fetched: ", user);
            if (user['0']) {
                cb(null);
            } else {
                cb(user);
            }
        });
    };

    $scope.newIssueModal = function() {
        this.getCurrentUser(function(user){
            if (user) {
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
                });
            } else {
                $('#signInModal').modal('show');
            };
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
        var self = this;
        var issue = new Issues({
            title:                               $scope.town.new_issue.title,
            description:                         $scope.town.new_issue.description,
            anonymous:                           $scope.town.new_issue.anonymous,
            location:                            $scope.town.new_issue.marker.position,
            google_place_name:                   $scope.town.place_object.name,
            google_place_formatted_address:      $scope.town.place_object.formatted_address,
            google_place_id:                     $scope.town.place_object.id,
            google_place_reference:              $scope.town.place_object.reference
        });
        issue.$save(function(response) {
            console.log(response);
            self.loadTownIssues()
            $('#issueModal').modal('hide');

        });
    };

}]);