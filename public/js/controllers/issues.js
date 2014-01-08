angular.module('mean.issues').controller('IssuesController', ['$scope', '$location', 'Global', 'Issues', function ($scope, $routeParams, $location, Global, Issues) {
    $scope.global = Global;
    $scope.activeIssue = false;
    console.log("Here!")

    $scope.showIssue = function(issue, $event) {
        var map = $scope.$parent.$parent.town.map
        // Issue Slider Controls
        if ($($event.currentTarget).hasClass('active')) {
            $('.issue').removeClass('active');
            $('.issue').animate({height: "80px"}, 100);
            $scope.activeIssue = false;
            $scope.$parent.$parent.town.issues.forEach(function(i) {
                i.marker.setAnimation(null);
            });
            $scope.$parent.$parent.town.map.panTo(new google.maps.LatLng($scope.$parent.$parent.town.place_object.geometry.location.b, $scope.$parent.$parent.town.place_object.geometry.location.d));
            $scope.$parent.$parent.town.map.setZoom(12)
        } else {
            $('.issue').removeClass('active');
            $('.issue').animate({height: "80px"}, 100);
            $($event.currentTarget).addClass('active')
            $($event.currentTarget).animate({height: "200px"}, 100);
            $scope.activeIssue = issue;
            console.log("Active Issue: ", $scope.activeIssue);
            $scope.$parent.$parent.town.issues.forEach(function(i) {
                i.marker.setAnimation(null);
            });
            $scope.$parent.$parent.town.map.panTo(new google.maps.LatLng( $scope.activeIssue.location.nb, $scope.activeIssue.location.ob ));
            $scope.$parent.$parent.town.map.setZoom(13)
            $scope.activeIssue.marker.setAnimation(google.maps.Animation.BOUNCE);
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