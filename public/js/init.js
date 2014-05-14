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

// Set ShopStyle Key
var shopstyleKey = 'uid6289-24982767-15';

$(document).ready(function() {
    
    // Facebok Initialization
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId="+facebookKey;
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    //Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash == '#_=_') {
      window.location = '/#!';
    };

    //Then init the app
    window.init();

});