//Issues service used for articles REST endpoint
angular.module('mean.issues').factory("Issues", ['$resource', function($resource) {
    return $resource('issues/:issueId', {
        articleId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);