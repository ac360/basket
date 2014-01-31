angular.module('mean.system').factory("Global", ['$http', '$rootScope', '$modal', '$state', '$stateParams', "Users", "Modals", "Medleys", function($http, $rootScope, $modal, $state, $stateParams, Users, Modals, Medleys) {
    
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
    		resetMedley: function() {
    			mData.medley: { items: [] }
    		},
    		showProductModal: function(product, callback) {
    			Modals.product(product);
    		},
    		getCurrentUser: function(callback) {
    			return mData.user;
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