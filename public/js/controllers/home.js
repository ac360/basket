angular.module('mean.system').controller('HomeController', ['$scope', 'Global', 'Medleys', 'Retailers', 'Users', 'storage', '$state', '$stateParams', '$location', '$timeout', function ($scope, Global, Medleys, Retailers, Users, storage, $state, $stateParams, $location, $timeout) {

    // Initialization Methods At Bottom

    // Set Defaults
    $scope.global                   = Global;
    $scope.homeMedleys              = {};
    $scope.homeMedleys.most_voted   = {};
    $scope.homeMedleys.most_viewed  = [];
    $scope.homeMedleys.most_recent  = [];


    $scope.getMostVotedMedleys = function(cb){
        var self = this;
        Medleys.getMostVoted({}, function(b) {
          // Split Medleys into two arrays
          self.prepareMedleys(b);
          // console.log("Most Voted Medleys", $scope.homeMedleys.most_voted);
          // Add Items
          // var homeMedley = 1;
          // Old method of jquery dynamic html injection
          // angular.forEach($scope.homeMedleys.most_voted, function(medley, index){
          //       console.log(medley);
          //       // Instantiate Gridster
          //       var elem = ".vote-medley"+homeMedley;
          //       angular.forEach(medley.items, function(item) {
          //           var iCSS = self.sizeMedleyItemsSmall(item, function(iCSS){
          //             var itemHtml = "<div class='' style='position:absolute;width:"+iCSS.width+"px;height:"+iCSS.height+"px;top:"+iCSS.top+"px;left:"+iCSS.left+"px;display:block; text-align: center; background:#ffffff; text-align:center; -webkit-border-radius: 6px; border-radius: 6px; -webkit-box-shadow: 0 2px 0 0 rgba(0,0,0,0.1); box-shadow: 0 2px 0 0 rgba(0,0,0,0.1);' data-itemid='" + item.retailer_id + "'></div>"
          //             $(elem).append(itemHtml);
          //           });
          //       });
          //       homeMedley = homeMedley + 1;
          // });
          //Callback
          if(cb){cb()};
        });
    };

    $scope.prepareMedleys = function(medleys) {
        var self = this;
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
        }
        console.log($scope.homeMedleys.most_voted.right_column, $scope.homeMedleys.most_voted.left_column);
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
      // ITERATE THROUGH OBJECT AN PULL VALUES!
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
          // get most viewed...
        });
    };

    $scope.initializeHome();
    
}]);