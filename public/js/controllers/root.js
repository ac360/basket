angular.module('mean.system').controller('RootController', ['$scope', 'Global', 'Issues', 'Users', 'storage', '$state', '$stateParams', '$location', function ($scope, Global, Issues, Users, storage, $state, $stateParams, $location) {

    // Set Defaults
    $scope.global = Global;
    $scope.gPlace;
    $scope.town = false;
    $scope.town.issues = false;
    $scope.status = false;
    $scope.user = false;

    // Check Local Storage
        // storage.set('status', 'one');
    switch (storage.get('status')) {
        case "registered":
        break;
    };

    // Initialization Methods At Bottom

    // Get The Current User
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
        // Get Google Place Object
        $scope.town.place_object = $scope.gPlace.getPlace();
        console.log("Town Place Object: ", $scope.town.place_object);
        $('#issue-map-options').hide()
        // Instantiate Map
        $scope.town.map_options = {
            center: new google.maps.LatLng($scope.town.place_object.geometry.location.b, $scope.town.place_object.geometry.location.d),
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
        // Clear Any Existing Issues so that the Reload is Clean
        if ($scope.town.issues) {
            $scope.town.issues.forEach(function(i) {
                i.marker.setMap(null)
            });
        };
        // Load Issues
        console.log("loading issues for: ", $scope.town.place_object.name);
        Issues.get({ google_place_id: $scope.town.place_object.id }, function(issues) {
            console.log(issues);
            $scope.town.issues = issues;
            if ($scope.town.issues.length < 1) {
                $scope.town.no_issues = true;
            } else {
                $scope.town.no_issues = false;
                // Instantiate NiceScroll
                $("#issues-container").niceScroll({
                    cursorcolor:"#2f85a7",
                    cursorborder: "0px solid #fff",
                    railalign: 'right',
                    cursorwidth: '6px'
                });
                // Draw Marker SVG
                // var SQUARE_PIN = 'M 50 -119.876 -50 -119.876 -50 -19.876 -13.232 -19.876 0.199 0 13.63 -19.876 50 -19.876 Z';
                $scope.town.issues.forEach(function(i) {
                    var l = new google.maps.LatLng(i.location.b, i.location.d)
                    i.marker = new google.maps.Marker({
                        position: l,
                        map: $scope.town.map
                        // icon: {
                        //     path: SQUARE_PIN,
                        //     fillColor: '#F36865',
                        //     fillOpacity: 1,
                        //     strokeColor: '#999',
                        //     strokeWeight: 0,
                        //     scale: 0.2
                        // }
                    });
                });
            };
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

    // Initialization Methods

        // Get Current User
        $scope.getCurrentUser(function(user){
            if(user){
                $scope.user = user;
            }
        });

        console.log("Root Scope:", $scope);

}]);