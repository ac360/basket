// Module dependencies.
var mongoose 		= require('mongoose'),
    async    		= require('async'),
    Medley 			= mongoose.model('Medley'),
    _ 				= require('underscore'),
    requestify      = require('requestify'),
	AmazonClient 	= require('apac').OperationHelper;

// Build Amazon Client
var aClient = new AmazonClient({
    awsId:     'AKIAJDJZ4UOFBQ5RDQ7A',
    awsSecret: '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',
    assocId:   'medley01-20'
});

// Set Etsy API Key
if (process && process.env.NODE_ENV == 'production') { 
	var etsyAPI = 'ckw5997nrdcuxxesk7pmpzy7' 
} else { 
	var etsyAPI = 'fidmluour59jmlqcxfvq5k7u' 
};

exports.search = function(req, res) {
	// Variables
	var self                = this;
	if ( req.query.q )             { var keywords = req.query.q } else { var keywords = null };
	var page     	 		= req.query.p;
	var retailer     	 	= req.query.retailer;
	if ( req.query.amazon_page )   { var amazonPage  = req.query.amazon_page   } else { var amazonPage = '1' };
	if ( req.query.etsy_offset )   { var etsyOffset  = req.query.etsy_offset   } else { var etsyOffset = '0' };
	if ( req.query.etsy_store_id ) { var etsyStoreId = req.query.etsy_store_id };
	var allResults   		= {};
	allResults.items 		= [];
	allResults.amazon_meta  = {};
	allResults.etsy_meta    = {};
	allResults.errors       = {};
	// Log Variables
	console.log("Search parameters: ", req.query);
	// Run search depending on retailer
	if (retailer == 'All Retailers') {
		searchAmazon(allResults, keywords, amazonPage, function(allResults){
			searchEtsy(allResults, keywords, etsyStoreId, etsyOffset, function(allResults){
				// Return
    			res.jsonp(allResults);
			});
		});
	} else if (retailer == 'Amazon') {
		searchAmazon(allResults, keywords, amazonPage, function(allResults){
			// Return
    		res.jsonp(allResults);
		});
	} else if (retailer == 'Etsy') {
		searchEtsy(allResults, keywords, etsyStoreId, etsyOffset, function(allResults){
			// Return
			res.jsonp(allResults);
		});
	};
}; // search

searchAmazon = function(allResults, keywords, amazonPage, cb) {

	// Amazon Search
	aResults 		 = {};
	aExcludedItems   = [];

	aClient.execute('ItemSearch', {
	  'SearchIndex': 	'All',
	  'Keywords': 		 keywords,
	  'ResponseGroup':  'ItemAttributes,Offers,Images',
	  'ItemPage':        amazonPage
	}, function(results) { // you can add a second parameter here to examine the raw xml response
		// Format All Results
		if (results.ItemSearchResponse.Items[0].Request[0].IsValid[0] === "True") {
			    
			    // Add Meta Details
			    allResults.amazon_meta.searched_keywords     = results.ItemSearchResponse.Items[0].Request[0].ItemSearchRequest[0].Keywords[0];
			    allResults.amazon_meta.searched_category     = results.ItemSearchResponse.Items[0].Request[0].ItemSearchRequest[0].SearchIndex[0];
			    allResults.amazon_meta.total_pages 		     = parseInt(results.ItemSearchResponse.Items[0].TotalPages[0]);
			    allResults.amazon_meta.this_page		     = parseInt(results.ItemSearchResponse.Items[0].Request[0].ItemSearchRequest[0].ItemPage[0])
			    allResults.amazon_meta.next_page		     = parseInt(results.ItemSearchResponse.Items[0].Request[0].ItemSearchRequest[0].ItemPage[0]) + 1;
			    allResults.amazon_meta.total_results  		 = parseInt(results.ItemSearchResponse.Items[0].TotalResults[0]);
			    allResults.amazon_meta.remaing_results 		 = allResults.amazon_meta.total_results - (allResults.amazon_meta.this_page * 10);
			    allResults.amazon_meta.more_listings         = true;
			    if ( allResults.amazon_meta.remaing_results > 0 ) { 
			    	allResults.amazon_meta.more_listings = true 
			    } else { 
			    	allResults.amazon_meta.more_listings = false
			    };

			    // Add Search Details
			    if ( results.ItemSearchResponse.Items[0].Item ) {
			    	results.ItemSearchResponse.Items[0].Item.forEach( function(i) {
				    	var new_i = {}
				    	new_i.title                     = i.ItemAttributes[0].Title[0];
						new_i.description               = null;
						new_i.votes                     = null;
				    	new_i.category                  = i.ItemAttributes[0].ProductGroup[0];
				    	new_i.link                      = i.DetailPageURL[0];
				    	// Check for Offers then show					
				    	if ( i.OfferSummary && parseInt(i.OfferSummary[0].TotalNew[0]  ) > 0 && i.OfferSummary[0].LowestNewPrice[0].Amount ) {
				    		new_i.price_new             = parseFloat(i.OfferSummary[0].LowestNewPrice[0].Amount[0]) / 100;
				    	} else { 
				    		new_i.price_new             = null;
				    	}
				    	if ( i.OfferSummary && parseInt(i.OfferSummary[0].TotalUsed[0] ) > 0 && i.OfferSummary[0].LowestUsedPrice[0].Amount  ) {
				    		new_i.price_used            = parseFloat(i.OfferSummary[0].LowestUsedPrice[0].Amount[0]) / 100;
				    	} else { 
				    		new_i.price_used            = null;
				    	}
				    	new_i.images                    = {};
				    	if (i.SmallImage)  {  new_i.images.small  = i.SmallImage[0].URL[0]; }  else { new_i.images.small = null}
				    	if (i.MediumImage) { new_i.images.medium = i.MediumImage[0].URL[0]; }  else { new_i.images.medium = null}
				    	if (i.LargeImage)  {  new_i.images.large  = i.LargeImage[0].URL[0]; }  else { new_i.images.large = null}
				    	new_i.retailer 					= 'Amazon';
				    	new_i.retailer_id 				= i.ASIN[0];
						// Remove Itesm with Useless Categories
				    	if (new_i.category != 'eBooks' && new_i.category != 'Mobile Application' && new_i.category != 'Digital Music Track') {
				    		allResults.items.push(new_i);
				    	} else {
				    		aExcludedItems.push(new_i)
				    	};
				    });
			    };
			    
				// Log Search Stats
				console.log("Amazon Search IsValid: " + results.ItemSearchResponse.Items[0].Request[0].IsValid[0]);
				console.log("Amazon Total Items Found: " + results.ItemSearchResponse.Items[0].TotalResults[0]);
				console.log("Items Excluded From Basket Count: ",  aExcludedItems.length);
				console.log("Amazon Page Searched: ", results.ItemSearchResponse.Items[0].Request[0].ItemSearchRequest[0].ItemPage[0]);
				// Return
				console.log("Amazon Search Done");
				cb(allResults);
		} else {
				allResults.errors.amazon = "Amazon search returned invalid";
				// Add Only Relevant Meta
				allResults.amazon_meta.more_listings = false;
				// Return
				console.log("Amazon Search Error: ", results.ItemSearchResponse.Items[0].Request[0].Errors[0].Error);
				cb(allResults);
		}; // If Amazon search is Valid
	}); // aClient.execute / Amazon Search Callback

}; // searchAmazon

