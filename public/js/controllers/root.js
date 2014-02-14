angular.module('mean.system').controller('RootController', ['$rootScope', '$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'storage', '$state', '$stateParams', '$location', '$timeout', '$modal', 'Modals', 'Folders', function ($rootScope, $scope, Global, Medleys, Retailers, Users, storage, $state, $stateParams, $location, $timeout, $modal, Modals, Folders) {

    // Initialization Methods At Bottom

    // Set Defaults
    $scope.global                     = Global;
    $scope.status                     = false;
    $scope.user                       = false;
    $scope.basket                     = {};
    $scope.basket.hashtags            = [];
    $scope.basket.items               = [];
    $scope.basket_status              = 'Your Medley:';
    $scope.basket_publish             = false;
    $scope.retailer                   = 'All Retailers';
    $scope.etsy_store_id              = '';
    $scope.search_keywords            = '';
    $scope.search_results             = false;
    $scope.search_amazon_meta         = false;
    $scope.search_etsy_meta           = false;
    $scope.scrollsearch_in_progress   = false;
    $scope.scrollsearch_empty         = false; 
    $scope.product_preview            = false;
    $scope.product                    = false;
    $scope.status                     = {};
    $scope.status.icon                = '';
    $scope.status.message             = '';
    $scope.status.status              = false;
    $scope.share                      = false;
    $scope.draggable                  = true;


    // FOLDERS
    $scope.addMedleyToFolder = function(event, data) {
        if (Global.getCurrentUser()) {
            var medley   = data;
            var folderId = $(event.currentTarget).attr("data-id");
            angular.forEach($scope.folders, function(f, index){
              if (f._id === folderId) {
                f.medleys.push(medley.short_id);
                Global.updateFolder(f);
                return;
              };
            });
        } else {
            Modals.signIn();
        }
    };
    $scope.newFolderModal = function() {
        if (Global.getCurrentUser()) {
            Modals.folder();
        } else {
            Modals.signIn();
        }
    };
    $scope.noUserFolder = function() {
        Modals.signIn();
    };
    $scope.deleteFolder = function(folder) {
        var r = confirm("Are you sure you want to delete this folder?  You will lose all of the medleys in it!")
        if (r === true) {
            Folders.delete({ folderId: folder._id }, function(folder){
                console.log("Folder deleted:", folder);
                $rootScope.$broadcast('FoldersUpdated', folder);
            })
        };
    };

    $scope.setRetailer = function(retailer) {
      $scope.retailer = retailer;
    };

    $scope.searchRetailers = function(keywords, items, cb) {
        // Clear Results
        $scope.search_results       = false;
        $scope.search_amazon_meta   = false;
        $scope.search_etsy_meta     = false;
        $scope.scrollsearch_empty   = false;
        // Check state to navigate back to search page
        if ($state.current.name != "search") {
          $state.go('search', {}, {});
        };
        $scope.search_keywords      = keywords;
        if ($scope.retailer == 'Etsy') { $scope.etsy_store_id = $('#etsy-store-id-field').val() } else { $scope.etsy_store_id = '' };
        // Check if there are keywords
        if( ($scope.retailer == 'All Retailers' && !$scope.search_keywords) || ($scope.retailer == 'Amazon' && !$scope.search_keywords) || ($scope.retailer == 'Etsy' && !$scope.etsy_store_id && !$scope.search_keywords) ) {
          $scope.status.icon          = 'error';
          $scope.status.message       = "Please enter something to search for...";
          $scope.status.status        = true;
          return false;
        };
        $scope.status.icon          = "refresh"
        $scope.status.message       = 'Searching for ' + $scope.search_keywords + ' on ' + $scope.retailer.toLowerCase() + '...';
        $scope.status.status        = true;
        Retailers.search({ q: $scope.search_keywords, retailer: $scope.retailer, etsy_store_id: $scope.etsy_store_id, amazon_page: '1', etsy_offset: '0'  }, function(response) {
            console.log("search response raw: ", response);
            // Check if any results were returned
            if (response.items.length == 0) {
                $scope.status.icon          = 'error';
                $scope.status.message       = "Sorry, we couldn't find any products that matched your search for "+ $scope.search_keywords;
                $scope.status.status        = true; 
            } else {
                $scope.search_etsy_meta     = response.etsy_meta;
                $scope.search_amazon_meta   = response.amazon_meta;
                $scope.search_results       = response.items;
                $scope.status.status        = false;
                if (response.items.length < 10) { $scope.scrollsearch_empty = true };
            };
            console.log("Search results for " + $scope.search_keywords, $scope.search_results);
        });
    };

    $scope.scrollSearch = function() {
        $scope.scrollsearch_in_progress = true;
        // If All Retailers still have more listings...
        if ($scope.retailer == 'All Retailers' && $scope.search_amazon_meta.more_listings == true && $scope.search_etsy_meta.more_listings == true) {
            Retailers.search({ q: $scope.search_keywords, retailer: 'All Retailers', etsy_store_id: $scope.etsy_store_id, amazon_page: $scope.search_amazon_meta.next_page, etsy_offset: $scope.search_etsy_meta.next_offset }, function(response) {
                console.log("Infinite search completed with All Retailers results: ", response);
                $scope.search_etsy_meta     = response.etsy_meta;
                $scope.search_amazon_meta   = response.amazon_meta;
                angular.forEach(response.items, function(item) {
                    $scope.search_results.push(item);
                });
                $scope.scrollsearch_in_progress = false;
                if(response.items.length == 0){ $scope.scrollsearch_empty = true };
            });
        // If Amazon still has more listings...
        } else if ( ($scope.retailer == 'Amazon' && $scope.search_amazon_meta.more_listings == true) || ($scope.search_amazon_meta.more_listings == true && $scope.search_etsy_meta.more_listings == false) ) {
            Retailers.search({ q: $scope.search_keywords, retailer: 'Amazon', amazon_page: $scope.search_amazon_meta.next_page }, function(response) {
                console.log("Infinite search completed with only Amazon results: ", response);
                $scope.search_amazon_meta   = response.amazon_meta;
                angular.forEach(response.items, function(item) {
                    $scope.search_results.push(item);
                });
                $scope.scrollsearch_in_progress = false;
                if(response.items.length == 0){ $scope.scrollsearch_empty = true };
            });
        // If Etsy still has more listings...
        } else if ( ($scope.retailer == 'Etsy' && $scope.search_etsy_meta.more_listings == true) || ($scope.search_amazon_meta.more_listings == false && $scope.search_etsy_meta.more_listings == true) ) {
            console.log("Infinite search fired for Etsy...")
            Retailers.search({ q: $scope.search_keywords, retailer: 'Etsy', etsy_store_id: $scope.etsy_store_id, etsy_offset: $scope.search_etsy_meta.next_offset }, function(response) {
                console.log("Infinite search completed with only Etsy results: ", response);
                $scope.search_etsy_meta     = response.etsy_meta;
                angular.forEach(response.items, function(item) {
                    $scope.search_results.push(item);
                });
                $scope.scrollsearch_in_progress = false;
                if(response.items.length == 0){ $scope.scrollsearch_empty = true };
            });
        } else if ($scope.search_amazon_meta.more_listings == false && $scope.search_etsy_meta.more_listings == false) {
            $scope.scrollsearch_empty         = true;
            $scope.scrollsearch_in_progress   = false;
        } else {
          $timeout(function(){
              $scope.scrollsearch_in_progress = false;
          }, 2000);
        }; // if statment
    }; // infiniteSearch()

    $scope.setBasketStatus = function() {
      if ( $scope.basket.items.length == 1 ) { 
        $scope.basket_status = "Add 1 more item...";
        $scope.basket_publish = false;
      } else if ( $scope.basket.items.length > 1 ) { 
        $scope.basket_status = "Ready to publish!";
        $scope.basket_publish = true;
      } else {
        $scope.basket_status = "Your Medley:";
        $scope.basket_publish = false;
      };
    };

    $scope.addBasketItem = function(item, $event) {
        // Set Gridster Defaults
        item.row = item.col = item.size_x = item.size_y = 1;
        $scope.basket.items.push(item);
        // Update Global Data
        Global.setMedleyProperty("items", $scope.basket.items, function(medley) {
          $scope.basket = medley;
        });
        this.removeArrayItem(item.$$hashKey, $scope.search_results);
        $scope.basket_full = true;
        this.setBasketStatus();
    };

    $scope.removeArrayItem = function(hashKey, sourceArray) {
        var self = this;
        angular.forEach(sourceArray, function(obj, index){
          if (obj.$$hashKey === hashKey) {
            sourceArray.splice(index, 1);
            self.setBasketStatus();
            return;
          };
        });
        Global.setMedleyProperty("items", $scope.basket.items, function(medley) {
          $scope.basket = medley;
        });
    };

    $scope.showProductPreview = function(item) {
      $scope.product_preview = item;
    };

    $scope.hideProductPreview = function(item) {
      $scope.product_preview = false;
    };

    $scope.shareFacebook = function(medleyId, username, imageLink, hashtags) {
        Global.shareFacebook(medleyId, username, imageLink, hashtags);
    };

    // Initialization Methods

        // Get Current User Or Try To Log Them In Via Facebook
        window.fbAsyncInit = function() {
            FB.init({
                appId      : facebookKey,
                status     : true, // check login status
                cookie     : false, // enable cookies to allow the server to access the session
                xfbml      : true  // parse XFBML
            });
            // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
            // for any authentication related change, such as login, logout or session refresh. This means that
            // whenever someone who was previously logged out tries to log in again, the correct case below
            // will be handled.
            FB.Event.subscribe('auth.authResponseChange', function(response) {
                // Here we specify what we do with the response anytime this event occurs.
                if (response.status === 'connected') {
                    signInViaFacebook();
                } else if (response.status === 'not_authorized') {
                } else {}
            });
        };
        // Load the SDK asynchronously
        (function(d){
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement('script'); js.id = id; js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            ref.parentNode.insertBefore(js, ref);
        }(document));
        function signInViaFacebook() {
            Global.autoSignIn();
        };

        // Listener - Authetication
        $scope.$on('SignedInViaFacebook', function(e, user){
              console.log("User Signed In: ", user);
              $scope.user = user;
              Global.loadFolders(function(folders) {
                $scope.folders = folders;
              });
        });
        // Listener - Folders Loaded
        $scope.$on('FoldersLoaded', function(e, folders){
            // Set Folders
            $scope.folders = folders;
            // Set Folder if Folder Page
            if ($state.current.name === 'folder') {
                angular.forEach($scope.folders, function(f) {
                    if (f._id == $stateParams.folderId) { 
                        $scope.folder = f;
                    };
                });
            };
        });
        // Listener - Folders Updated
        $scope.$on('FoldersUpdated', function(e, folder){
              Global.loadFolders(function(folders) {
                  $scope.folders = folders;
                  $rootScope.$broadcast('FoldersLoaded', $scope.folders);
              });
        });
        // Listener - Medley Published
        $scope.$on('MedleyPublished', function(e, medley) {
              Global.resetMedley();
              $scope.basket = Global.getMedley();
              $scope.share = true;
        });
        // Listener - Remove Body Classes
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
              if (toState.name !== 'show' && toState.name !== 'create') { $('body').removeClass().addClass('a1') };
              if (toState.name === 'create') { 
                    if ($scope.basket && $scope.basket.template) {
                        $('body').removeClass().addClass($scope.basket.template); 
                    } else {
                        $('body').removeClass().addClass('a1'); 
                    };
              };
              if (toState.name !== 'show')   { $(document).attr('title', 'Medley - The New Shopping Cart!')      };
              // Set Folder if Folder Page
              if (toState.name === 'folder') {
                    angular.forEach($scope.folders, function(f) {
                        if (f._id == toParams.folderId) { 
                            $scope.folder = f;
                        };
                    });
              };
        });
        // Listener - Search Infinite Scroll 
        $(window).scroll(function() {
            if ( $(window).scrollTop() >= ( $(document).height() - $(window).height() ) ) {
              // Make Sure you have listings...
              if ($scope.search_results.length > 9) {
                  if ($scope.scrollsearch_in_progress === false) {
                      $scope.scrollSearch();
                  };
              };
            };
        });
}]);