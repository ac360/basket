// Setting up routes
window.app.config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to "/"
    $urlRouterProvider.otherwise("/");
    // Now set up the states
    $stateProvider
        .state('search', {
          url: "/",
          templateUrl: "views/index.html"
        })

});

//Setting HTML5 Location Mode
window.app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);