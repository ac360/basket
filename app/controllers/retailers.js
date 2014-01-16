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

// Search Amazon
exports.search = function(req, res) {
	// Variables
	var keywords 	 		= req.query.q;
	var page     	 		= req.query.p;
	var allResults   		= {};
	allResults.items 		= [];
	allResults.amazon_meta  = {};
	allResults.etsy_meta    = {};
	allResults.errors       = {};
	
	// Amazon Search
	aResults 		 = {};
	aExcludedItems   = [];

    aClient.execute('ItemSearch', {
	  'SearchIndex': 	'All',
	  'Keywords': 		 keywords,
	  'ResponseGroup':  'ItemAttributes,Offers,Images'
	}, function(results) { // you can add a second parameter here to examine the raw xml response
		// Log Search Stats
		console.log("IsValid: " + results.ItemSearchResponse.Items[0].Request[0].IsValid[0]);
		console.log("Amazon Total Items: " + results.ItemSearchResponse.Items[0].TotalResults[0]);
		// Format All Results
		if (results.ItemSearchResponse.Items[0].Request[0].IsValid[0] === "True") {
			    
			    // Add Meta Details
			    allResults.amazon_meta.searched_keywords     = results.ItemSearchResponse.Items[0].Request[0].ItemSearchRequest[0].Keywords[0];
			    allResults.amazon_meta.searched_category     = results.ItemSearchResponse.Items[0].Request[0].ItemSearchRequest[0].SearchIndex[0];
			    allResults.amazon_meta.total_results  		 = results.ItemSearchResponse.Items[0].TotalResults[0];
			    allResults.amazon_meta.total_pages 		     = results.ItemSearchResponse.Items[0].TotalPages[0];

			    // Add Search Details
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
					// Remove Useless Categories before Adding Item to Array
			    	if (new_i.category != 'eBooks' && new_i.category != 'Mobile Application' && new_i.category != 'Digital Music Track') {
			    		allResults.items.push(new_i);
			    	} else {
			    		aExcludedItems.push(new_i)
			    	};
			    });
				console.log("Items Returned From Amazon Count: " + results.ItemSearchResponse.Items[0].Item.length);
				console.log("Items Excluded From Basket Count: ",  aExcludedItems.length);
				// Return
				// res.jsonp(aResults);
		} else {
				var amazonError            = {}
				amazonError.amazon_error   = "Amazon search returned invalid"
				allResults.errors.push(amazonError); 
				// Return
				// res.jsonp(aResults);
		}; // If Amazon search is Valid

		// Etsy Search 
		var etsyExcludedItems   = [];
		var etsyPath 	        = "https://openapi.etsy.com/v2/listings/active.json?keywords=" + keywords + "&limit=20&includes=Images:1&api_key=fidmluour59jmlqcxfvq5k7u"
		var etsyIndex           = 1;
		requestify.get(etsyPath).then(function(response) {
			console.log("Etsy Search Done!");
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
		    allResults.etsy_meta.this_page		         = etsyRawResults.pagination.effective_page;
		    allResults.etsy_meta.next_page		         = etsyRawResults.pagination.next_page;
		    allResults.etsy_meta.this_offset             = etsyRawResults.pagination.this_offset;
		    allResults.etsy_meta.next_offset             = etsyRawResults.pagination.next_offset;
		    

		    // Return
		    res.jsonp(allResults);


		}); // Etsy Search Callback
	}); // aClient.execute / Amazon Search Callback
};