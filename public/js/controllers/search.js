angular.module('mean.system').controller('RootController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'storage', '$state', '$stateParams', '$location', '$timeout', function ($scope, Global, Medleys, Retailers, Users, storage, $state, $stateParams, $location, $timeout) {

    // Initialization Methods At Bottom

    // Set Defaults
    $scope.global               = Global;
    $scope.status               = false;
    $scope.user                 = false;
    $scope.basket               = {};
    $scope.basket.hashtags      = [];
    $scope.basket.items         = [];
    $scope.basket_status        = 'Your Basket:';
    $scope.basket_publish       = false;
    $scope.retailer             = 'All Retailers';
    $scope.etsy_store_id        = '';
    $scope.search_keywords      = '';
    $scope.search_results       = false;
    $scope.search_amazon_meta   = false;
    $scope.search_etsy_meta     = false;
    $scope.product_preview      = false;
    $scope.status               = {};
    $scope.status.icon          = '';
    $scope.status.message       = '';
    $scope.status.status        = false;
    $scope.share                = false;

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
        // Check state to navigate back to search page
        if ($state.current.name != "search") {
          $state.go('search', {}, {});
        };
        console.log("keywords:", keywords);
        $scope.search_keywords      = keywords;
        // Check if there are keywords
        if($scope.search_keywords == '') {
          $scope.status.icon          = "refresh"
          $scope.status.message       = "Please enter something to search for...";
          $scope.status.status        = true;
          return false;
        };
        $scope.etsy_store_id        = $('#etsy-store-id-field').val();
        $scope.status.icon          = "refresh"
        $scope.status.message       = 'Searching for ' + $scope.search_keywords + ' on ' + $scope.retailer.toLowerCase();
        $scope.status.status        = true;
        console.log( "Search keywords: " + $scope.search_keywords + "Etsy Store Id" + $scope.etsy_store_id );
        Retailers.search({ q: $scope.search_keywords, retailer: $scope.retailer, etsy_store_id: $scope.etsy_store_id  }, function(response) {
            $scope.search_etsy_meta   = response.etsy_meta;
            $scope.search_amazon_meta = response.amazon_meta;
            $scope.search_results     = response.items;
            $scope.status.status      = false;
            console.log("Search results for " + $scope.search_keywords, $scope.search_results);
        });
    };

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

        // Initialize Facebook SDK
        window.fbAsyncInit = function() {
            // init the FB JS SDK
            FB.init({
              appId      : '252087231617494',                    // Dev: 252087231617494 Pro: 736751053015158
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