// Medleys service used for medleys REST endpoint
angular.module('mean.medleys').factory("Admin", ['$resource', function($resource) {
    return $resource('/api/a', {}, {
        getUsers: {
            method:  'GET',
            isArray: true,
            url:     'api/a/users'
        },
        deleteTestMedleys: {
            method:  'GET',
            isArray: false,
            url:     'api/a/delete_tests'
        }
    });
}]);