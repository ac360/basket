// Medleys service used for medleys REST endpoint
angular.module('mean.retailers').factory("Retailers", ['$resource', function($resource) {
    return $resource('retailers/search', {
    }, {
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
    	}
    });
}]);