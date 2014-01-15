// Issues service used for issues REST endpoint
angular.module('mean.votes').factory("Votes", ['$resource', function($resource) {
    return $resource('votes/:voteId', {
    	voteId: '@_id'
    }, {
    	findByBasketAndUserId:    {
    		method:  'GET',
    		isArray: false,
            url: 'votes/findByMedleyAndUserId'
    	}
    });
}]);