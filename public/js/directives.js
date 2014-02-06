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

// Directive - Load Product Window
app.directive("medleyItem", function() {  
    return {
        restrict: "A",
        replace: true,
        controller: function($scope, $element, $attrs, $rootScope, Modals){
            $element.click(function() {
                Modals.product($scope.item);
            })
        }
    };
});

// Directive - Share Facebook Link
app.directive("shareFacebookLink", function() {  
    return {
        restrict: "A",
        replace: true,
        controller: function($scope, $element, $attrs, $rootScope, Global, Modals, Medleys){
            $element.click(function() {
                Global.shareFacebook($attrs.shareFacebookLink);
            })
        }
    };
});

// Directive - Facebook Sign In
app.directive("facebookSignInLink", function() {  
    return {
        restrict: "A",
        replace: true,
        controller: function($scope, $element, $attrs, $rootScope, Global, Users){
            $element.click(function() {
                // Check if user is logged in
                Global.authenticateUser();
            }) // element.click()
        } // controller
    }; //return
});

// Directive - Vote Medley
app.directive("voteLink", function() {  
    return {
        restrict: "A",
        replace: true,
        controller: function($scope, $element, $attrs, $rootScope, Global, Users) {
            $element.click(function() {
                if ( Global.getCurrentUser() ) {
                    Global.voteMedley($attrs.voteLink, function(medley) {
                        Global.getMedleyVoteStatus(medley._id, function(vote) {
                            console.log(vote)
                            // If User Has Voted
                            if (vote) {
                                $( '.' + medley.short_id ).find( "i" ).removeClass('fa-heart-o').addClass('fa-heart');
                            // If User Has Not Voted
                            } else {
                                $( '.' + medley.short_id ).find( "i" ).removeClass('fa-heart').addClass('fa-heart-o');
                            };
                        });
                    });
                } else {
                    Modals.signIn();
                };
            }) // element.click()
        } // controller
    }; //return
});
