angular.module('mean.issues').controller('IssuesController', ['$scope', '$routeParams', '$location', 'Global', 'Issues', function ($scope, $routeParams, $location, Global, Issues) {
    $scope.global = Global;

    $scope.create = function() {
        var issue = new Issues({
            title: this.title,
            content: this.content
        });
        issue.$save(function(response) {3
            $location.path("issues/" + response._id);
        });

        this.title = "";
        this.content = "";
    };

    $scope.remove = function(issue) {
        issue.$remove();  

        for (var i in $scope.issues) {
            if ($scope.issues[i] == issue) {
                $scope.issues.splice(i, 1);
            }
        }
    };

    $scope.update = function() {
        var issue = $scope.issue;
        if (!issue.updated) {
            issue.updated = [];
        }
        issue.updated.push(new Date().getTime());

        issue.$update(function() {
            $location.path('issues/' + issue._id);
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