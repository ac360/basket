angular.module('mean.issues').controller('IssuesController', ['$scope', '$location', 'Global', 'Issues', 'Votes', '$timeout', function ($scope, $location, Global, Issues, Votes, $timeout) {
    $scope.global         = Global;
    $scope.activeIssue    = false;
    $scope.descLimit      = 42;
    $scope.voteChecking   = false;
    $scope.vote           = false;
    $scope.hasVoted       = false;

    $scope.showIssue = function(issue, $event) {
        $scope.activeIssue = issue;
        // Pan & Zoom to issue on map
        $scope.$parent.$parent.town.map.panTo(new google.maps.LatLng( $scope.activeIssue.location.b, $scope.activeIssue.location.d ));
        $scope.$parent.$parent.town.map.setZoom(13);
        $scope.activeIssue.marker.setAnimation(google.maps.Animation.BOUNCE);
        console.log(issue._id)

        // Update View Count
        var tempIssue = {}
        tempIssue.views = issue.views + 1;
        Issues.update({issueId: issue._id}, tempIssue, function(i){
            console.log("View count updated for:", i);
            $scope.activeIssue.views = i.views;
        });

        // Check & Show Vote Status
        if ($scope.$parent.$parent.user) {
            Votes.findByIssueAndUserId({issue: $scope.activeIssue._id, user: $scope.$parent.$parent.user._id}, function(vote) {
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

    $scope.hideIssue = function() {
        // Stop Marker Bounce Animation
        $scope.activeIssue.marker.setAnimation(null);
        $scope.activeIssue = false;
        // Pan Zoom back to Town
        $scope.$parent.$parent.town.map.panTo(new google.maps.LatLng($scope.$parent.$parent.town.place_object.geometry.location.b, $scope.$parent.$parent.town.place_object.geometry.location.d));
        $scope.$parent.$parent.town.map.setZoom(12)
    };

    $scope.voteIssue = function() {
        // Show Vote Spinner
        $scope.voteChecking = true;
        // Check if User is Logged In
        if ($scope.$parent.$parent.user) {
            // Check for Existing Vote
            // If User Has Voted, Remove Vote
            if ($scope.vote) {
                // Fetch Issue and Subtract Vote
                Issues.show({ issueId: $scope.activeIssue._id }, function(i) {
                    i.votes = i.votes - 1;
                    Issues.update({issueId: $scope.activeIssue._id}, i, function(i) {
                        console.log("Vote count subtracted:", i);
                        var vote = $scope.vote;
                        vote.$delete(function(v) {
                            console.log("Vote Destroyed!: ", v);
                            $timeout(function() {
                                $scope.voteChecking = false;
                                $scope.vote = false;
                                $('.votes-number').removeClass('has-voted');
                                // Set New Vote Total
                                $scope.activeIssue.votes = i.votes;
                            }, 500);
                        })
                    });
                });
            // If User Hasn't Voted, Add Vote
            } else {
                // Fetch Issue and Add Vote
                Issues.show({ issueId: $scope.activeIssue._id }, function(i) {
                    i.votes = i.votes + 1;
                    Issues.update({issueId: $scope.activeIssue._id}, i, function(i) {
                        console.log("Vote count added: ", i);
                        // Save Vote
                        var vote = new Votes();
                        vote.issue = i._id
                        vote.user  = $scope.$parent.$parent.user._id
                        vote.$save(function(v) {
                            console.log("Vote record created: ", v);
                            $timeout(function() {
                                $scope.voteChecking = false;
                                $scope.vote = v;
                                $('.votes-number').addClass('has-voted');
                                // Set New Vote Total
                                $scope.activeIssue.votes = i.votes;
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
        Issues.query(query, function(issues) {
            $scope.issues = issues;
        });
    };

    $scope.findOne = function() {
        Issues.get({
            issueId: $routeParams.issueId
        }, function(issue) {
            $scope.issue = issue;
        });
    };
}]);