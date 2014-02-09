// Add ng-app to the Document
window.bootstrap = function() {
    angular.bootstrap(document, ['mean']);
};

window.init = function() {
    window.bootstrap();
};

$(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash == '#_=_') {
      window.location = '/#!';
    }

    //Then init the app
    window.init();
});