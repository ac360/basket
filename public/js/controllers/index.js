angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Issues', 'Cities', function ($scope, Global, Issues, Cities) {
    // Set Defaults
    $scope.global = Global;
    $scope.cityMode = false;
    $scope.showAutocomplete = false;

    $scope.newIssue = function() {
        $('#issueModal').modal('toggle');
    };

    $scope.createIssue = function() {
    	console.log(this.title, this.description);
    	if (this.title == undefined || this.description == undefined || this.title.length == 0 || this.description.length == 0 || this.city.length == 0 ) {
    		alert("Empty fields!");
    		return false;
    	};
     //    var issue = new Issues({
	    //     title:       this.title,
	    //     description: this.description
	    // });
	    // issue.$save(function(response) {
	    //     console.log(response);
	    // });
    };

    $scope.autocompleteCity = function() {
        if (!$scope.query == '') {
            Cities.query({query: $scope.query}, function(cities, err) {
                if (cities && cities.length > 0) {
                    $scope.cities = cities;
                    console.log($scope.cities);
                    $scope.showAutocomplete = true;
                } else {
                    $scope.showAutocomplete = false;
                };
            });
        } else {
            $scope.showAutocomplete = false;
        };
    };

    $scope.hideAutocompletePopover = function() {
        if ($('.popover').hasClass('in')){
            setTimeout(function(){
                $('#town-search-field').popover('hide');
            },300);
        };
        console.log("burleD!");
    };

    $scope.selectCity = function(city) {
        $scope.city = city;
        $scope.cityMode = true;
        $('#town-search-field').val(city.name + ', ' + city.admin1_code);
        this.getIssues($scope.city);
        $scope.showAutocomplete = false;
    };

    $scope.getIssues = function(city) {
        Issues.query({city: city.name, admin1: city.admin1_code }, function(issues, err) {
            $scope.issues = issues;
            console.log("Issues: ", issues);
        })
    };

}]);