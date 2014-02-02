// Modals Open Functionality - Here it is not bound and restricted by being in a Controller
angular.module('mean.system').factory('Modals', ['$http', '$rootScope', '$modal',
  function($http, $rootScope, $modal) {
    
    return {
        signIn: function() {
          	var modalInstance = $modal.open({
          		windowClass: 'signin-modal',
		        templateUrl: 'views/modals/sign_in_modal.html',
          		controller:  function ($scope, $modalInstance, Global) {
          			$scope.close = function() {
          				$modalInstance.close();
          			};
          			$scope.$on('SignedInViaFacebook', function(e, user){
					    $modalInstance.close();
					});
				}
		    });
        },
        publishedShare: function(medleyId) {
          	var modalInstance = $modal.open({
          		windowClass: 'published-share-modal',
		        templateUrl: 'views/modals/published_share_modal.html',
          		controller:  function ($scope, $modalInstance, Global) {
          			$scope.medleyId = medleyId
          			$scope.close = function() {
          				$modalInstance.close();
          			};
				}
		    });
        },
        product: function(product) {
        	var modalInstance = $modal.open({
          		windowClass: 'product-modal',
		        templateUrl: 'views/modals/product_modal.html',
          		controller:  function ($scope, $modalInstance, $timeout, Global) {
          			$scope.product = product;
          			console.log(product)
          			// $('.container').addClass('st-blur');
          			$scope.close = function() {
          				$modalInstance.close();
          			};
				}
		    });
        },
        hashtag: function(product) {
        	var modalInstance = $modal.open({
          		windowClass: 'hashtag-modal',
		        templateUrl: 'views/modals/hashtag_modal.html',
          		controller:  function ($scope, $modalInstance, $timeout, $state, Global) {
          			// Defaults	
          			$scope.hashtag_error = false;
					// Methods
					$scope.validateAndPublish = function()  {
				        // Save to array of hashtags
				        var words = $('#hashtags-input').text();
				        var tagslistarr = words.split(' ');
				        var hashtags=[];
				        angular.forEach(tagslistarr, function(hashtag,val) {
				            if(hashtag.indexOf('#') == 0){
				              hashtags.push(hashtag);  
				            }
				        });
				        if (hashtags.length > 0) {
				        	console.log("hashtags present setting prop")
				        	Global.setMedleyProperty("hashtags", hashtags, function(medley){
								Global.publishMedley();
							});
				        } else {
				           $scope.hashtag_error = 'Please enter at least one hashtag';
				           $timeout(function(){
				              $scope.hashtag_error = false;
				           }, 5000);
				        } // if statement
					}; // validateAndPublish  

          			$scope.close = function() {
          				$modalInstance.close();
          			};

          			// Listener - Medley Published
          			$scope.$on('MedleyPublished', function(e, medley) {
          				$modalInstance.close();
						$('#create-stage ul').html('');
			            $state.go('show', { basketId: medley.short_id });
			            $scope.share = true;
			        });
				}
		    });
        }
    }; // return
  }
]);