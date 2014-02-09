// Issues service used for issues REST endpoint
angular.module('mean.system').factory("Folders", ['$resource', function($resource) {
    return $resource('api/f/:folderId', {
    	folderId: '@_id'
    }, {
    	getByUser:    {
            method:  'GET',
            isArray: true,
            url:     'api/f'
        },
        update:      {
            method:  'PUT',
            isArray: false,
            url:     'api/f/:folderId'
        },
    });
}]);