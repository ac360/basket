angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Articles",
        "link": "articles"
    }, {
        "title": "Create New Article",
        "link": "articles/create"
    }, {
        "title": "Clients",
        "link": "clients"
    }, {
        "title": "Create New Client",
        "link": "clients/create"
    }];

    $scope.init = function() {

    };
    
}]);