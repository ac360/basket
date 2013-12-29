// Custom ng-blur directive for Input Blurs
app.directive('ngBlur', function() {
  return function( scope, elem, attrs ) {
    elem.bind('blur', function() {
      scope.$apply(attrs.ngBlur);
    });
  };
});

// Google Places AutoComplete
app.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: ['(cities)'],
                componentRestrictions: {}
            };
            // Default Scope to Root
            scope = scope.$parent;
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                	scope.loadTown();
                    model.$setViewValue(element.val());               
                });
            });
        }
    };
});