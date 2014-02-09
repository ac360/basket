angular.module('mean.system').controller('ShowController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Initialization Methods At Bottom

    // Set Defaults
    $scope.show_medley      = false;
    $scope.load_error       = false;
    $scope.templateReady    = false;

    $scope.publishedShare = function() {
        Modals.publishedShare($scope.show_medley.short_id);
    };

    $scope.getVoteStatus = function() {
        Global.getMedleyVoteStatus($scope.show_medley._id, function(vote) {
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
        var h = $(window).height() + 40
        $('body').addClass(template);

        $scope.templateReady = true;
    };

    $scope.initializeShow = function() {
        var self = this;
        Global.showMedley( $stateParams.basketId, function(medley) {
            console.log(medley)
            if(!medley.items) {
                $timeout(function(){ 
                    $scope.load_error = true;
                },1000);
            } else {
                $scope.show_medley = Global.sizeMedleyMedium(medley);
                // Update Page Title
                var pageTitle = "Medley - " + $scope.show_medley.hashtags.join(" ");
                $(document).attr('title', pageTitle);
                // Apply Template
                $scope.applyTemplate(medley.template);
                // Check Share Option
                if ($scope.share == true) {
                    $timeout(function() {
                        $scope.publishedShare();
                    },4000)
                };
                // Update View Count
                Global.updateMedleyViewCount($scope.show_medley.short_id)
                // Get Vote Status
                if ($scope.user) {
                    $timeout(function() {
                        $scope.getVoteStatus();
                    })
                };
            } // If No Medley found 
        });
    }; // initializeShow();

    // Initialize

        // Listeners - Medley Updated
        $scope.$on('MedleyUpdated', function(e, medley) {
            console.log("Updated: ", medley);
            $scope.show_medley.votes = medley.votes;
            $scope.show_medley.views = medley.views;
        });

        if ($scope.user) {
            $scope.initializeShow();
        } else {
            $scope.initializeShow();
            // Listener - Authetication
            $scope.$on('SignedInViaFacebook', function(e, user){
                $timeout(function() {
                    $scope.getVoteStatus();
                })
            });
        }
    
}]);