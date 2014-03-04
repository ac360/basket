window.app = angular.module('mean', ['ngCookies', 'ngResource', 'ngAnimate', 'ngAnimate-animate.css', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.medleys', 'mean.retailers', 'mean.users', 'mean.votes', 'angularLocalStorage']);

angular.module('mean.system',    []);
angular.module('mean.retailers', []);
angular.module('mean.medleys',   []);
angular.module('mean.users',     []);
angular.module('mean.votes',     []);

app.run(function ($rootScope) {
	// Facebok Initialization
    (function(d, s, id) {
  		var js, fjs = d.getElementsByTagName(s)[0];
  		if (d.getElementById(id)) return;
  		js = d.createElement(s); js.id = id;
  		js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId="+facebookKey;
  		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
});
