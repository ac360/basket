window.app = angular.module('mean', ['ngCookies', 'ngResource', 'ngAnimate', 'ngAnimate-animate.css', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.medleys', 'mean.retailers', 'mean.users', 'mean.votes', 'angularLocalStorage']);

angular.module('mean.system',    []);
angular.module('mean.retailers', []);
angular.module('mean.medleys',   []);
angular.module('mean.users',     []);
angular.module('mean.votes',     []);

// app.run(function ($rootScope) {
// 	// Facebok Initialization
//     window.fbAsyncInit = function() {
//         FB.init({
//             appId      : facebookKey,
//             status     : true, // check login status
//             cookie     : true, // enable cookies to allow the server to access the session
//             xfbml      : true  // parse XFBML
//         });

//         FB.Event.subscribe('auth.statusChange', function(response) {
//             $rootScope.$broadcast("fb_statusChange", {'status': response.status});
//         });
//     };
//     // Load the SDK asynchronously
//     (function(d){
//         var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
//         if (d.getElementById(id)) {return;}
//         js = d.createElement('script'); js.id = id; js.async = true;
//         js.src = "//connect.facebook.net/en_US/all.js";
//         ref.parentNode.insertBefore(js, ref);
//     }(document));
// });
