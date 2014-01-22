angular.module('mean.system').controller('RootController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'storage', '$state', '$stateParams', '$location', '$timeout', '$modal', function ($scope, Global, Medleys, Retailers, Users, storage, $state, $stateParams, $location, $timeout, $modal) {

    // Initialization Methods At Bottom

    // Set Defaults
    $scope.global                     = Global;
    $scope.status                     = false;
    $scope.user                       = false;
    $scope.basket                     = {};
    $scope.basket.hashtags            = [];
    $scope.basket.items               = [];
    $scope.basket_status              = 'Your Basket:';
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

    // Check Local Storage
        // storage.set('status', 'one');
    switch (storage.get('status')) {
        case "registered":
        break;
    };

    // Get The Current User
    $scope.getCurrentUser = function(cb) {
        Users.get({}, function(user) {
            console.log("Current User Fetched: ", user);
            if (user['0']) {
                cb(null);
            } else {
                $scope.user = user;
                if (cb) { cb(user) }; 
            };
        });
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
        $scope.basket_status = "Your Basket:";
        $scope.basket_publish = false;
      };
    };

    $scope.addBasketItem = function(item, $event) {
        // Set Gridster Defaults
        item.row = item.col = item.size_x = item.size_y = 1;
        $scope.basket.items.push(item);
        console.log("Basket: ", $scope.basket);
        this.removeArrayItem(item.$$hashKey, $scope.search_results);
        $scope.basket_full = true;
        this.setBasketStatus();
    };

    $scope.removeArrayItem = function(hashKey, sourceArray) {
        var self = this;
        angular.forEach(sourceArray, function(obj, index){
          // sourceArray is a reference to the original array passed to ng-repeat, 
          // rather than the filtered version. 
          // 1. compare the target object's hashKey to the current member of the iterable:
          if (obj.$$hashKey === hashKey) {
            // remove the matching item from the array
            sourceArray.splice(index, 1);
            // and exit the loop right away
            self.setBasketStatus();
            return;
          };
        });
    };

    $scope.showProductPreview = function(item) {
      $scope.product_preview = item;
    };

    $scope.hideProductPreview = function(item) {
      $scope.product_preview = false;
    };

    $scope.showProductPopup = function(item) {
      $scope.product = item;
      console.log($scope.product)
      $scope.product_popup = $modal.open({
        templateUrl: 'views/modals/product_modal.html',
        scope: $scope,
        windowClass: 'product-modal'
      });
    };

    $scope.hideProductPopup = function(item) {
      $scope.product_popup.close();
    };

    // Get The Current User
    $scope.loginFacebook = function(e, cb) {
        var self = this;
        e.preventDefault();
        if (!$scope.user) {
            FB.getLoginStatus(function(response) {
                  if (response.status === 'connected') {
                    // TODO:  UPDATE USER EMAIL ADDRESS ON LOGIN!
                    // the user is logged in and has authenticated your
                    // app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed
                    // request, and the time the access token 
                    // and signed request each expire
                    // var uid = response.authResponse.userID;
                    // var accessToken = response.authResponse.accessToken;
                    console.log('User is already logged into Facebook: ', response);
                    FB.api('/me', function(response) {
                        console.log('Successfully Retrieved User Information: ', response);
                        var newUser = new Users({
                              email:      response.email,
                              username:   response.username,
                              name:       response.name,
                              first_name: response.first_name,
                              last_name:  response.last_name,
                              gender:     response.gender,
                              locale:     response.locale,
                              timezone:   response.timezone,
                              fb_id:      response.id,
                              provider:   'facebook'
                         });
                         newUser.$save(function(user){
                              console.log("Successfully saved new user to database and signed in: ", user);
                              $scope.user = user;
                              // If Sign In Modal is open, close it!
                              if ( $('#signInModal').hasClass('in') ) {
                                  $('#signInModal').modal('hide');
                              };
                              if (cb) {cb()};
                         });
                    });
                  } else {
                    // the user is logged in to Facebook, but has not authenticated your app
                    FB.login(function(response) {
                        if (response.authResponse) {
                           console.log('Successfully Authenticated: ', response);
                           FB.api('/me', function(response) {
                             console.log('Successfully Retrieved User Information: ', response);
                             var newUser = new Users({
                                  email:      response.email,
                                  username:   response.username,
                                  name:       response.name,
                                  first_name: response.first_name,
                                  last_name:  response.last_name,
                                  gender:     response.gender,
                                  locale:     response.locale,
                                  timezone:   response.timezone,
                                  fb_id:      response.id,
                                  provider:   'facebook'
                             });
                             newUser.$save(function(user){
                                  console.log("Successfully saved new user to database and signed in: ", user);
                                  $scope.user = user;
                                  // If Sign In Modal is open, close it!
                                  if ( $('#signInModal').hasClass('in') ) {
                                      $('#signInModal').modal('hide');
                                  };
                                  if (cb) {cb()};
                             });
                           });
                        } else {
                          console.log('User cancelled login or did not fully authorize.');
                        }
                    },{ scope: 'email,user_likes' });
                  }; // if response = "connected"
            }); // FB.getLoginStatus
        }; // !$scope.user
    };

    $scope.validateHashtags = function() {
        // Limit Number of Characters
        var content_id = 'hashtags-input';  
        var max = 140;
        //binding keyup/down events on the contenteditable div
        $('#'+content_id).keyup(function(e){ check_charcount(content_id, max, e); });
        $('#'+content_id).keydown(function(e){ check_charcount(content_id, max, e); });
        function check_charcount(content_id, max, e) {   
            if(e.which != 8 && $('#'+content_id).text().length > max) {
                e.preventDefault();
            }
        }
        // Style hashtag text
        $('#hashtags-input').text().replace(/(^|\W)(#[a-z\d][\w-]*)/ig, '$1<span>$2</span>');

        // console.log(words);
        // var tagslistarr = words.split(' ');
        // var arr=[];
        // $.each(tagslistarr,function(i,val){
        //     if(tagslistarr[i].indexOf('#') == 0){
                 
        //     }
        // });
    };

    $scope.publishBasket = function($event) {
        $event.preventDefault();
        // Save to array of hashtags
        var words = $('#hashtags-input').text();
        var tagslistarr = words.split(' ');
        var arr=[];
        $.each(tagslistarr,function(i,val){
            if(tagslistarr[i].indexOf('#') == 0){
              $scope.basket.hashtags.push(tagslistarr[i]);  
            }
        });
        if ($scope.basket.hashtags.length > 0) {
            console.log("Basket to be published: ", $scope.basket);
            var basket = new Medleys($scope.basket);
            basket.$save(function(response){
              console.log(response);
              $scope.basket           = {};
              $scope.basket.hashtags  = [];
              $scope.basket.items     = [];
              $('#create-stage ul').html('');
              $('#hashtagModal').modal('hide');
              $('#hashtagModal').on('hidden.bs.modal', function () {
                $timeout(function(){
                    $state.go('show', { basketId: response.short_id });
                    $scope.share = true;
                }, 500);
              });
            });
        } else {
           $scope.hashtag_error = 'Please enter at least one hashtag';
           $timeout(function(){
              $scope.hashtag_error = false;
           }, 5000);
        }
    };

    // Initialization Methods

        // Get Current User
        $scope.getCurrentUser(function(user){
            if(user){
                $scope.user = user;
            }
        });

        // Infinite Scroll
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

        // Angular Directive Event Listeners
        $scope.$on('openProductModal', function(e, item) {
            $scope.showProductPopup(item)
            console.log("Broadcast received: ", item);
        });

        // Initialize Facebook SDK
        window.fbAsyncInit = function() {
            // init the FB JS SDK for use
            FB.init({
              appId      : '736751053015158',                    // Dev: 252087231617494 Pro: 736751053015158
              status     : true,                                 // Check Facebook Login status
              xfbml      : true                                  // Look for social plugins on the page
            });
            // Additional initialization code such as adding Event Listeners goes here
          };

          // Load the SDK asynchronously
          (function(){
             // If we've already installed the SDK, we're done
             if (document.getElementById('facebook-jssdk')) {return;}

             // Get the first script element, which we'll use to find the parent node
             var firstScriptElement = document.getElementsByTagName('script')[0];

             // Create a new script element and set its id
             var facebookJS = document.createElement('script'); 
             facebookJS.id = 'facebook-jssdk';

             // Set the new script's source to the source of the Facebook JS SDK
             facebookJS.src = '//connect.facebook.net/en_US/all.js';

             // Insert the Facebook JS SDK into the DOM
             firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
        }());

}]);