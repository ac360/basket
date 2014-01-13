// Issues service used for issues REST endpoint
angular.module('mean.issues').factory("Issues", ['$resource', function($resource) {
    return $resource('issues/:issueId', {
        issueId: '@_id'
    }, {
    	get:    {
    		method:  'GET',
    		isArray: true
    	},
        show:    {
            method:  'GET'
        },
        update: {
            method:  'PUT'
        },
        updateViewCount: {
            method:  'GET',
            params: { issueId: '@_id' },
            url:     'issues/:issueId/updateviewcount'
        }
    });
}]);