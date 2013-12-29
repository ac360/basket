angular.module('mean.issues').controller('IssuesController', ['$scope', '$location', 'Global', 'Issues', function ($scope, $routeParams, $location, Global, Issues) {
    $scope.global = Global;
    $scope.activeIssue = false;

    $scope.showIssue = function(issue, $event) {
        // Issue Slider Controls
        if ($($event.currentTarget).hasClass('active')) {
            $('.issue').removeClass('active');
            $('.issue').animate({height: "80px"}, 100);
            $scope.activeIssue = false;
        } else {
            $('.issue').removeClass('active');
            $('.issue').animate({height: "80px"}, 100);
            $($event.currentTarget).addClass('active')
            $($event.currentTarget).animate({height: "200px"}, 100);
            $scope.activeIssue = issue;
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