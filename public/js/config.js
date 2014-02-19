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
            "footer":    { templateUrl: "views/footer/footer.html"      }
          }
        })
        .state('search', {
          url: "/search",
          views: {
            "header":    { templateUrl: "views/header/search.html"      },
            "content":   { templateUrl: "views/content/search.html"     },
            "footer":    { templateUrl: "views/footer/footer.html"      },
          }
        })
        .state('create', {
          url: "/create",
          views: {
            "header":    { templateUrl: "views/header/search.html"      },
            "content":   { templateUrl: "views/content/create.html"     },
            "footer":    { templateUrl: "views/footer/footer.html"      },
          }
        })
        .state('show', {
          url: "/m/:basketId",
          views: {
            "header":    { templateUrl: "views/header/show.html"        },
            "content":   { templateUrl: "views/content/show.html"       },
            "footer":    { templateUrl: "views/footer/show.html"        },
          }
        })
        .state('folder', {
          url: "/f/:folderId",
          views: {
            "header":    { templateUrl: "views/header/folder.html"      },
            "content":   { templateUrl: "views/content/folder.html"     },
            "footer":    { templateUrl: "views/footer/footer.html"      },
          }
        })
        .state('hashtag', {
          url: "/hashtag/:hashtag",
          views: {
            "header":    { templateUrl: "views/header/search.html"     },
            "content":   { templateUrl: "views/content/hashtag.html"    },
            "footer":    { templateUrl: "views/footer/footer.html"      },
          }
        })
        .state('user', {
          url: "/user/:username",
          views: {
            "header":    { templateUrl: "views/header/user.html"        },
            "content":   { templateUrl: "views/content/user.html"       },
            "footer":    { templateUrl: "views/footer/footer.html"      },
          }
        })
        .state('admin', {
          url: "/admin",
          views: {
            "header":    { templateUrl: "views/header/admin.html"       },
            "content":   { templateUrl: "views/content/admin.html"      },
            "footer":    { templateUrl: "views/footer/admin.html"       },
          }
        })
});

//Setting HTML5 Location Mode
window.app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);