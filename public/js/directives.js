// Custom ng-blur directive for Input Blurs
app.directive('ngBlur', function() {
  return function( scope, elem, attrs ) {
    elem.bind('blur', function() {
      scope.$apply(attrs.ngBlur);
    });
  };
});
// Dynamic HTML Directive for Elements Containing Dynamic HTML
app.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
});
// Load Product Window
app.directive("medleyItem", function() {  
    return {
        restrict: "A",
        replace: true,
        controller: function($scope, $element, $attrs, $rootScope){
            $element.click(function() {
                console.log("clicked!", $attrs, $scope);
                $rootScope.$broadcast('openProductModal', $scope.item);
            })
        }
    };
});

