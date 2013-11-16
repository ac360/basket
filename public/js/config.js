//Setting up route
window.app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/issues', {
            templateUrl: 'views/issues/list.html'
        }).
        when('/issues/create', {
            templateUrl: 'views/issues/create.html'
        }).
        when('/issues/:issueId/edit', {
            templateUrl: 'views/issues/edit.html'
        }).
        when('/issues/:issueId', {
            templateUrl: 'views/issues/view.html'
        }).
        when('/clients', {
            templateUrl: 'views/clients/list.html'
        }).
        when('/clients/create', {
            templateUrl: 'views/clients/create.html'
        }).
        when('/clients/:clientId/edit', {
            templateUrl: 'views/clients/edit.html'
        }).
        when('/clients/:clientId', {
            templateUrl: 'views/clients/view.html'
        }).
        when('/', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
window.app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);