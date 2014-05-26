window.app = angular.module('mean', ['ngCookies', 'ngResource', 'ngAnimate', 'ngAnimate-animate.css', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.medleys', 'mean.retailers', 'mean.users', 'mean.votes', 'angularLocalStorage']);

angular.module('mean.system',    []);
angular.module('mean.retailers', []);
angular.module('mean.medleys',   []);
angular.module('mean.users',     []);
angular.module('mean.votes',     []);

app.run(function($rootScope, $state, $stateParams, $compile, $timeout, Retailers, Users, Folders, Medleys, Modals, Votes) {
	
	// USER FUNCTIONS --------------------------------------------
			$rootScope.loadUser = function(retailer) {
			    Users.getCurrentUser(function(user) {
					if (user.username) {
						$rootScope.user = user;
						$rootScope.loadFolders();
						console.log("User Logged In:", user);
					} else {
						$rootScope.user = false;
						console.log("User Not Logged In:", user);
					};
				});
			}; // $rootScope.loadUser

			$rootScope.updateUser = function(updatedUser, callback) {
    			Users.updateCurrentUser(updatedUser, function(user) {
	                if (!user.error) { 
	                	$rootScope.user = user;
	                };
                    if (callback)    { callback(user) };
	            });
    		};

	// SEARCH FUNCTIONS ------------------------------------------
			// Defaults
			$rootScope.search_results 		  = false;
			$rootScope.search_meta    		  = { keywords: '', retailer: 'All Brands', offset: 0, limit: 20 };
			$rootScope.search_in_progress     = false;

			$rootScope.setRetailer = function(retailer) {
		        $rootScope.search_meta.retailer = retailer;
		        if ($rootScope.search_results === 'none') { $rootScope.search_results = false };
		    };

			$rootScope.searchRetailers = function(scrollsearch) {
				$rootScope.search_in_progress = true;
		        // Check State, Navigate to Search Page
		        if ($state.current.name !== "search") {
		            $state.go('search', {}, {});
		        };
		        // Check if Infinite Scroll Search
		        if (!scrollsearch) {
		        	$rootScope.search_results = [];
		        };
				// Check Retailers
		        if ($rootScope.search_meta.retailer === 'All Brands' || $rootScope.search_meta.retailer === 'Anthropologie'  || $rootScope.search_meta.retailer === 'Asos' || $rootScope.search_meta.retailer === 'Banana Republic' || $rootScope.search_meta.retailer === 'Burberry' || $rootScope.search_meta.retailer === 'Coach' || $rootScope.search_meta.retailer === 'Forever 21' || $rootScope.search_meta.retailer === 'Gap' || $rootScope.search_meta.retailer === 'Gucci' || $rootScope.search_meta.retailer === 'J. Crew' || $rootScope.search_meta.retailer === 'Marc Jacobs' || $rootScope.search_meta.retailer === 'Michael Kors' || $rootScope.search_meta.retailer === 'Nasty Gal' || $rootScope.search_meta.retailer === 'Nike' || $rootScope.search_meta.retailer === 'Old Navy' || $rootScope.search_meta.retailer === "Victorias Secret" || $rootScope.search_meta.retailer === 'Yves Saint Laurent') {
		        	// Set Up Params
		        	var params_shopstyle 		= {};
		        	params_shopstyle.fts 		= $rootScope.search_meta.keywords;
		        	params_shopstyle.offset     = $rootScope.search_meta.offset;
		        	params_shopstyle.limit      = $rootScope.search_meta.limit;
		        	// Check If Specific ShopStyle Retailer is Picked
		        	if ( $rootScope.search_meta.retailer === 'Anthropologie'  || $rootScope.search_meta.retailer === 'Asos' || $rootScope.search_meta.retailer === 'Banana Republic' || $rootScope.search_meta.retailer === 'Burberry' || $rootScope.search_meta.retailer === 'Coach' || $rootScope.search_meta.retailer === 'Forever 21' || $rootScope.search_meta.retailer === 'Gap' || $rootScope.search_meta.retailer === 'Gucci' || $rootScope.search_meta.retailer === 'J. Crew' || $rootScope.search_meta.retailer === 'Marc Jacobs' || $rootScope.search_meta.retailer === 'Michael Kors' || $rootScope.search_meta.retailer === 'Nasty Gal' || $rootScope.search_meta.retailer === 'Nike' || $rootScope.search_meta.retailer === 'Old Navy' || $rootScope.search_meta.retailer === "Victorias Secret" || $rootScope.search_meta.retailer === 'Yves Saint Laurent' ) {
		        		// Match ShopStyle Brands to ShopStyle Brand IDs
		        		if ( $rootScope.search_meta.retailer === 'Anthropologie' ) { var shopstyleBrandID = 'b728' }; if ( $rootScope.search_meta.retailer === 'Asos' ) { var shopstyleBrandID = 'b4486' }; if ( $rootScope.search_meta.retailer === 'Banana Republic' ) { var shopstyleBrandID = 'b2683' }; if ( $rootScope.search_meta.retailer === 'Burberry' ) { var shopstyleBrandID = 'b870' }; if ( $rootScope.search_meta.retailer === 'Coach' ) { var shopstyleBrandID = 'b981' }; if ( $rootScope.search_meta.retailer === 'Forever 21' ) { var shopstyleBrandID = 'b2333' }; if ( $rootScope.search_meta.retailer === 'Gap' ) { var shopstyleBrandID = 'b2446' }; if ( $rootScope.search_meta.retailer === 'Gucci' ) { var shopstyleBrandID = 'b1242' }; if ( $rootScope.search_meta.retailer === 'J. Crew' ) { var shopstyleBrandID = 'b284' }; if ( $rootScope.search_meta.retailer === 'Marc Jacobs' ) { var shopstyleBrandID = 'b1606' }; if ( $rootScope.search_meta.retailer === 'Michael Kors' ) { var shopstyleBrandID = 'b391' }; if ( $rootScope.search_meta.retailer === 'Nasty Gal' ) { var shopstyleBrandID = 'b29565' }; if ( $rootScope.search_meta.retailer === 'Nike' ) { var shopstyleBrandID = 'b422' }; if ( $rootScope.search_meta.retailer === 'Old Navy' ) { var shopstyleBrandID = 'b3471' }; if ( $rootScope.search_meta.retailer === "Victorias Secret" ) { var shopstyleBrandID = 'b2335' }; if ( $rootScope.search_meta.retailer === 'Yves Saint Laurent' ) { var shopstyleBrandID = 'b2263' };
		        		params_shopstyle.fl     = shopstyleBrandID;
		        	};
		        	// Perform Search
		        	Retailers.searchShopStyle( params_shopstyle, function(results) {
			            $rootScope.formatResultsShopStyle(results, function(results) {
			            	if (!results.length) {
			            		$rootScope.search_results = 'none'
			            	} else {
			            		$rootScope.search_results = $rootScope.search_results.concat(results);
			            	};
			            	console.log("Search completed: ", $rootScope.search_meta)
			            	console.log("Search Results: ", $rootScope.search_results);
			            	$rootScope.search_in_progress = false;
			            }); // $rootScope.formatResultsShopStyle
			        }); // Retailers.searchShopStyle

		        }; // if ($rootScope.search_meta.retailer === 'All')	

		    }; // $rootScope.searchRetailers

		    $rootScope.formatResultsShopStyle = function(result, callback) {
		    	var results = [];
		    	result.products.forEach( function(r) {
					var newItem 			= {};
					newItem.title 			= r.name;
					newItem.category        = r.categories[0].name;
					newItem.description     = r.description.replace(/<\/?[^>]+(>|$)/g, "");
					newItem.link			= r.clickUrl;
					newItem.price_new       = r.price;
					newItem.price_used      = null;
					newItem.images          = {}; 
					newItem.images.small    = r.image.sizes.Large.url;
					newItem.images.medium   = r.image.sizes.IPhone.url;
					newItem.images.large    = r.image.sizes.Original.url;
					newItem.retailer 		= r.retailer.name;
					newItem.retailer_id 	= r.id;
					// Push to array
					results.push(newItem);
				});
				// Callback
		    	callback(results);
		    }; // $rootScope.formatResultsShopStyle

		    // Listener - Scroll for Infinite Loading
	        $(window).scroll(function() {
	            if ( $(window).scrollTop() >= ( $(document).height() - $(window).height() ) ) {
	                if ($state.current.name === "search") {
	                    // Search Area Infinite Scroll - Make Sure you have listings...
	                    if ($rootScope.search_results.length > 19) {
	                        if ($rootScope.search_in_progress === false) {
	                        	// Add to the Offset
	                            $rootScope.search_meta.offset = $rootScope.search_meta.offset + 20;
	                            $rootScope.searchRetailers(true);
	                        };
	                    } else {
	                    	$rootScope.search_meta.offset = 0
	                    };
	                } else if ($state.current.name === "home" || $state.current.name === "user" || $state.current.name === "hashtag") {
	                	if ($rootScope.loading_medleys === false) {
	                        console.log("infinite scroll activated")
	                        $rootScope.getFeed();
	                    };
	                };
	            };
	        });

	// MEDLEY CRUD FUNCTIONS ------------------------------
		// Defaults
			$rootScope.basket = { items: [], hastags: [], template: 'a1' };
			$rootScope.basket_status = "Add Some Items..."

			$rootScope.setBasketStatus = function() {
		      if ( $rootScope.basket.items.length == 1 ) { 
		        $rootScope.basket_status = "Add 1 more item...";
		        $rootScope.basket_publish = false;
		      } else if ( $rootScope.basket.items.length > 1 ) { 
		        $rootScope.basket_status = "Ready to publish!";
		        $rootScope.basket_publish = true;
		      } else {
		        $rootScope.basket_status = "Add Some Items..."
		        $rootScope.basket_publish = false;
		      };
		    };
		    $rootScope.addBasketItem = function(item, $event) {
		        // Set Gridster Defaults
		        item.row = item.col = item.size_x = item.size_y = 1;
		        $rootScope.basket.items.push(item);
		        $rootScope.basket_full = true;
		        $rootScope.setBasketStatus();
		        angular.forEach($rootScope.search_results, function(result, index){ 
		        	if (result.retailer_id === item.retailer_id) {$rootScope.search_results[index].hidden = true };
		        });
		    };
		    $rootScope.hideSearchResult = function() {

		    };
		    $rootScope.removeMedleyItem = function(hashKey, sourceArray) {
		        angular.forEach(sourceArray, function(obj, index){
			        if (obj.$$hashKey === hashKey) {
			            sourceArray.splice(index, 1);
			            $rootScope.setBasketStatus();
			            return;
			        };
		        });
		    };
		    $rootScope.showProductPreview = function(item) {
		      $rootScope.product_preview = item;
		    };
		    $rootScope.hideProductPreview = function(item) {
		      $rootScope.product_preview = false;
		    };
	
	// MEDLEYS ------------------------------------------
			$rootScope.publishMedley = function(callback) {
	            var medley = new Medleys($rootScope.basket);
	            console.log("Medley To Be Published: ", medley);
	            medley.$save( function(medley) {
	            	console.log("Medley Published", medley)
	            	$rootScope.$broadcast('MedleyPublished', medley);
	            	$rootScope.share = true;
	            	$rootScope.basket = { items: [], hastags: [], template: 'a1' };
	            });
    		};
    		$rootScope.showMedley = function(medleyId, callback) {
    			 Medleys.show({ shortId: medleyId }, function(medley) {
    			 	if(callback){ callback(medley[0]) };
    			 });
    		};
    		$rootScope.voteMedley = function(medleyId, callback) {
                Medleys.updateVoteCount({ medleyId: medleyId }, function(medley) {
                	if (medley.error){
                		console.log(medley);
                	} else {
                		$rootScope.$broadcast('MedleyUpdated', medley);
                    	if (callback) { callback(medley) };
                	};
                });
	        };
    		$rootScope.getMedleyVoteStatus = function(medleyId, callback) {
	            Votes.findByMedleyAndUserId({ medley: medleyId }, function(vote){
	                if (vote.errors) { vote = null    };
	                if (callback)    { callback(vote) };
	            })
	        };
	        $rootScope.deleteMedley = function(shortId) {
    			Medleys.delete({ shortId: shortId }, function(medley) {
    				console.log("Medley Deleted:", medley);
    				$rootScope.$broadcast('MedleyDeleted', medley);
    			});
    		};
			$rootScope.sizeMedleySmall =function(medley) {
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
	    	};
	    	$rootScope.sizeMedleyMedium = function(medley) {
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
	    	};
	    	$rootScope.updateMedleyViewCount = function(medleyId) {
	            Medleys.updateViewCount({ medleyId: medleyId }, function(medley){
	                $rootScope.$broadcast('MedleyUpdated', medley); 
	            });
		    };


	// MEDLEYS FEED -------------------------------------
		// Defaults
			$rootScope.medleys 		   = [];
			$rootScope.draggable       = true;
			$rootScope.feed            = "Featured Medleys";
			$rootScope.medley_offset   = 0;
			$rootScope.loading_medleys = false;
			$rootScope.end_medleys     = false;
		// Methods
		    $rootScope.getFeed = function(type) {
		        if (type && type !== $rootScope.feed) { 
		        	$rootScope.medleys = []; $rootScope.medley_offset =  0; $rootScope.feed = type; $rootScope.end_medleys = false;
		        };
		        if ($rootScope.end_medleys === false) {
		        	$rootScope.loading_medleys = true;
		        	console.log( "Getting Medley Feed – Feed: " + $rootScope.feed + " Offset: " + $rootScope.medley_offset );
			        if ($rootScope.feed === "Featured Medleys") {
			            $rootScope.MedleysByVotes(); 
			        } else if ($rootScope.feed === "Most Voted Medleys")  {
			            $rootScope.MedleysByVotes();
			        } else if ($rootScope.feed === "Most Viewed Medleys") {
			            $rootScope.MedleysByViews();
			        } else if ($rootScope.feed === "Most Recent Medleys") {
			            $rootScope.MedleysByMostRecent();
			        } else if ($rootScope.feed === "Profile Medleys")     {
			        	$rootScope.MedleysByProfile();
			        } else if ($rootScope.feed === "Hashtag Medleys")     {
			        	$rootScope.MedleysByHashtag();
			        } else if ($rootScope.feed === "Folder Medleys")     {
			        	$rootScope.MedleysByFolder();
			        };
			    };
		    };
		    $rootScope.MedleysByFeatured = function(cb){
		        Medleys.getFeatured({ offset: $rootScope.medley_offset }, function(medleys) {
		        	// Check if end of results
		        	if (medleys.length < 1) { $
		        		$rootScope.end_medleys = true;
		        		console.log("No More Medleys");
		        		$rootScope.loading_medleys = false;
		        		return false 
		        	};
		            // Set Medley Size
		            angular.forEach(medleys, function(medley) {
		                $rootScope.medleys.push( $rootScope.sizeMedleySmall(medley) );
		                $rootScope.updateMedleyViewCount(medley.short_id);
		            });
		            console.log("Medleys By Featured:", $rootScope.medleys);
		            $rootScope.medley_offset   =  $rootScope.medley_offset + 20;
		            $rootScope.loading_medleys = false;
		        }); // Medleys.getMostVoted
		    };
		    $rootScope.MedleysByMostRecent = function(cb){
		        Medleys.getMostRecent({ offset: $rootScope.medley_offset }, function(medleys) {
		        	// Check if end of results
		        	if (medleys.length < 1) { $
		        		$rootScope.end_medleys = true;
		        		console.log("No More Medleys");
		        		$rootScope.loading_medleys = false;
		        		return false 
		        	};
		            // Set Medley Size
		            angular.forEach(medleys, function(medley) {
		                $rootScope.medleys.push( $rootScope.sizeMedleySmall(medley) );
		                $rootScope.updateMedleyViewCount(medley.short_id);
		            });
		            console.log("Medleys By Recent:", $rootScope.medleys);
		            $rootScope.medley_offset =  $rootScope.medley_offset + 20;
		            $rootScope.loading_medleys = false;
		        }); // Medleys.getMostRecent
		    };
		    $rootScope.MedleysByVotes = function(cb){
		        Medleys.getMostVoted({ offset: $rootScope.medley_offset }, function(medleys) {
		        	// Check if end of results
		        	if (medleys.length < 1) { $
		        		$rootScope.end_medleys = true;
		        		console.log("No More Medleys");
		        		$rootScope.loading_medleys = false;
		        		return false 
		        	};
		            // Set Medley Size
		            angular.forEach(medleys, function(medley) {
		                $rootScope.medleys.push( $rootScope.sizeMedleySmall(medley) );
		                $rootScope.updateMedleyViewCount(medley.short_id);
		            });
		            console.log("Medleys By Votes:", $rootScope.medleys);
		            $rootScope.medley_offset =  $rootScope.medley_offset + 20;
		            $rootScope.loading_medleys = false;
		        }); // Medleys.getMostVoted
		    };
		    $rootScope.MedleysByViews = function(cb){
		        Medleys.getMostViewed({ offset: $rootScope.medley_offset }, function(medleys) {
		        	// Check if end of results
		        	if (medleys.length < 1) { $
		        		$rootScope.end_medleys = true;
		        		console.log("No More Medleys");
		        		$rootScope.loading_medleys = false;
		        		return false 
		        	};
		            // Set Medley Size
		            angular.forEach(medleys, function(medley) {
		                $rootScope.medleys.push( $rootScope.sizeMedleySmall(medley) );
		                $rootScope.updateMedleyViewCount(medley.short_id);
		            });
		            console.log("Medleys By Views:", $rootScope.medleys);
		            $rootScope.medley_offset =  $rootScope.medley_offset + 20;
		            $rootScope.loading_medleys = false;
		        }); // Medleys.getMostViewed
		    };
		    $rootScope.MedleysByProfile = function() {
		        // Fetch Your Medleys
		        Medleys.getUserMedleys({ username: $rootScope.profile.username, offset: $rootScope.medley_offset }, function(medleys) {
		        	// Check if end of results
		        	if (medleys.length < 1) { $
		        		$rootScope.end_medleys = true;
		        		console.log("No More Medleys");
		        		$rootScope.loading_medleys = false;
		        		return false 
		        	};
		            angular.forEach(medleys, function(medley) {
		                $rootScope.medleys.push( $rootScope.sizeMedleySmall(medley) );
		                $rootScope.updateMedleyViewCount(medley.short_id);
		            });
		            console.log("Medleys by profile "+ $rootScope.profile.username +" offset:" + $rootScope.medley_offset + " loaded:", $rootScope.medleys);
		            $rootScope.loading_medleys = false;
		            $rootScope.medley_offset   = $rootScope.medley_offset + 20;
		        });
		    };  
		    $rootScope.MedleysByHashtag = function() {
		        Medleys.getByHashtag({ hashtag: $rootScope.hashtag, offset: $rootScope.medley_offset }, function(medleys) {
		        	// Check if end of results
		        	if (medleys.length < 1) { $
		        		$rootScope.end_medleys = true;
		        		console.log("No More Medleys");
		        		$rootScope.loading_medleys = false;
		        		return false 
		        	};
    				// Set Medley Size
		            angular.forEach(medleys, function(medley) {
		                $rootScope.medleys.push( $rootScope.sizeMedleySmall(medley) );
		                $rootScope.updateMedleyViewCount(medley.short_id);
		            });
		            // Set Offset
		            $rootScope.medley_offset   =  $rootScope.medley_offset + 20;
		            console.log("Medleys by hashtag: " + $rootScope.hashtag, $rootScope.medley_offset, $rootScope.medleys);
		            $rootScope.loading_medleys = false;
		        });
		    };
		    $rootScope.MedleysByFolder = function() {
    			Medleys.getByFolder({ folderId: $rootScope.folderId, offset: $rootScope.medley_offset }, function(medleys) {
    				// Check if end of results
		        	if (medleys.length < 1) { $
		        		$rootScope.end_medleys = true;
		        		console.log("No More Medleys");
		        		$rootScope.loading_medleys = false;
		        		return false;
		        	};
		        	// Set Medley Size
		            angular.forEach(medleys, function(medley) {
		                $rootScope.medleys.push( $rootScope.sizeMedleySmall(medley) );
		                $rootScope.updateMedleyViewCount(medley.short_id);
		            });
    				console.log("Folder Medleys Loaded:", $rootScope.medleys);
    				// Set Offset
    				$rootScope.medley_offset   =  $rootScope.medley_offset + 20;
    				$rootScope.loading_medleys = false;
	    			
		        });
    		};


    // FOLDERS -----------------------------------------
    	// Listeners
    		// Folders Updated
            $rootScope.$on('FoldersUpdated', function(e, folder){
                  // Reload All Folders
                  $rootScope.loadFolders(function(folders) {
                      $rootScope.folders = folders;
                  });
            });
    	// Methods
    		$rootScope.loadFolders = function(event, data) {
    			Folders.getByUser(function(folders) {
	        		$rootScope.folders = folders;
	            	console.log("Folders: ", folders);
	            	$rootScope.$broadcast('FoldersLoaded', folders);
	            });
    		};
    		$rootScope.createNewFolder = function(title, callback) {
    			if ( $rootScope.user ) {
		            var folder = new Folders({ title: title });
		            folder.$save(function(folder) {
		            	console.log("folder created: ", folder);
		            	$rootScope.$broadcast('FoldersUpdated', folder);
		            }); 
		        } else {
		            Modals.signIn();
		        }
    		};
		    $rootScope.addMedleyToFolder = function(event, data) {
		        if ($rootScope.user) {
		            var medley   = data;
		            var folderId = $(event.currentTarget).attr("data-id");
		            angular.forEach($rootScope.folders, function(f, index){
		              if (f._id === folderId) {
		                f.medleys.push(medley.short_id);
		                $rootScope.updateFolder(f);
		                return;
		              };
		            });
		        } else {
		            Modals.signIn();
		        }
		    };
		    $rootScope.newFolderModal = function() {
		        if ($rootScope.user) {
		            Modals.folder();
		        } else {
		            Modals.signIn();
		        }
		    };
		    $rootScope.deleteFolder = function(folder) {
		        var r = confirm("Are you sure you want to delete this folder?  You will lose all of the medleys in it!");
		        if (r === true) {
		            Folders.delete({ folderId: folder._id }, function(folder){
		                console.log("Folder deleted:", folder);
		                $rootScope.$broadcast('FoldersUpdated', folder);
		            })
		        };
		    };
		    $rootScope.updateFolder = function(folder, callback) {
    			if ( $rootScope.user ) {
    				var folder = new Folders(folder)
		            folder.$update({ folderId: folder._id }, function(folder) {
		            	console.log("Folder Updated");
		            	$rootScope.$broadcast('FoldersUpdated', folder);
		            }); 
		        } else {
		            Modals.signIn();
		        }
    		},

    // SHARE FUNCTION -----------------------------------------
    		$rootScope.shareMedley = function(medley) {
		        if ($rootScope.user) {
		            Modals.share(medley);
		        } else {
		            Modals.signIn();
		        }
		    };

    // LISTENERS
    		// State Change Start
		    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		          // Adjust Page Title
		          if (toState.name !== 'show' && toState.name !== 'create') { 
		            $('body').removeClass().addClass('a1') 
		          };
		          // Adjust Template on Create Page
		          if (toState.name === 'create') { 
		                if ($rootScope.basket && $rootScope.basket.template) {
		                    $('body').removeClass().addClass($rootScope.basket.template); 
		                    $('.logo').html('<img ng-src="img/logo_' + $rootScope.basket.template + '.png" draggable="false">');
		                } else {
		                    $('body').removeClass().addClass('a1'); 
		                    $('.logo').html('<img ng-src="img/logo_a1.png" draggable="false">');
		                };
		          };
		          // Adjust Template
		          if (toState.name !== 'show')   { $(document).attr('title', 'Medley - The New Shopping Cart!')      };                  
		    });

	// INITIALIZATION ----------------
			$timeout(function(){
				$rootScope.loadUser();
			});

}); // app.run

