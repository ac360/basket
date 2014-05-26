angular.module('mean.system').controller('FolderController', ['$rootScope', '$scope', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($rootScope, $scope, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Defaults

    $scope.initializeFolderPage = function() {
        // Defaults
        if ($stateParams.folderId)       { $rootScope.folderId = $stateParams.folderId };
        // Needed if user switches between folders
        $rootScope.medleys       = [];
        $rootScope.end_medleys   = false;
        $rootScope.medley_offset =  0;
        console.log("here", $rootScope.folderId)

        if ($rootScope.user && $rootScope.folders) {
            angular.forEach($rootScope.folders, function(f) {
                if (f._id === $stateParams.folderId) {
                    $rootScope.folder = f;
                };
            })
            $rootScope.getFeed("Folder Medleys");
        } else {
            // Listener - Folders Loaded
            $rootScope.$on('FoldersLoaded', function(e, folders){
                angular.forEach($rootScope.folders,function(f){
                    if (f._id === $stateParams.folderId) {
                        $rootScope.folder = f;
                    };
                });
                $rootScope.getFeed("Folder Medleys");
            });
        } // if $rootScope.folders
    };

    $scope.removeMedleyFromFolder = function(medleyId, folder) {
        if ($rootScope.user) {
            // Remove Immediately From Page
            angular.forEach($rootScope.medleys, function(m, index){
                if ( m.short_id === medleyId ) {
                    $rootScope.medleys.splice(index, 1);
                };
            });
            // Remove From Data 
            angular.forEach($rootScope.folder.medleys, function(m, index){
                if ( m === medleyId ) {
                    $rootScope.folder.medleys.splice(index, 1);
                    $rootScope.updateFolder(folder);
                };
            });
        } else {
            Modals.signIn();
        }
    };

    // Initialize
        // Listener - Folders Updated
        $scope.$on('FoldersUpdated', function(e, folder){
            $scope.initializeFolderPage();
        });
        // Listeners - Medley Updated
        $scope.$on('MedleyUpdated', function(e, medley){
            angular.forEach($rootScope.medleys, function(m) {
                if (m._id == medley._id) { 
                    m.votes = medley.votes
                };
            });
        });
    
}]);