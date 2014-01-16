angular.module('mean.system').controller('ShowController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'Votes', 'storage', '$state', '$stateParams', '$location', '$timeout', function ($scope, Global, Medleys, Retailers, Users, Votes, storage, $state, $stateParams, $location, $timeout) {

    // Initialization Methods At Bottom

    // Set Defaults
    $scope.global           = Global;
    $scope.show_basket      = false;
    $scope.show_gridster    = false;
    $scope.share;
    $scope.voteChecking     = false;
    $scope.vote             = false;
    $scope.hasVoted         = false;
    $scope.load_error       = false;

    $scope.publishedShare = function() {
      $('#publishedShareModal').modal('show');
      $scope.$parent.$parent.share = false;
    };

    $scope.voteBasket = function() {
        // Show Vote Spinner
        $scope.voteChecking = true;
        // Check if User is Logged In
        if ($scope.user) {
            // If User Has Voted, Remove Vote
            if ($scope.vote) {
                console.log("Withdrawing vote...")
                // Subtract Vote
                Medleys.updateVoteCount({ medleyId: $stateParams.basketId, vote: false }, function(b) {
                    console.log("Vote count subtracted:", b);
                    var vote = $scope.vote;
                    vote.$delete(function(v) {
                        console.log("Vote Destroyed!: ", v);
                        $timeout(function() {
                            $scope.voteChecking = false;
                            $scope.vote = false;
                            // Set New Vote Total
                            $scope.show_basket.votes = b.votes;
                        }, 500);
                    });
                });
            // If User Hasn't Voted, Add Vote
            } else {
                // Add Vote
                Medleys.updateVoteCount({ medleyId: $stateParams.basketId, vote: true }, function(b) {
                    console.log("Vote count added: ", b);
                    // Save Vote
                    var vote    = new Votes();
                    vote.medley = b._id
                    vote.user   = $scope.user;
                    vote.$save(function(v) {
                        console.log("Vote record created: ", v);
                        $timeout(function() {
                            $scope.voteChecking = false;
                            $scope.vote = v;
                            // Set New Vote Total
                            $scope.show_basket.votes = b.votes;
                        }, 500);
                    });
                });
            };
        } else {
            $('#signInModal').modal('show');
            $scope.voteChecking = false;
        };
    };

    $scope.shareFacebook = function() {
        FB.ui({
          method: 'feed',
          link: 'http://basket.herokuapp.com/'+$scope.show_basket.short_id,
          caption: "This Basket is a collection of awesome, hand-picked products created by " + $scope.show_basket.user.name,
          display: 'iframe',
          name: 'Basket - ' + $scope.show_basket.hashtags.join(" ")
        }, function(response){
            console.log(response);
            if ($('#publishedShareModal').hasClass('in')) {
                $('#publishedShareModal').modal('hide');
            };
        });
    };

    $scope.addItems = function(){
        // Add Items
        angular.forEach($scope.show_basket.items, function(item, index){
            $timeout(function(){
                var html = '<li class="show-basket-item animated bounceIn"><img src="'+ item.images.large +'" draggable="false"></li>';
                $scope.show_gridster.add_widget( html, item.size_x, item.size_y, item.col, item.row );
            }, 1000);
        });
    };

    // Initialize

    $scope.initializeShow = function() {

        var self = this;
        console.log("Basket Short ID: ", $stateParams.basketId);
        // Fetch Basket
        Medleys.show({ medleyId: $stateParams.basketId }, function(basket) {
            if (basket.short_id == parseInt($stateParams.basketId)) {
                    $scope.show_basket    = basket;
                    // Update Page Title
                    var pageTitle = "Basket - " + $scope.show_basket.hashtags.join(" ");
                    console.log("Set new page title: ", pageTitle);
                    $(document).attr('title', pageTitle);
                    console.log("Basket Found: ", $scope.show_basket);
                    $scope.show_gridster  = $(".gridster ul").gridster({
                                                widget_margins: [3, 3],
                                                widget_base_dimensions: [100, 100],
                                                avoid_overlapped_widgets: true,
                                                max_cols: 6,
                                                min_rows: 6,
                                                max_rows: 5
                                            }).data("gridster").disable();
                    // Add Items
                    self.addItems();
                    // Check Share Option
                    if ($scope.share === true) {
                      $timeout(function() {
                          self.publishedShare();
                      },4000)
                    };
                    // Check & Show Vote Status
                    if ($scope.user) {
                        Votes.findByBasketAndUserId({ medley_id: $scope.show_basket._id, user: $scope.user._id }, function(vote) {
                            // If User Has Not Voted
                            if (vote.errors && vote.errors.code == 404 ) {
                                console.log("User has not voted");
                                $scope.vote = false;
                            // If User Has Voted
                            } else {
                                console.log("User has voted");
                                $scope.vote = vote;
                            };
                        });
                    };
                    // Update View Count
                    Medleys.updateViewCount({ medleyId: $stateParams.basketId }, function(b) {
                        console.log("View count updated for:", b);
                        $scope.show_basket.views = b.views;
                    }); 
            } else {
                // Basket Could Not Be Found
                $timeout(function(){ 
                    $scope.load_error = true;
                },1000);
            };
        }); // Medley.show({})
    };

    $scope.initializeShow();
    
}]);