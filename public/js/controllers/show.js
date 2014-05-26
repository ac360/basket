angular.module('mean.system').controller('ShowController', ['$rootScope', '$scope', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($rootScope, $scope, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Initialization Methods At Bottom

    // Set Defaults
    $scope.load_error       = false;
    $scope.templateReady    = false;

    $scope.getVoteStatus = function() {
        Global.getMedleyVoteStatus($rootScope.show_medley._id, function(vote) {
            // If User Has Not Voted
            if (vote) {
                $('.fa-heart-o').removeClass('fa-heart-o').addClass('fa-heart');
            // If User Has Voted
            } else {
                $('.fa-heart').removeClass('fa-heart').addClass('fa-heart-o');
            };
        });
    };

    $scope.applyTemplate = function(template) {
        // Add Template Style
        var h = $(window).height() + 40;
        $('body').addClass(template);
        $scope.templateReady = true;
    };

    $scope.initializeShow = function() {
        $rootScope.showMedley( $stateParams.basketId, function(medley) {
            if(!medley.items) {
                $timeout(function(){ 
                    $scope.load_error = true;
                },1000);
            } else {
                $rootScope.show_medley = $rootScope.sizeMedleyMedium(medley);
                console.log("Show Medley: ", $rootScope.show_medley);
                // Update Page Title
                var pageTitle = "Medley - " + $rootScope.show_medley.hashtags.join(" ");
                $(document).attr('title', pageTitle);
                // Apply Template
                $scope.applyTemplate($rootScope.show_medley.template);
                // Check Share Option
                if ($rootScope.share == true) {
                    $timeout(function() {
                        if ($state.current.name === 'show') {
                            Modals.publishedShare($rootScope.show_medley);
                            $rootScope.share = false;
                        };
                    }, 4000);
                };
                // Update View Count
                $rootScope.updateMedleyViewCount($rootScope.show_medley.short_id)
                // Get Vote Status
                if ($rootScope.user) {
                    $timeout(function() {
                        $rootScope.getMedleyVoteStatus($rootScope.show_medley.short_id);
                    }, 5000)
                };
            } // If No Medley found 
        }); // $rootScope.showMedley()
    }; // initializeShow();

    // Initialize

        $scope.initializeShow();

        // Listeners - Medley Updated
        $scope.$on('MedleyUpdated', function(e, medley) {
            console.log("Show Medley Updated: ", medley);
            $rootScope.show_medley.votes = medley.votes;
            $rootScope.show_medley.views = medley.views;
        });
}]);