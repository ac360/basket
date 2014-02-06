angular.module('mean.system').factory("Global", ['$http', '$rootScope', '$modal', '$state', '$stateParams', "Users", "Modals", "Medleys", "Votes", function($http, $rootScope, $modal, $state, $stateParams, Users, Modals, Medleys, Votes) {
    
	var mData = { user: null, medley: { items: [] } };

    return {
    		setMedleyProperty: function(propertyName, property, callback ) {
    			mData.medley[propertyName] = property;
    			if(callback) { callback(mData.medley) };
    		},

    		getMedley: function() {
    			return mData.medley;
    		},

    		publishMedley: function(callback) {
    			var self = this;
	            var medley = new Medleys(mData.medley);
	            console.log("Medley to be published: ", medley);
	            medley.$save( function(medley) {
	            	console.log("Success!", medley)
	            	$rootScope.$broadcast('MedleyPublished', medley);
	            });
    		},

    		showMedley: function(medleyId, callback) {
    			 Medleys.show({ shortId: medleyId }, function(medley) {
    			 	if(callback){ callback(medley) };
    			 });
    		},

    		resetMedley: function() {
    			mData.medley = { items: [] };
    		},

    		getMedleysByHashtag: function(hashtag, callback) {
    			console.log("hashtag medley GLobal function called for: "+hashtag)
    			Medleys.getByHashtag({ hashtag: hashtag }, function(medleys) {
    				console.log("hashtags found in Global:", medleys)
	    			if (callback) { callback(medleys) };
		        });
    		},

    		shareFacebook: function(medleyId) {
    			Medleys.show({ medleyId: medleyId }, function(medley) {
    			 	if(medley) { 
    			 		FB.ui({
			              method: 'feed',
			              link: 'http://mdly.co/'+medleyId,
			              caption: "This Medley is a collection of awesome, hand-picked products created by " + medley.user.name,
			              display: 'iframe',
			              picture: medley.items[0].images.medium,
			              name: 'Medley - ' + medley.hashtags.join(" ")
			            },  function(response){
			                	console.log(response);
			                	// Hide Modals?
			            });
    			 	} else {
    			 		console.log("Medley could not be found for sharing...")
    			 	}
    			 });
    		},

    		updateMedleyViewCount: function(medleyId) {
	            Medleys.updateViewCount({ medleyId: medleyId }, function(medley){
	                $rootScope.$broadcast('MedleyUpdated', medley); 
	            })
	        },

	        getMedleyVoteStatus: function(medleyId, callback) {
	            Votes.findByMedleyAndUserId({ medley: medleyId }, function(vote){
	                if (vote.errors) { vote = null    };
	                if (callback)    { callback(vote) };
	            })
	        },

	        voteMedley: function(medleyId, callback) {
	            this.authenticateUser(function(user){
	                if (!user) { 
	                    Modals.signIn() 
	                } else {
	                    Medleys.updateVoteCount({ medleyId: medleyId }, function(medley) {
	                        $rootScope.$broadcast('MedleyUpdated', medley);
	                        if (callback) { callback(medley) };
	                    })
	                }
	            })
	        },

    		showProductModal: function(product, callback) {
    			Modals.product(product);
    		},

    		getCurrentUser: function(callback) {
    			return mData.user;
    		},

    		sizeMedleySmall: function(medley) {
    			var rowHeightsObj = {};
			    // Resize Items
			    angular.forEach(medley.items, function(item) {
			          // Set Item Dimensions
			          if (item.size_y == 1){ item.width  = 85  };
			          if (item.size_y == 2){ item.width  = 175 };
			          if (item.size_x == 1){ item.height = 85  };
			          if (item.size_x == 2){ item.height = 175 };
			          // Set Item Position
			          if (item.row == 1 ){ item.top  = 5 };
			          if (item.row >  1 ){ item.top  = (item.row * 90) + 5 - 90 };
			          if (item.col == 1) { item.left = 5 };
			          if (item.col >  1 ){ item.left = (item.col * 90) + 5 - 90 };
			          // Keep Row Count for Container Height
			          if(!rowHeightsObj[item.row]) { rowHeightsObj[item.row] = 0 };
			          if( rowHeightsObj[item.row] < item.size_y ) { 
			              rowHeightsObj[item.row] = item.size_y;
			          };
			    });
			    // Resize Container
			    $.each(rowHeightsObj, function(key, value) {
			          previousRow = rowHeightsObj[key - 1]
			          if (previousRow == 2) {
			            rowHeightsObj[key] = 0
			          }
			    });
			    // Iterate through object and pull values
			    rowHeightsTotal = 0
			    $.each(rowHeightsObj, function(key, value) { 
			          rowHeightsTotal = rowHeightsTotal + value; 
			    });
			    medley.height = rowHeightsTotal * 90 + 8;
			    return medley;
    		},

    		sizeMedleyMedium: function(medley) {
    			var rowHeightsObj = {};
			    // Resize Items
			    angular.forEach(medley.items, function(item) {
			          // Set Item Dimensions
			          if (item.size_y == 1){ item.width  = 100 };
			          if (item.size_x == 1){ item.height = 100 };
			          if (item.size_y == 2){ item.width  = 206 };
			          if (item.size_x == 2){ item.height = 206 };
			          // Set Item Position
			          if (item.row == 1 ){ item.top  = 5 };
			          if (item.row >  1 ){ item.top  = 5 + (item.row * 105) - 105 };
			          if (item.col == 1) { item.left = 5 };
			          if (item.col >  1 ){ item.left = 5 + (item.col * 105) - 105 };
			          // Keep Row Count for Container Height
			          if(!rowHeightsObj[item.row]) { rowHeightsObj[item.row] = 0 };
			          if( rowHeightsObj[item.row] < item.size_y ) { 
			              rowHeightsObj[item.row] = item.size_y;
			          };
			    });
			    // Resize Container
			    $.each(rowHeightsObj, function(key, value) {
			          previousRow = rowHeightsObj[key - 1]
			          if (previousRow == 2) {
			            rowHeightsObj[key] = 0
			          }
			    });
			    // Iterate through object and pull values
			    rowHeightsTotal = 0
			    $.each(rowHeightsObj, function(key, value) { 
			          rowHeightsTotal = rowHeightsTotal + value; 
			    });
			    medley.height = rowHeightsTotal * 105 + 8;
			    return medley;
    		},

    		autoSignIn: function(callback) {
    			// Check if current user
	            Users.getCurrentUser({}, function(user) {
	                if (user.email) {
	                    $rootScope.$broadcast('SignedInViaFacebook', user);
	                    mData.user = user;
	                    // Callback
	                    if (callback) { callback(user) };
	                } else {
	                    var self = this;
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
	                                  // Broadcast User when Signed In
	                                  $rootScope.$broadcast('SignedInViaFacebook', user);
	                                  mData.user = user;
	                                  // Callback
	                                  if (callback) { callback(user) };
	                             });
	                        });
	                      } // if response = "connected"
	                }); // FB.getLoginStatus
	              }; // if (user.email)
	            }); // Users.get
    		},

		    authenticateUser: function(callback) {
	            // Check if current user
	            Users.getCurrentUser({}, function(user) {
	                if (user.email) {
	                    $rootScope.$broadcast('SignedInViaFacebook', user);
	                    mData.user = user;
	                    // Callback
	                    if (callback) { callback(user) };
	                } else {
	                    var self = this;
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
	                                  // Broadcast User when Signed In
	                                  $rootScope.$broadcast('SignedInViaFacebook', user);
	                                  mData.user = user;
	                                  // Callback
	                                  if (callback) { callback(user) };
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
	                                      // Broadcast User when Signed In
	                                      $rootScope.$broadcast('SignedInViaFacebook', user);
	                                      mData.user = user;
	                                      // Callback
	                                      if (callback) { callback(user) };
	                                 });
	                               });
	                            } else {
	                              console.log('User cancelled login or did not fully authorize.');
	                              var user = null;
	                              mData.user = user;
	                              // Callback
	                              if (callback) { callback(user) };
	                            }
	                        },{ scope: 'email,user_likes' });
	                      }; // if response = "connected"
	                }); // FB.getLoginStatus
	              }; // if (user.email)
	            }); // Users.get
	        } // authenticateUser

	}; // return

}]);