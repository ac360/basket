angular.module('mean.system').controller('RootController', ['$rootScope', '$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'storage', '$state', '$stateParams', '$location', '$timeout', '$modal', 'Modals', 'Folders', function ($rootScope, $scope, Global, Medleys, Retailers, Users, storage, $state, $stateParams, $location, $timeout, $modal, Modals, Folders) {

    // Initialization Methods At Bottom

    // Set Defaults
    $scope.status                     = false;
    $scope.loading                    = true;
    $scope.guest                      = false;
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
    $scope.medleys                    = [];
    $scope.profile                    = null;
    $scope.feed                       = 'Featured Medleys';
    $scope.fetchingmedleys_inprogress = false;
    $scope.medley_offset              = 0;

    // FOLDERS -----------------------------------------
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
    $scope.deleteFolder = function(folder) {
        var r = confirm("Are you sure you want to delete this folder?  You will lose all of the medleys in it!");
        if (r === true) {
            Folders.delete({ folderId: folder._id }, function(folder){
                console.log("Folder deleted:", folder);
                $rootScope.$broadcast('FoldersUpdated', folder);
            })
        };
    };

    // USERS --------------------------------------------
    $scope.encourageSignIn = function() {
        Modals.signIn();
    };

    // MEDLEY FEEDS -------------------------------------
    $scope.initializeHome = function() {
        $scope.getFeed();
    };
    $scope.getFeed = function(type) {
        if (type && type !== $scope.feed) { $scope.medleys = []; $scope.medley_offset =  0; $scope.feed = type };
        if ($scope.feed === "Featured Medleys") {
            $scope.MedleysByFeatured(); 
        } else if ($scope.feed === "Most Voted Medleys") {
            $scope.MedleysByVotes();
        } else if ($scope.feed === "Most Viewed Medleys") {
            $scope.MedleysByViews();
        } else if ($scope.feed === "Most Recent Medleys") {
            $scope.MedleysByMostRecent();
        };
    };
    $scope.MedleysByFeatured = function(cb){
        Medleys.getFeatured({ offset: $scope.medley_offset }, function(medleys) {
            // Set Medley Size
            angular.forEach(medleys, function(medley) {
                $scope.medleys.push( Global.sizeMedleySmall(medley) );
                Global.updateMedleyViewCount(medley.short_id);
            });
            console.log("Medleys by featured loaded:", $scope.medleys);
            $scope.fetchingmedleys_inprogress = false;
            $scope.medley_offset =  $scope.medley_offset + 20;
        }); // Medleys.getMostVoted
    };
    $scope.MedleysByMostRecent = function(cb){
        console.log("offset set for fetch: ", $scope.medley_offset)
        Medleys.getMostRecent({ offset: $scope.medley_offset }, function(medleys) {
            // Set Medley Size
            angular.forEach(medleys, function(medley) {
                $scope.medleys.push( Global.sizeMedleySmall(medley) );
                Global.updateMedleyViewCount(medley.short_id);
            });
            console.log("Medleys by most recent loaded:", $scope.medleys);
            $scope.fetchingmedleys_inprogress = false;
            $scope.medley_offset =  $scope.medley_offset + 5;
        }); // Medleys.getMostRecent
    };
    $scope.MedleysByVotes = function(cb){
        Medleys.getMostVoted({ offset: $scope.medley_offset }, function(medleys) {
            // Set Medley Size
            angular.forEach(medleys, function(medley) {
                $scope.medleys.push( Global.sizeMedleySmall(medley) );
                Global.updateMedleyViewCount(medley.short_id);
            });
            console.log("Medleys by most voted loaded:", $scope.medleys);
            $scope.fetchingmedleys_inprogress = false;
            $scope.medley_offset =  $scope.medley_offset + 20;
        }); // Medleys.getMostVoted
    };
    $scope.MedleysByViews = function(cb){
        Medleys.getMostViewed({ offset: $scope.medley_offset }, function(medleys) {
            // Set Medley Size
            angular.forEach(medleys, function(medley) {
                $scope.medleys.push( Global.sizeMedleySmall(medley) );
                Global.updateMedleyViewCount(medley.short_id);
            });
            console.log("Medleys by most views loaded:", $scope.medleys);
            $scope.fetchingmedleys_inprogress = false;
            $scope.medley_offset =  $scope.medley_offset + 20;
        }); // Medleys.getMostViewed
    };
    $scope.MedleysByProfile = function(username) {
        if (username) {
            username = username;
        } else {
            username = $stateParams.username;
        };
        // Fetch Your Medleys
        Medleys.getUserMedleys({ username: username },function(medleys) {
            $scope.medleys = [];
            angular.forEach(medleys, function(medley) {
                $scope.medleys.push( Global.sizeMedleySmall(medley) );
                Global.updateMedleyViewCount(medley.short_id);
            });
            console.log("Medleys by profile+ "+$scope.user.name+" loaded:", $scope.medleys);
        });
    };
    $scope.MedleysByHashtag = function(hashtag) {
        if (hashtag) {
            $scope.hashtag = hashtag;
        } else {
            $scope.hashtag = $stateParams.hashtag;
        };
        Global.getMedleysByHashtag($scope.hashtag, function(medleys) { 
            $scope.medleys = [];
            // Set Medley Size
            angular.forEach(medleys, function(medley) {
                $scope.medleys.push( Global.sizeMedleySmall(medley) );
                Global.updateMedleyViewCount(medley.short_id);
            });
            console.log("Medleys by hashtag+ "+$scope.hashtag+" loaded:", $scope.medleys);
        });
    };

    // SEARCH ------------------------------------------
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
          $scope.status.icon        = 'error';
          $scope.status.message     = "Please enter something to search for...";
          $scope.status.status      = true;
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

    // SHARE MODAL --------------------------
    $scope.shareMedley = function(medley) {
        Modals.share(medley);
    };

    // INITIALIZATION METHODS ---------------

        Global.loadCurrentUser();
        
        // LISTENERS ---------------
            $scope.$on('UserAuthenticated', function(e, user){
                $scope.user  = user;
                $scope.guest = false;
                // Get User's Folders:
                Global.loadFolders();
            });
            $scope.$on('GuestUser', function(e){ 
                $scope.guest = true;
            });
            $scope.$on('UserUpdated', function(e, user){
                $scope.user  = user;
                $scope.guest = false;
            });
            // Listener - Folders Loaded
            $scope.$on('FoldersLoaded', function(e, folders){
                $scope.folders = folders;
            });
            // Listener - Folders Updated
            $scope.$on('FoldersUpdated', function(e, folder){
                console.log("Dragged")
                  // Reload All Folders
                  Global.loadFolders(function(folders) {
                      $scope.folders = folders;
                  });
            });
            // Listener - Medley Published
            $scope.$on('MedleyPublished', function(e, medley) {
                  Global.resetMedley();
                  $scope.basket = Global.getMedley();
                  $scope.share  = true;
            });
            // Listeners - Medley Updated
            $scope.$on('MedleyUpdated', function(e, medley){
                angular.forEach($scope.medleys, function(m) {
                    if (m._id  == medley._id) { 
                        m.votes = medley.votes
                    };
                });
            });
            // Listener - Medley Deleted
            $scope.$on('MedleyDeleted', function(e, medley) {
                angular.forEach($scope.medleys, function(m, index) {
                    if (m._id  == medley._id) { 
                        $scope.medleys.splice(index, 1);
                    };
                }); 
            });
            // Listener - Watch Feed Type Change
            // $scope.$watch('feed', function(oldvariable, newvariable) {
            //     if (oldvariable !== newvariable) {
            //         $scope.medleys       = [];
            //         $scope.medley_offset =  0;
            //         console.log("Offset Reset: ", $scope.medley_offset);
            //     };
            // });
            // Listeners - State Changes
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                  // Adjust Page Title
                  if (toState.name !== 'show' && toState.name !== 'create') { 
                    $('body').removeClass().addClass('a1') 
                  };
                  // Adjust Template on Create Page
                  if (toState.name === 'create') { 
                        if ($scope.basket && $scope.basket.template) {
                            $('body').removeClass().addClass($scope.basket.template); 
                            $('.logo').html('<img ng-src="img/logo_'+$scope.basket.template+'.png" draggable="false">');
                        } else {
                            $('body').removeClass().addClass('a1'); 
                            $('.logo').html('<img ng-src="img/logo_a1.png" draggable="false">');
                        };
                  };
                  // Adjust Template
                  if (toState.name !== 'show')   { $(document).attr('title', 'Medley - The New Shopping Cart!')      };                  
            });
            // Listener - Scroll for Infinite Loading
            $(window).scroll(function() {
                if ( $(window).scrollTop() >= ( $(document).height() - $(window).height() ) ) {
                    // Browse Medleys Infinite Scroll
                    if ($scope.fetchingmedleys_inprogress === false) {
                        console.log("infinite scroll activated")
                        $scope.fetchingmedleys_inprogress = true;
                        $scope.getFeed();
                    };
                    // Search Area Infinite Scroll - Make Sure you have listings...
                    if ($scope.search_results.length > 9) {
                        if ($scope.scrollsearch_in_progress === false) {
                            $scope.scrollSearch();
                        };
                  };
                };
            });
}]);