angular.module('mean.issues').controller('IssuesController', ['$scope', '$location', 'Global', 'Issues', function ($scope, $location, Global, Issues) {
    $scope.global = Global;
    $scope.activeIssue = false;
    $scope.descLimit = 42;

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