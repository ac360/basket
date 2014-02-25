angular.module('mean.system').factory("Global", ['$http', '$rootScope', '$modal', '$state', '$stateParams', "Users", "Modals", "Medleys", "Votes", "Folders", function($http, $rootScope, $modal, $state, $stateParams, Users, Modals, Medleys, Votes, Folders) {
    
	var mData = { user: null, folders: null, medley: { items: [], template: 'a1' } };

    return {
    		// ---------- MEDLEYS ----------
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
    			 	medley = medley[0];
    			 	if(callback){ callback(medley) };
    			 });
    		},
    		resetMedley: function() {
    			mData.medley = { items: [] };
    		},
    		getMedleysByHashtag: function(hashtag, callback) {
    			Medleys.getByHashtag({ hashtag: hashtag }, function(medleys) {
    				console.log("hashtags found in Global:", medleys)
	    			if (callback) { callback(medleys) };
		        });
    		},
    		getMedleysByFolder: function(folderId, callback) {
    			Medleys.getByFolder({ folderId: folderId }, function(medleys) {
    				console.log("Folder Medleys found in Global:", medleys)
	    			if (callback) { callback(medleys) };
		        });
    		},
    		deleteMedley: function(shortId) {
    			Medleys.delete({ shortId: shortId }, function(medley) {
    				console.log("Medley Deleted From Global:", medley);
    				$rootScope.$broadcast('MedleyDeleted', medley);
    			});
    		},

    		// ---------- FOLDERS ----------
    		loadFolders: function(callback) {
    			var self = this;
    			if ( mData.user ) {
		            Folders.getByUser(function(folders) {
		            	mData.folders = folders;
		            	console.log("Global - User's Folders Loaded: ", folders);
		            	$rootScope.$broadcast('FoldersLoaded', folders);
		            	if (callback) { callback(mData.folders) };
		            });
		        }; 
    		},
    		createNewFolder: function(title, callback) {
    			var self = this;
    			if ( mData.user ) {
		            var folder = new Folders({ title: title });
		            folder.$save(function(folder) {
		            	console.log("folder created: ", folder);
		            	$rootScope.$broadcast('FoldersUpdated', folder);
		            }); 
		        } else {
		            Modals.signIn();
		        }
    		},
    		updateFolder: function(folder, callback) {
    			var self = this;
    			if ( mData.user ) {
    				var folder = new Folders(folder)
		            folder.$update({ folderId: folder._id }, function(folder) {
		            	console.log("Global - Folder Updated");
		            	$rootScope.$broadcast('FoldersUpdated', folder);
		            }); 
		        } else {
		            Modals.signIn();
		        }
    		},

    		// ---------- SHARE FUNCTIONS ----------
    		shareFacebook: function(medleyId) {
    			if ( mData.user ) {
	    			Medleys.show({ shortId: medleyId }, function(medley) {
	    				medley = medley[0];
	    				console.log("Facebook Share Medley Activated:  ", medley);
	    			 	if(medley) { 
	    			 		FB.ui({
				              method: 'feed',
				              link: 'http://mdly.co/'+medley.short_id,
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
	    		} else {
	    			Modals.signIn();
	    		};
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
                Medleys.updateVoteCount({ medleyId: medleyId }, function(medley) {
                	if (medley.error){
                		console.log(medley);
                	} else {
                		$rootScope.$broadcast('MedleyUpdated', medley);
                    	if (callback) { callback(medley) };
                	};
                });
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

    		checkSignIn: function() {
    			// Check if current user
	            Users.getCurrentUser({}, function(user) {
	                if (user.email) {
	                	mData.user = user;
	                    $rootScope.$broadcast('SignedInViaFacebook', user);
	                } else {
	                    var self = this;
	                    FB.getLoginStatus(function(response) {
	                      if (response.status === 'connected') {
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
	                                console.log("Successfully updated user in database and signed in: ", user);
	                                mData.user = user;
	                                // Broadcast User when Signed In
	                                $rootScope.$broadcast('SignedInViaFacebook', user);
	                            });
	                        });
	                       } // if response === 
	                    }); // FB.getLoginStatus
	                }; // if (user.email)
	            }); // Users.get
    		}, // checkSignIn

		    authenticateUser: function() {
	            // Check if current user
                FB.login(function(response) {
                    if (response.authResponse) {
                       FB.api('/me', function(response) {
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
                              mData.user = user;
                              $rootScope.$broadcast('SignedInViaFacebook', user);
                         });
                       });
                    } else {
                      console.log('User cancelled login or did not fully authorize.');
                      var user   = null;
                      mData.user = user;
                    }
                },{ scope: 'email,user_likes' });
	        } // authenticateUser

	}; // return

}]);