// Setting up routes
window.app.config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to "/"
    $urlRouterProvider.otherwise("/");
    // Now set up the states
    $stateProvider
        .state('home', {
          url: "/",
          templateUrl: "views/index.html"

        })
        .state('issue-create', {
          url: "/issues/new",
          templateUrl: "views/create_issue.html"
        })

});

//Setting HTML5 Location Mode
window.app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);