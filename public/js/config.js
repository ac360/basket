// Setting up routes
window.app.config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to "/"
    $urlRouterProvider.otherwise("/");
    // Now set up the states
    $stateProvider
        .state('home', {
          url: "/",
          views: {
            "header":    { templateUrl: "views/header/search.html"      },
            "content":   { templateUrl: "views/content/home.html"       },
            "footer":    { templateUrl: "views/footer/footer.html"      },
          },
          onEnter: function(){
            console.log("State Changed Callback")
          }
        })
        .state('search', {
          url: "/search",
          views: {
            "header":    { templateUrl: "views/header/search.html"      },
            "content":   { templateUrl: "views/content/search.html"     },
            "footer":    { templateUrl: "views/footer/footer.html"      },
          },
          onEnter: function(){
            console.log("State Changed Callback")
          }
        })
        .state('create', {
          url: "/create",
          views: {
            "header":    { templateUrl: "views/header/search.html"      },
            "content":   { templateUrl: "views/content/create.html"     },
            "footer":    { templateUrl: "views/footer/footer.html"      },
          },
          onEnter: function(){
            console.log("State Changed Callback")
          }
        })
        .state('show', {
          url: "/:basketId",
          views: {
            "header":    { templateUrl: "views/header/show.html"        },
            "content":   { templateUrl: "views/content/show.html"       },
            "footer":    { templateUrl: "views/footer/footer.html"      },
          },
          onEnter: function(){
            console.log("State Changed Callback")
          }
        })
});

//Setting HTML5 Location Mode
window.app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);