angular.module('mean.system').controller('HomeController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'storage', '$state', '$stateParams', '$location', '$timeout', function ($scope, Global, Medleys, Retailers, Users, storage, $state, $stateParams, $location, $timeout) {

    // Initialization Methods At Bottom

    // Set Defaults
    $scope.global                   = Global;
    $scope.homeMedleys              = {};
    $scope.homeMedleys.most_voted   = {};
    $scope.homeMedleys.most_viewed  = {};
    $scope.homeMedleys.most_recent  = {};


    $scope.getMostVotedMedleys = function(cb){
        var self = this;
        Medleys.getMostVoted({}, function(medleys) {
            $scope.homeMedleys.most_voted.left_column  = [];
            $scope.homeMedleys.most_voted.right_column = [];
            for (var i=0;i<medleys.length;i++){
                // Set Medley Size
                angular.forEach(medleys[i].items, function(item) {
                    medleys[i] = self.sizeMedleySmall(medleys[i]);
                });
                if ((i+2)%2==0) {
                    $scope.homeMedleys.most_voted.left_column.push(medleys[i]);
                }
                else {
                    $scope.homeMedleys.most_voted.right_column.push(medleys[i]);
                };
            }; // for
            // Callback
            if(cb){cb()};
        }); // Medleys.getMostVoted
    };

    $scope.getMostViewedMedleys = function(cb){
        var self = this;
        Medleys.getMostViewed({}, function(medleys) {
            $scope.homeMedleys.most_viewed.left_column  = [];
            $scope.homeMedleys.most_viewed.right_column = [];
            for (var i=0;i<medleys.length;i++){
                // Set Medley Size
                angular.forEach(medleys[i].items, function(item) {
                    medleys[i] = self.sizeMedleySmall(medleys[i]);
                });
                if ((i+2)%2==0) {
                    $scope.homeMedleys.most_viewed.left_column.push(medleys[i]);
                }
                else {
                    $scope.homeMedleys.most_viewed.right_column.push(medleys[i]);
                };
            }; // for
            // Callback
            if(cb){cb()};
            console.log($scope.homeMedleys.most_viewed.left_column, $scope.homeMedleys.most_viewed.right_column)
        }); // Medleys.getMostViewed
    };

     // Medley Sizes
    $scope.sizeMedleySmall = function(medley, cb) {
      var rowHeightsObj = {};
      // Resize Items
      angular.forEach(medley.items, function(item){
          // Set Item Dimensions
          if (item.size_y == 1){ item.width  = 85  };
          if (item.size_y == 2){ item.width  = 175 };
          if (item.size_x == 1){ item.height = 85  };
          if (item.size_x == 2){ item.height = 175 };
          // Set Item Position
          if (item.row == 1 ){ item.top  = 5 };
          if (item.row >  1 ){ item.top  = (item.row * 90) + 5 - 90 };
          if (item.col == 1) { item.left = 5 };
          if (item.col >  1 ){ item.left = (item.col * 90) + 5 - 90 };
          // Keep Row Count for Container Height
          if(!rowHeightsObj[item.row]) { rowHeightsObj[item.row] = 0 };
          if( rowHeightsObj[item.row] < item.size_y ) { 
              rowHeightsObj[item.row] = item.size_y;
          };
      });
      // Resize Container
      $.each(rowHeightsObj, function(key, value) {
          previousRow = rowHeightsObj[key - 1]
          if (previousRow == 2) {
            rowHeightsObj[key] = 0
          }
      });
        // Iteate through objet and pull values
      rowHeightsTotal = 0
      $.each(rowHeightsObj, function(key, value) { 
          rowHeightsTotal = rowHeightsTotal + value 
      });
      medley.height = rowHeightsTotal * 90 + 8;
      return medley;
    };

    // Initialize
    $scope.initializeHome = function() {
        var self = this;
        this.getMostVotedMedleys(function(){
          self.getMostViewedMedleys(function(){
            // Callback
          });
        });
    };

    $scope.initializeHome();
    
}]);