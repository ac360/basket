// Add ng-app to the Document
window.bootstrap = function() {
    angular.bootstrap(document, ['mean']);
};

window.init = function() {
    window.bootstrap();
};

// Set Facebook Key
var facebookKey = false;
var host = window.location.hostname;
if (~host.indexOf('mdly')) {
	facebookKey = '736751053015158';
} else {
	facebookKey = '252087231617494';
};

$(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash == '#_=_') {
      window.location = '/#!';
    }

    //Then init the app
    window.init();
});