// Setting up routes
window.app.config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to "/"
    $urlRouterProvider.otherwise("/");
    // Now set up the states
    $stateProvider
        // .state('search', {
        //   url: "/",
        //   views: {
        //     "header":    { templateUrl: "views/header/search.html"         },
        //     "dashboard": { templateUrl: "views/dashboard/search.html"   }
        //   }
        // })
        .state('city', {
          url: "/",
          views: {
            "header":    { templateUrl: "views/header/city.html"         },
            "dashboard": { templateUrl: "views/dashboard/city.html"   }
          },
          onEnter: function(){
            console.log("State Changed Callback")
          }
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