searchEtsy = function(allResults, keywords, etsyStoreId, etsyOffset, cb) {
		// Etsy Search
		console.log("Keywords!", keywords)
		if (etsyStoreId && keywords) {
			console.log("Etsy store ID detected with keywords...");
			var etsyPath 	    = "https://openapi.etsy.com/v2/shops/" + etsyStoreId + "/listings/active.json?keywords=" + keywords + "&limit=10&offset=" + etsyOffset + "&includes=Images:1&api_key=" + etsyAPI;
		} else if (etsyStoreId && keywords === null) {
			console.log("Etsy store ID detected without keywords...")
			var etsyPath 	    = "https://openapi.etsy.com/v2/shops/" + etsyStoreId + "/listings/active.json?limit=10&offset=" + etsyOffset + "&includes=Images:1&api_key=" + etsyAPI;
		} else {
			console.log("No Etsy store ID detected...");
			var etsyPath 	    = "https://openapi.etsy.com/v2/listings/active.json?keywords=" + keywords + "&limit=10&offset=" + etsyOffset + "&includes=Images:1&api_key=" + etsyAPI;
		};
		var etsyIndex           = 1;
		var etsyExcludedItems   = [];

		requestify.get(etsyPath).then(function(response) {
			console.log("Etsy Search Done!");
			// Get Headers to check for errors

			// Format Results
			etsyRawResults 	= response.getBody();
			etsyRawResults.results.forEach( function(i) {
				var newItem 			= {};
				newItem.title 			= i.title;
				newItem.category        = i.category_path[0];
				newItem.description     = i.description;
				newItem.votes           = i.num_favorers;
				newItem.link			= i.url;
				newItem.price_new       = i.price;
				newItem.price_used      = null; 
				newItem.images          = {}; 
				newItem.images.small    = i.Images[0].url_75x75;
				newItem.images.medium   = i.Images[0].url_170x135;
				newItem.images.large    = i.Images[0].url_570xN;
				newItem.retailer 		= 'Etsy';
				newItem.retailer_id 	= i.listing_id;

				// Add to array, alternate between Amazon listings
				if (allResults.items.length > 0) {
					allResults.items.splice(etsyIndex, 0, newItem);
					etsyIndex = etsyIndex + 2;
				} else {
					allResults.items.push(newItem);
				};
			}); // forEach

			// Add Meta
			allResults.etsy_meta.searched_keywords       = keywords;
		    //newItem.meta.searched_category             = category;
		    allResults.etsy_meta.total_results  	   	 = etsyRawResults.count;
		    allResults.etsy_meta.next_offset             = etsyRawResults.pagination.next_offset;
		    allResults.etsy_meta.remaining_results  	 = allResults.etsy_meta.total_results - (allResults.etsy_meta.next_offset + 10);
		    if ( allResults.etsy_meta.remaining_results > 0 ) { 
		    	allResults.etsy_meta.more_listings = true 
		    } else {
		    	allResults.etsy_meta.more_listings = false
		    };

		    console.log("Etsy Search Finished...")
		    // Callback
		    cb(allResults);

		}); // Etsy Search Callback

}; // searchEtsy



