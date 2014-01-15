// Medleys service used for medleys REST endpoint
angular.module('mean.medleys').factory("Medleys", ['$resource', function($resource) {
    return $resource('medleys/:medleyId', {
        medleyId: '@_id'
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
            params: { medleyId: '@_id' },
            url:     'medleys/:medleyId/updateviewcount'
        },
        updateVoteCount: {
            method:  'GET',
            params: { medleyId: '@_id' },
            url:     'medleys/:medleyId/updatevotecount'
        }
    });
}]);