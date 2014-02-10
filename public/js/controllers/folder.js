angular.module('mean.system').controller('FolderController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Defaults
    $scope.folderpage = {};

    $scope.getMedleysByFolder = function() {
        Global.getMedleysByFolder($stateParams.folderId, function(medleys) {
            $scope.folderpage.medleys = [];
            // Set Medley Size
            angular.forEach(medleys, function(medley) {
                $scope.folderpage.medleys.push( Global.sizeMedleySmall(medley) );
                Global.updateMedleyViewCount(medley.short_id);
            });
        });
    };

    // Initialize
        if ($scope.user) {
            $scope.getMedleysByFolder();
        } else {
            // Listener - Authetication
            $scope.$on('SignedInViaFacebook', function(e, user){
                $scope.getMedleysByFolder();
            });
        };
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