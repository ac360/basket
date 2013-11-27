// Cities service used for articles REST endpoint
angular.module('mean.cities').factory("Cities", ['$resource', function($resource) {
    return $resource('cities/:query', {
    	query:'@query',
    	country_code: 'US'
    }, 
    {});
}]);