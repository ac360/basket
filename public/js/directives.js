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

// Directive - Contact Modal
app.directive("contactLink", function() {  
    return {
        restrict: "A",
        replace: true,
        controller: function($scope, $element, $attrs, $rootScope, Modals){
            $element.click(function() {
                Modals.contact();
            })
        }
    };
});

// Directive - Delete Medley
app.directive("deleteMedley", function() {  
    return {
        restrict: "A",
        replace: true,
        controller: function($scope, $element, $attrs, $rootScope, Modals){
            $element.click(function() {
                var c = confirm("Are you sure you want to delete this medley?  It can never be recovered...");
                if (c) {
                    $rootScope.deleteMedley($attrs.deleteMedley);
                };
            })
        }
    };
});

// Directive - Load Account Popup
app.directive("accountPopup", function() {  
    return {
        restrict: "A",
        replace: true,
        controller: function($scope, $element, $attrs, $rootScope, Modals){
            $element.click(function() {
                if ( $rootScope.user ) {
                    Modals.account();
                } else {
                    Modals.signIn();
                };
            })
        }
    };
});

// Directive - Share Link
app.directive("shareLink", function() {  
    return {
        restrict: "A",
        replace: true,
        controller: function($scope, $element, $attrs, $rootScope, Modals, Medleys){
            $element.click(function() {
                console.log("hello")
                Modals.share($attrs.shareLink);
            })
        }
    };
});

// Directive - Share Facebook Link
app.directive("shareFacebookLink", function() {  
    return {
        restrict: "A",
        replace: true,
        controller: function($scope, $element, $attrs, $rootScope, Modals, Medleys){
            $element.click(function() {
                Global.shareFacebook($attrs.shareFacebookLink);
            })
        }
    };
});

// Directive - Facebook Sign In
app.directive("signInLink", function() {  
    return {
        restrict: "A",
        replace: true,
        controller: function($scope, $element, $attrs, $rootScope, Users, Modals){
            $element.click(function() {
                console.log("clicked!");
                // Check if user is logged in
                Modals.signIn();
            }) // element.click()
        } // controller
    }; //return
});

// Directive - Vote Medley
app.directive("voteLink", function() {  
    return {
        restrict: "A",
        replace: true,
        controller: function($scope, $element, $attrs, $rootScope, Users, Modals) {
            $element.click(function() {
                if ( $rootScope.user ) {
                    $rootScope.voteMedley($attrs.voteLink, function(medley) {
                        $rootScope.getMedleyVoteStatus(medley._id, function(vote) {
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

// Directive - Drag And Drop
app.directive("uiDraggable", [
        '$parse',
        '$rootScope',
        function ($parse, $rootScope) {
            return function (scope, element, attrs) {
                if (window.jQuery && !window.jQuery.event.props.dataTransfer) {
                    window.jQuery.event.props.push('dataTransfer');
                }
                element.attr("draggable", false);
                attrs.$observe("uiDraggable", function (newValue) {
                    element.attr("draggable", newValue);
                });
                var dragData = "";
                scope.$watch(attrs.drag, function (newValue) {
                    dragData = newValue;
                });
                element.bind("dragstart", function (e) {
                    var sendData = angular.toJson(dragData);
                    var sendChannel = attrs.dragChannel || "defaultchannel";
                    e.dataTransfer.setData("Text", sendData);
                    $rootScope.$broadcast("ANGULAR_DRAG_START", sendChannel);

                });

                //For IE
                element.bind("selectstart",function() {
                    this.dragDrop();
                    return false;
                }, false);

                element.bind("dragend", function (e) {
                    var sendChannel = attrs.dragChannel || "defaultchannel";
                    $rootScope.$broadcast("ANGULAR_DRAG_END", sendChannel);
                    if (e.dataTransfer.dropEffect !== "none") {
                        if (attrs.onDropSuccess) {
                            var fn = $parse(attrs.onDropSuccess);
                            scope.$apply(function () {
                                fn(scope, {$event: e});
                            });
                        }
                    }
                });


            };
        }
    ])
    .directive("uiOnDrop", [
        '$parse',
        '$rootScope',
        function ($parse, $rootScope) {
            return function (scope, element, attr) {
                var dropChannel = "defaultchannel";
                var dragChannel = "";
                var dragEnterClass = attr.dragEnterClass || "on-drag-enter";

                function onDragOver(e) {

                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }

                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                    e.dataTransfer.dropEffect = 'move';
                    return false;
                }

                function onDrop(e) {
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }
                    if (e.stopPropagation) {
                        e.stopPropagation(); // Necessary. Allows us to drop.
                    }
                    var data = e.dataTransfer.getData("Text");
                    data = angular.fromJson(data);
                    var fn = $parse(attr.uiOnDrop);
                    scope.$apply(function () {
                        fn(scope, {$data: data, $event: e});
                    });
                    element.removeClass(dragEnterClass);
                }


                $rootScope.$on("ANGULAR_DRAG_START", function (event, channel) {
                    dragChannel = channel;
                    if (dropChannel === channel) {

                        element.bind("dragover", onDragOver);

                        element.bind("drop", onDrop);
                        element.addClass(dragEnterClass);
                    }

                });



                $rootScope.$on("ANGULAR_DRAG_END", function (e, channel) {
                    dragChannel = "";
                    if (dropChannel === channel) {

                        element.unbind("dragover", onDragOver);

                        element.unbind("drop", onDrop);
                        element.removeClass(dragEnterClass);
                    }
                });


                attr.$observe('dropChannel', function (value) {
                    if (value) {
                        dropChannel = value;
                    }
                });


            };
        }
]);

// Directive - Drop Over Event
app.directive('dropTarget', function(){
    return function($scope, $element){
      $element.bind('dragover', function(){
            $element.addClass('droppable');
      });
      $element.bind('dragleave', function(){
            $element.removeClass('droppable');
      });
      $element.bind('drop', function(){
            $element.removeClass('droppable');
      });
    };
})
