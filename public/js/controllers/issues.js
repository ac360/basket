angular.module('mean.issues').controller('IssuesController', ['$scope', '$location', 'Global', 'Issues', function ($scope, $routeParams, $location, Global, Issues) {
    $scope.global = Global;
    $scope.activeIssue = false;
    $scope.descLimit = 42;

    $scope.showIssue = function(issue, $event) {
        $scope.activeIssue = issue;
        // Stop Any Other Bouncing Markers
         $scope.$parent.$parent.town.issues.forEach(function(i) {
            i.marker.setAnimation(null);
        });
        // Pan, Zoom & Bounce Issue on Map
        $scope.$parent.$parent.town.map.panTo(new google.maps.LatLng( $scope.activeIssue.location.b, $scope.activeIssue.location.d ));
        $scope.$parent.$parent.town.map.setZoom(13)
        $scope.activeIssue.marker.setAnimation(google.maps.Animation.BOUNCE);
    };

    $scope.hideIssue = function(issue, $event) {
        $scope.activeIssue = false;
        // Stop All Marker Animations, Pan Zoom back to Town
        $scope.$parent.$parent.town.issues.forEach(function(i) {
                i.marker.setAnimation(null);
            });
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