angular.module('mean.system').factory("Global", ['$http', '$rootScope', '$modal', '$state', '$stateParams', "Users", "Modals", "Medleys", "Votes", "Folders", function($http, $rootScope, $modal, $state, $stateParams, Users, Modals, Medleys, Votes, Folders) {
    
	var mData = { user: null, folders: null, medley: { items: [], template: 'a1' } };

    return {

	}; // return

}]);