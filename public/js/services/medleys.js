// Medleys service used for medleys REST endpoint
angular.module('mean.medleys').factory("Medleys", ['$resource', function($resource) {
    return $resource('/api/m', {
        medleyId: '@_id'
    }, {
        getFeatured:    {
            method:  'GET',
            isArray: true,
            url:     'api/m/by_featured'
        },
        getMostVoted:    {
            method:  'GET',
            isArray: true,
            url:     'api/m/by_votes'
        },
        getMostViewed:    {
            method:  'GET',
            isArray: true,
            url:     'api/m/by_views'
        },
        // Not hooked up yet
        getMostRecent:    {
            method:  'GET',
            isArray: true,
            url:     'api/m/by_date'
        },
        getUserMedleys:    {
            method:  'GET',
            isArray: true,
            url:     'api/m/by_user/:username'
        },
        getByHashtag:    {
            method:  'GET',
            isArray: true,
            url:     'api/m/by_hashtag/:hashtag'
        },
        getByFolder:    {
            method:  'GET',
            isArray: true,
            url:     'api/m/by_folder/:folderId'
        },
        show:    {
            method:  'GET',
            isArray: false,
            url:     'api/m/short_id/:shortId'
        },
        updateViewCount: {
            method:  'GET',
            isArray: false,
            url:     'api/m/short_id/:medleyId/updateviewcount'
        },
        updateVoteCount: {
            method:  'GET',
            isArray: false,
            url:     'api/m/short_id/:medleyId/updatevotecount'
        },
        update: {
            method:  'PUT',
            isArray: false,
            url:     'api/m/short_id/:shortId'
        }
    });
}]);