// Issues service used for issues REST endpoint
angular.module('mean.issues').factory("Issues", ['$resource', function($resource) {
    return $resource('issues/:issueId', {
        issueId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);