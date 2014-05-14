angular.module('mean.system').controller('FolderController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Defaults
    $scope.folderpage               = {};
    $scope.folderpage.medleys       = [];
    $scope.folder_offset            = 0;
    $scope.fetching_folder_medleys  = false;

    $scope.initializeFolderPage = function() {
        if ($scope.user) {
            if ($scope.folders) {
                angular.forEach($scope.folders,function(f){
                    if (f._id === $stateParams.folderId) {
                        $scope.folder = f;
                    };
                });
                $scope.getMedleysByFolder();
            } else {
                // Listener - Folders Loaded
                $scope.$on('FoldersLoaded', function(e, folders){
                    $scope.folders = folders;
                    angular.forEach($scope.folders,function(f){
                        if (f._id === $stateParams.folderId) {
                            $scope.folder = f;
                        };
                    }); // angular.forEach
                    $scope.getMedleysByFolder();
                });
            } // if $scope.folders
        } else {
        };
    };
    $scope.loadFolder = function() {
        Global.loadFolders();
    };
    $scope.removeMedleyFromFolder = function(medleyId, folder) {
        if (Global.getCurrentUser()) {
            // Remove Immediately From Page
            angular.forEach($scope.folderpage.medleys, function(m, index){
                if ( m.short_id === medleyId ) {
                    $scope.folderpage.medleys.splice(index, 1);
                };
            });
            // Remove From Data 
            angular.forEach(folder.medleys, function(m, index){
                if ( m === medleyId ) {
                    folder.medleys.splice(index, 1);
                    Global.updateFolder(folder);
                };
            });
        } else {
            Modals.signIn();
        }
    };
    $scope.getMedleysByFolder = function() {
        Global.getMedleysByFolder($stateParams.folderId, $scope.folder_offset, function(medleys) {
            $scope.folderpage.medleys = [];
            // Set Medley Size
            angular.forEach(medleys, function(medley) {
                $scope.folderpage.medleys.push( Global.sizeMedleySmall(medley) );
                Global.updateMedleyViewCount(medley.short_id);
            });
            $scope.folder_offset = $scope.folder_offset + 20;
        });
    };

    // Initialize
        // Listener - Folders Updated
        $scope.$on('FoldersUpdated', function(e, folder){
            $scope.getMedleysByFolder();
        });
        // Listeners - Medley Updated
        $scope.$on('MedleyUpdated', function(e, medley){
            angular.forEach($scope.folderpage.medleys, function(m) {
                if (m._id == medley._id) { 
                    m.votes = medley.votes
                };
            });
        });
    
}]);