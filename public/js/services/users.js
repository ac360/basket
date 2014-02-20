// Issues service used for issues REST endpoint
angular.module('mean.users').factory("Users", ['$resource', function($resource) {
    return $resource('api/users/me', {
    }, {
        getCurrentUser : {
            method: 'GET',
            url:    'api/users/me'
        },
        signin: {
        	method: 'POST',
        	url:    'api/users/me'
        },
        updateCurrentUser: {
            method: 'PUT',
            url:    'api/users/me'
        },
        getUser: {
            method: 'GET',
            params: { username: '@_username' },
            url:    'api/users/:username'
        }
    });
}]);