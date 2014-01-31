window.app = angular.module('mean', ['ngCookies', 'ngResource', 'ngAnimate', 'ngAnimate-animate.css', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.medleys', 'mean.retailers', 'mean.users', 'mean.votes', 'angularLocalStorage']);

angular.module('mean.system', []);
angular.module('mean.retailers', []);
angular.module('mean.medleys', []);
angular.module('mean.users',  []);
angular.module('mean.votes',  []);


// Init

	// Initialize Facebook SDK
    window.fbAsyncInit = function() {
        // init the FB JS SDK for use
        FB.init({
          appId      : '736751053015158',                    // Dev: 252087231617494 Pro: 736751053015158
          status     : true,                                 // Check Facebook Login status
          xfbml      : true                                  // Look for social plugins on the page
        });
        // Additional initialization code such as adding Event Listeners goes here
      };

      // Load the SDK asynchronously
      (function(){
         // If we've already installed the SDK, we're done
         if (document.getElementById('facebook-jssdk')) {return;}

         // Get the first script element, which we'll use to find the parent node
         var firstScriptElement = document.getElementsByTagName('script')[0];

         // Create a new script element and set its id
         var facebookJS = document.createElement('script'); 
         facebookJS.id = 'facebook-jssdk';

         // Set the new script's source to the source of the Facebook JS SDK
         facebookJS.src = '//connect.facebook.net/en_US/all.js';

         // Insert the Facebook JS SDK into the DOM
         firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
    }());

