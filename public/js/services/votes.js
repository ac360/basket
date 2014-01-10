// Issues service used for issues REST endpoint
angular.module('mean.votes').factory("Votes", ['$resource', function($resource) {
    return $resource('votes', {
    }, {
    	findByIssueAndUserId:    {
    		method:  'GET',
    		isArray: false,
            url: 'votes/findByIssueAndUserId'
    	}
    });
}]);