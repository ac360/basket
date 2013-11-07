//Clients service used for clients REST endpoint
window.app.factory("Clients", function($resource) {
    return $resource('clients/:clientId', {
        clientId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
});