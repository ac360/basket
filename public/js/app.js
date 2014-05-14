window.app = angular.module('mean', ['ngCookies', 'ngResource', 'ngAnimate', 'ngAnimate-animate.css', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.medleys', 'mean.retailers', 'mean.users', 'mean.votes', 'angularLocalStorage']);

angular.module('mean.system',    []);
angular.module('mean.retailers', []);
angular.module('mean.medleys',   []);
angular.module('mean.users',     []);
angular.module('mean.votes',     []);

app.run(function($rootScope, $state, $compile, Retailers) {
	
	// SEARCH FUNCTIONS ------------------------------------------
		// Defaults
		$rootScope.search_results 		  = [];
		$rootScope.search_meta    		  = { keywords: '', retailer: 'All Brands', offset: 0, limit: 20 };
		$rootScope.search_in_progress     = false;

		$rootScope.setRetailer = function(retailer) {
	        $rootScope.search_meta.retailer = retailer;
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
		            	$rootScope.search_results = $rootScope.search_results.concat(results);
		            	console.log("ShopStyle Results: ", $rootScope.search_results);
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
                if ($state.current.name === "home") {
                    // Browse Medleys Infinite Scroll
                    if ($scope.fetchingmedleys_inprogress === false) {
                        console.log("infinite scroll activated")
                        $scope.fetchingmedleys_inprogress = true;
                        $scope.getFeed();
                    };
                };
                if ($state.current.name === "search") {
                    // Search Area Infinite Scroll - Make Sure you have listings...
                    if ($rootScope.search_results.length > 19) {
                        if ($rootScope.search_in_progress === false) {
                        	// Add to the Offset
                            $rootScope.search_meta.offset = $rootScope.search_meta.offset + 20;
                            $rootScope.searchRetailers(true);
                        };
                    };
                };
            };
        });

}); // app.run

