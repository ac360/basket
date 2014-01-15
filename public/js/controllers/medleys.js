angular.module('mean.medleys').controller('MedleysController', ['$scope', '$location', 'Global', 'medleys', 'Votes', '$timeout', function ($scope, $location, Global, medleys, Votes, $timeout) {
    $scope.global         = Global;
    $scope.activeMedley    = false;
    $scope.descLimit      = 42;
    $scope.voteChecking   = false;
    $scope.vote           = false;
    $scope.hasVoted       = false;

    $scope.showMedley = function(medley, $event) {
        $scope.activeMedley = medley;
        // Pan & Zoom to medley on map
        $scope.$parent.$parent.town.map.panTo(new google.maps.LatLng( $scope.activeMedley.location.b, $scope.activeMedley.location.d ));
        $scope.$parent.$parent.town.map.setZoom(13);
        $scope.activeMedley.marker.setAnimation(google.maps.Animation.BOUNCE);
        console.log(medley._id)

        // Update View Count
        Medleys.updateViewCount({ medleyId: medley._id }, function(i) {
            console.log("View count updated for:", i);
            $scope.activeMedley.views = i.views;
        });

        // Check & Show Vote Status
        if ($scope.$parent.$parent.user) {
            Votes.findByMedleyAndUserId({medley: $scope.activeMedley._id, user: $scope.$parent.$parent.user._id}, function(vote) {
                // If User Has Not Voted
                if (vote.errors && vote.errors.code == 404 ) {
                    $('.votes-number').removeClass('has-voted');
                    $scope.vote = false;
                // If User Has Voted
                } else {
                    $('.votes-number').addClass('has-voted');
                    $scope.vote = vote;
                };
            });
        }   
    };

    $scope.hideMedley = function() {
        // Stop Marker Bounce Animation
        $scope.activeMedley.marker.setAnimation(null);
        $scope.activeMedley = false;
        // Pan Zoom back to Town
        $scope.$parent.$parent.town.map.panTo(new google.maps.LatLng($scope.$parent.$parent.town.place_object.geometry.location.b, $scope.$parent.$parent.town.place_object.geometry.location.d));
        $scope.$parent.$parent.town.map.setZoom(12)
    };

    $scope.voteMedley = function() {
        // Show Vote Spinner
        $scope.voteChecking = true;
        // Check if User is Logged In
        if ($scope.$parent.$parent.user) {
            // Check for Existing Vote
            // If User Has Voted, Remove Vote
            if ($scope.vote) {
                // Fetch Medley and Subtract Vote
                Medleys.show({ medleyId: $scope.activeMedley._id }, function(i) {
                    i.votes = i.votes - 1;
                    Medleys.update({medleyId: $scope.activeMedley._id}, i, function(i) {
                        console.log("Vote count subtracted:", i);
                        var vote = $scope.vote;
                        vote.$delete(function(v) {
                            console.log("Vote Destroyed!: ", v);
                            $timeout(function() {
                                $scope.voteChecking = false;
                                $scope.vote = false;
                                $('.votes-number').removeClass('has-voted');
                                // Set New Vote Total
                                $scope.activeMedley.votes = i.votes;
                            }, 500);
                        })
                    });
                });
            // If User Hasn't Voted, Add Vote
            } else {
                // Fetch Medley and Add Vote
                medleys.show({ medleyId: $scope.activeMedley._id }, function(i) {
                    i.votes = i.votes + 1;
                    medleys.update({medleyId: $scope.activeMedley._id}, i, function(i) {
                        console.log("Vote count added: ", i);
                        // Save Vote
                        var vote = new Votes();
                        vote.medley = i._id
                        vote.user  = $scope.$parent.$parent.user._id
                        vote.$save(function(v) {
                            console.log("Vote record created: ", v);
                            $timeout(function() {
                                $scope.voteChecking = false;
                                $scope.vote = v;
                                $('.votes-number').addClass('has-voted');
                                // Set New Vote Total
                                $scope.activeMedley.votes = i.votes;
                            }, 500);
                        });
                    });
                });
            };
        } else {
            $('#signInModal').modal('show');
            $scope.voteChecking = false;
        };
    };

    $scope.find = function(query) {
        Medleys.query(query, function(medleys) {
            $scope.medleys = medleys;
        });
    };

    $scope.findOne = function() {
        Medleys.get({
            medleyId: $routeParams.medleyId
        }, function(medley) {
            $scope.medley = medley;
        });
    };
}]);