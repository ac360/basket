angular.module('mean.system').controller('CreateController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'storage', '$state', '$stateParams', '$location', '$timeout', 'Modals', function ($scope, Global, Medleys, Retailers, Users, storage, $state, $stateParams, $location, $timeout, Modals) {

    // Initialization Methods At Bottom

    // Set Defaults
    $scope.global           = Global;
    $scope.hashtag_error    = false;

    $scope.resizeItem = function($event) {
      var hashkey = $($event.currentTarget).data('hashkey');
      angular.forEach($scope.basket.items, function(bItem, bIndex){
        // Find matching basket item
        if (bItem.$$hashKey == hashkey) {
            // Detect size and change
            if (bItem.sizex == 2) {
              bItem.sizex = 1;
              $scope.gridster.resize_widget($($event.currentTarget), 1, 1);
              $($event.currentTarget).removeClass('basket-item-large');
            } else {
              bItem.sizex = 2;
              $scope.gridster.resize_widget($($event.currentTarget), 2, 2);
              $($event.currentTarget).addClass('basket-item-large');
            };
        };
      });
      this.updateBasketFromGrid();
    };

    $scope.removeBasketItem = function($event) {
        var self = this;
        var r = confirm("Are you sure you want to remove this item?");
        if  (r == true) {
            var hashkey = $($event.currentTarget.parentElement).data('hashkey');
            angular.forEach($scope.basket.items, function(bItem, bIndex){
              // Find matching basket item and delete it from basket
              if (bItem.$$hashKey == hashkey) {
                $scope.basket.items.splice(bIndex, 1);
                $scope.gridster.remove_widget( $($event.currentTarget.parentElement), function(){
                    self.updateBasketFromGrid();
                });
              };
            });   
        };
    };

    $scope.updateBasketFromGrid = function(){
      // Serialize Grid to get new data
      var serialized = $scope.gridster.serialize();
      // Save Data to Basket
      angular.forEach(serialized, function(sItem, sIndex){
          angular.forEach($scope.basket.items, function(bItem, bIndex){
              if (bItem.$$hashKey === sItem.$$hashKey) {
                  bItem.col    = sItem.col;
                  bItem.row    = sItem.row;
                  bItem.size_x = sItem.size_x;
                  bItem.size_y = sItem.size_y;
                  $scope.basket.items.splice(bIndex, 1);
                  $scope.basket.items.push(bItem);
              };
          });
          // console.log("Serialized Data:", serialized);
          // console.log("Updated Basket:", $scope.basket);
      });
      Global.setMedleyProperty("items", $scope.basket.items, function(medley) {
        $scope.basket = medley;
        console.log("From Global: ", $scope.basket)
      });
    };

    $scope.changeTemplate = function(template) {
      Global.setMedleyProperty("template", template, function(medley) {
        $scope.basket = medley;
        console.log("From Global: ", $scope.basket)
      });
      $('body').removeClass().addClass(template);
    };

    $scope.showPublishModal = function(){
        if (Global.getCurrentUser()) {
            Modals.hashtag()
        } else {
            Modals.signIn();
        };
    };

    // Initialize

    $scope.initializeCreate = function() {
        var self = this;
        // Init Gridster
        $scope.gridster =   $(".gridster ul").gridster({
                                  widget_margins: [3, 3],
                                  widget_base_dimensions: [100, 100],
                                  avoid_overlapped_widgets: true,
                                  max_cols: 6,
                                  min_rows: 6,
                                  max_rows: 5,
                                  draggable: {
                                      stop: function(event, ui){ 
                                        self.updateBasketFromGrid(event, ui);
                                      }
                                  },
                                  serialize_params: function($w, wgd) { 
                                      return { 
                                             $$hashKey: $($w).attr('data-hashkey'), 
                                             col: wgd.col, 
                                             row: wgd.row, 
                                             size_x: wgd.size_x, 
                                             size_y: wgd.size_y 
                                      };
                                  }
                            }).data("gridster");
        // Add Scope Items
        angular.forEach($scope.basket.items, function(item, index){
          var html = '<li class="medley-item" ng-dblClick="resizeItem($event)" data-hashkey="'+item.$$hashKey+'"><i class="fa fa-times pull-right" ng-click="removeBasketItem($event)"></i><img src="'+item.images.large+'"></li>';
          $scope.gridster.add_widget( html, item.size_x, item.size_y, item.col, item.row );
        });
        // Save Positions Immediately
        $timeout(function(){ 
            $scope.updateBasketFromGrid();
        },1000);

    }; // Init create

    $scope.initializeCreate();
    
}]);