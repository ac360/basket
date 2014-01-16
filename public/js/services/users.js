// Issues service used for issues REST endpoint
angular.module('mean.users').factory("Users", ['$resource', function($resource) {
    return $resource('users/me', {
    }, {
        update: {
            method: 'PUT'
        },
        signin: {
        	method: 'POST',
        	url:    'users/me'
        }
    });
}]);