window.app = angular.module('mean', ['ngCookies', 'ngResource', 'ngAnimate', 'ngAnimate-animate.css', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.issues', 'mean.users', 'mean.votes', 'angularLocalStorage']);

angular.module('mean.system', []);
angular.module('mean.issues', []);
angular.module('mean.users',  []);
angular.module('mean.votes',  []);
