// Module dependencies.
var mongoose 		= require('mongoose'),
    async    		= require('async'),
    Medley 			= mongoose.model('Medley'),
    _ 				= require('underscore'),
	AmazonClient 	= require('apac').OperationHelper;

// Build Amazon Client
var aClient = new AmazonClient({
    awsId:     'AKIAJDJZ4UOFBQ5RDQ7A',
    awsSecret: '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',
    assocId:   'medley01-20'
});

// Search Amazon
exports.search = function(req, res) {
	var keywords 	= req.query.q;
	var page     	= req.query.p;
	aResults 		= {}
	aResults.meta   = {}
	aResults.items 	= [];
	excludedItems   = [];

    aClient.execute('ItemSearch', {
	  'SearchIndex': 	'All',
	  'Keywords': 		keywords,
	  'ResponseGroup':  'ItemAttributes,Offers,Images'
	}, function(results) { // you can add a second parameter here to examine the raw xml response
		// Log Search Stats
		console.log("IsValid: " + results.ItemSearchResponse.Items[0].Request[0].IsValid[0]);
		console.log("Total Items: " + results.ItemSearchResponse.Items[0].TotalResults[0]);
		// Format All Results
		if (results.ItemSearchResponse.Items[0].Request[0].IsValid[0] === "True") {
			    // Meta Details
			    aResults.meta.searched_keywords     = results.ItemSearchResponse.Items[0].Request[0].ItemSearchRequest[0].Keywords[0];
			    aResults.meta.searched_category     = results.ItemSearchResponse.Items[0].Request[0].ItemSearchRequest[0].SearchIndex[0];
			    aResults.meta.total_results  		= results.ItemSearchResponse.Items[0].TotalResults[0];
			    aResults.meta.total_pages 		    = results.ItemSearchResponse.Items[0].TotalPages[0];
			    aResults.items                      = [];

			    // Search Details
			    results.ItemSearchResponse.Items[0].Item.forEach( function(i) {
			    	var new_i = {}
			    	new_i.title                     = i.ItemAttributes[0].Title[0];
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
			    		aResults.items.push(new_i);
			    	} else {
			    		excludedItems.push(new_i)
			    	};
			    });
				console.log("Items Returned From Amazon Count: " + results.ItemSearchResponse.Items[0].Item.length);
				console.log("Items Excluded From Basket Count: ", excludedItems.length);
				res.jsonp(aResults);
		} else {
				aResults.error = "Something Went Wrong With Your Search"
				res.jsonp(aResults);
		};	
	});
};