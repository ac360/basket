// Medleys service used for medleys REST endpoint
window.app.factory("Retailers", ['$resource', function($resource) {
    return $resource( null, null, {
    	search:    {
    		method:  'GET',
            params:  { 
            	q: '@q', 
            	retailer: '@retailer', 
            	etsy_store_id: '@etsy_store_id', 
            	amazon_page: '@amazon_page',
            	etsy_offset: '@etsy_offset'  
            },
    		isArray: false
    	},
        searchShopStyle:    {
            method:  'GET',
            url:     'http://api.shopstyle.com/api/v2/products?pid=' + shopstyleKey,
            params:  { 
                fts:       '@fts', 
                offset:    '@offset', 
                limit:     '@limit' 
            },
            isArray: false
        }
    });
}]);