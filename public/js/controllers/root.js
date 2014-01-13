angular.module('mean.system').controller('RootController', ['$scope', 'Global', 'Issues', 'Users', 'storage', '$state', '$stateParams', '$location', function ($scope, Global, Issues, Users, storage, $state, $stateParams, $location) {

    // Initialization Methods At Bottom

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

    // Get The Current User
    $scope.getCurrentUser = function(cb) {
        Users.get({}, function(user) {
            console.log("Current User Fetched: ", user);
            if (user['0']) {
                cb(null);
            } else {
                $scope.user = user;
                if (cb) { cb(user) }; 
            };
        });
    };

    // Get The Current User
    $scope.loginFacebook = function(e, cb) {
        var self = this;
        e.preventDefault();
        if (!$scope.user) {
            FB.getLoginStatus(function(response) {
                  if (response.status === 'connected') {
                    // TODO:  UPDATE USER EMAIL ADDRESS ON LOGIN!
                    // the user is logged in and has authenticated your
                    // app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed
                    // request, and the time the access token 
                    // and signed request each expire
                    // var uid = response.authResponse.userID;
                    // var accessToken = response.authResponse.accessToken;
                    console.log('User is already logged into Facebook: ', response);
                    Users.signin(response.authResponse, function(user) {
                        console.log('Successfully logged in user: ', user);
                        $scope.user = user;
                        // If Sign In Modal is open, close it!
                        if ( $('#signInModal').hasClass('in') ) {
                            $('#signInModal').modal('hide');
                        };
                    });
                  } else {
                    // the user is logged in to Facebook, 
                    // but has not authenticated your app
                    FB.login(function(response) {
                       if (response.authResponse) {
                         console.log('Successfully Authenticated: ', response);
                         FB.api('/me', function(response) {
                           console.log('Successfully Retrieved User Information: ', response);
                           var newUser = new Users({
                                email:      response.email,
                                username:   response.username,
                                name:       response.name,
                                first_name: response.first_name,
                                last_name:  response.last_name,
                                gender:     response.gender,
                                locale:     response.locale,
                                timezone:   response.timezone,
                                fb_id:      response.id,
                                provider:   'facebook'
                           });
                           newUser.$save(function(user){
                                console.log("Successfully saved new user to database and signed in: ", user);
                                $scope.user = user;
                                // If Sign In Modal is open, close it!
                                if ( $('#signInModal').hasClass('in') ) {
                                    $('#signInModal').modal('hide');
                                };
                                if (cb) {cb()};
                           });
                         });
                       } else {
                         console.log('User cancelled login or did not fully authorize.');
                       }
                    }, {scope: 'email,user_likes'});
                  };
            });
        };
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
                    cursorcolor:"#7a756c",
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
                        map: $scope.town.map,
                        animation: google.maps.Animation.DROP
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

    $scope.reportIssue = function() {
        this.getCurrentUser(function(user){
            if ($scope.user) {
                // Hide Sign In Modal if it is shown
                $('#signInModal').modal('hide');
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

        // Initialize Facebook SDK
        window.fbAsyncInit = function() {
            // init the FB JS SDK
            FB.init({
              appId      : '490819701015510',                    // App ID from the app dashboard
              status     : true,                                 // Check Facebook Login status
              xfbml      : true                                  // Look for social plugins on the page
            });

            // Additional initialization code such as adding Event Listeners goes here
          };

          // Load the SDK asynchronously
          (function(){
             // If we've already installed the SDK, we're done
             if (document.getElementById('facebook-jssdk')) {return;}

             // Get the first script element, which we'll use to find the parent node
             var firstScriptElement = document.getElementsByTagName('script')[0];

             // Create a new script element and set its id
             var facebookJS = document.createElement('script'); 
             facebookJS.id = 'facebook-jssdk';

             // Set the new script's source to the source of the Facebook JS SDK
             facebookJS.src = '//connect.facebook.net/en_US/all.js';

             // Insert the Facebook JS SDK into the DOM
             firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
        }());

}]);