angular.module('mean.issues').controller('IssuesController', ['$scope', '$location', 'Global', 'Issues', 'Votes', '$timeout', function ($scope, $location, Global, Issues, Votes, $timeout) {
    $scope.global = Global;
    $scope.activeIssue = false;
    $scope.descLimit = 42;
    $scope.voteChecking = false;

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
        $scope.$parent.$parent.getCurrentUser( function(u) {
            if (u) {
                // Check for Existing Vote
                Votes.findByIssueAndUserId({issue: $scope.activeIssue._id, user: u._id}, function(vote) {
                    console.log("Vote Reponse:", vote);
                    if (vote.errors && vote.errors.code == 404 ) {
                        // Update Vote Count
                        Issues.show({ issueId: $scope.activeIssue._id }, function(i) {
                            i.votes = i.votes + 1;
                            Issues.update({issueId: $scope.activeIssue._id}, i, function(i) {
                                console.log("View count updated for:", i);
                                $scope.voteChecking = false;
                                $scope.activeIssue.votes = i.votes;
                                var vote = new Votes();
                                vote.issue = i._id
                                vote.user  = u._id
                                vote.$save(function(v) {
                                  console.log("vote saved: ", v);
                                });
                            });
                        });
                    } else {
                        console.log("User has already voted for this issue.");
                        $('.votes-title').tooltip({
                            animation: true,
                            placement: 'top',
                            title: "You've Already Voted For This",
                            trigger: 'manual'
                        });
                        $('.votes-title').tooltip('show')
                        setTimeout(function(){
                            $('.votes-title').tooltip('hide');
                        }, 4000);
                        $timeout(function() {
                            $scope.voteChecking = false;
                        }, 500);
                    };
                });
            } else {
                $('#signInModal').modal('show');
                $scope.voteChecking = false;
            };
        });
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