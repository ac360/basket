// Modals Open Functionality - Here it is not bound and restricted by being in a Controller
angular.module('mean.system').factory('Modals', ['$http', '$rootScope', '$modal',
  function($http, $rootScope, $modal) {
    
    return {
        signIn: function() {
          	var modalInstance = $modal.open({
            		windowClass: 'signin-modal',
  		          templateUrl: 'views/modals/sign_in_modal.html',
            		controller:  function ($rootScope, $scope, $modalInstance, $timeout, $state, Users) {
              			$scope.signUp = function() {
                        if (this.email && this.password && this.username){
                            Users.signUpManual({ email: this.email, password: this.password, username: this.username }, function(response) {
                                if (response.error) {
                                    $scope.signUpError(response.error);
                                } else if (response.email) {
                                    $rootScope.loadCurrentUser();
                                    $modalInstance.close();
                                };
                            });
                        } else {
                            $scope.signUpError("Please Don't Leave Any Fields Blank"); 
                        };
                    };
                    $scope.signIn = function() {
                        if (this.email && this.password){
                            Users.signInManual({ email: this.email, password: this.password }, function(response) {
                                if (response.error) {
                                    $scope.signUpError(response.error);
                                } else if (response.email) {
                                    $rootScope.loadUser();
                                    $modalInstance.close();
                                };
                            });
                        } else {
                            $scope.signUpError("Please Don't Leave Any Fields Blank"); 
                        };
                    };
                    $scope.signUpError = function(error) {
                        $scope.signup_error = error;
                        $timeout(function(){
                            $scope.signup_error = false;
                        }, 8000)
                    };
                    $scope.goToTos = function() {
                      $state.go('tos')
                      $modalInstance.close();
                    };
                    $scope.close = function() {
              				$modalInstance.close();
              			};
              			$scope.$on('SignedInViaFacebook', function(e, user){
            				      modalInstance.close();
            				});
  				      }
		        });
        },
        publishedShare: function(medley) {
          	var modalInstance = $modal.open({
              	windowClass: 'published-share-modal',
    		        templateUrl: 'views/modals/published_share_modal.html',
              	controller:  function ($scope, $modalInstance, Global) {
              			$scope.medley = medley;
                    $scope.shareFacebook = function() {
                      FB.ui({
                        method:  'feed',
                        link:    'http://mdly.co/#!/m/'+$scope.medley.short_id,
                        caption: "This Medley is a collection of awesome, hand-picked products created by " + $scope.medley.user.name,
                        display: 'iframe',
                        picture: $scope.medley.items[0].images.medium,
                        name: 'Medley - ' + $scope.medley.hashtags.join(" ")
                      },  function(response){
                            console.log(response);
                            // Hide Modals?
                      });
                    };
              			$scope.close = function() {
              				$modalInstance.close();
              			};
    				    }
		        });
        },
        share: function(medley) {
            var modalInstance = $modal.open({
                windowClass: 'share-modal',
                templateUrl: 'views/modals/share_modal.html',
                controller:  function ($scope, $modalInstance, Global) {
                    $scope.medley = medley;
                    console.log(medley)
                    $scope.shareFacebook = function() {

                        FB.getLoginStatus(function(response) {
                            if (response.status === 'connected' || response.status === 'not_authorized') {
                                $scope.showShareDialog();
                            } else {
                                FB.login(function(response) {
                                    if (response.authResponse) {
                                        $scope.showShareDialog();
                                    } else {
                                        console.log('User cancelled login or did not fully authorize.');
                                    }
                                });
                            } // if statement
                        }); // FB.getLoginStatus

                    }; // shareFacebook
                    $scope.showShareDialog = function() {
                        FB.ui({
                            method:  'feed',
                            link:    'http://mdly.co/#!/m/'+$scope.medley.short_id,
                            caption: "This Medley is a collection of awesome, hand-picked products created by " + $scope.medley.user.name,
                            display: 'iframe',
                            picture: $scope.medley.items[0].images.medium,
                            name:    'Medley - ' + $scope.medley.hashtags.join(" ")
                        },  function(response) {
                              console.log(response);
                        });
                    };
                    $scope.close = function() {
                      $modalInstance.close();
                    };
                }
            });
        },
        contact: function(medley) {
            var modalInstance = $modal.open({
                windowClass: 'contact-modal',
                templateUrl: 'views/modals/contact_modal.html',
                controller:  function ($scope, $modalInstance) {
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
          		controller:  function ($scope, $modalInstance, $timeout) {
            			$scope.product = product;
            			// $('.container').addClass('st-blur');
            			$scope.close = function() {
            				$modalInstance.close();
            			};
				      }
		      });
        },
        account: function() {
          var modalInstance = $modal.open({
              windowClass: 'account-modal',
              templateUrl: 'views/modals/account_modal.html',
              controller:  function ($scope, $modalInstance, $timeout, Users) {
                  $scope.success      = false;
                  $scope.descriptionA = true;
                  $scope.updateUser   = function() {
                      if ($scope.user.current_password) {
                          $rootScope.updateUser($scope.user, function(user){
                              if ( user.error ) { 
                                  return $scope.updateError(user.error) 
                              };
                              $scope.success     = true;
                              $timeout(function() {
                                  $scope.success = false;
                              }, 3000);
                          });
                      } else {
                          return $scope.updateError("Please Enter Your Current Password To Update Your Account"); 
                      };
                  };
                  $scope.updateError = function(error) {
                        $scope.update_error = error;
                        $timeout(function(){
                            $scope.update_error = false;
                        }, 6000)
                  };
                  $scope.close = function() {
                    $modalInstance.close();
                  };
              }
          });
        },
        folder: function(product) {
          var modalInstance = $modal.open({
              windowClass: 'folder-modal',
              templateUrl: 'views/modals/folder_modal.html',
              controller:  function ($scope, $modalInstance, $timeout) {
                    $scope.createNewFolder = function() {
                        var title = $('#folder-input').val().substring(0, 25);
                        $rootScope.createNewFolder(title, function(err, folder){
                            if (err) {return console.log(err) }
                            console.log("Folder Created: ", folder);
                        });
                    };
                    $scope.close = function() {
                        $modalInstance.close();
                    };
                    // Listener - Folders Updated
                    $scope.$on('FoldersUpdated', function(e, folder){
                        $modalInstance.close();
                    });
              }
          });
        },
        hashtag: function(product) {
        	var modalInstance = $modal.open({
          		windowClass: 'hashtag-modal',
		          templateUrl: 'views/modals/hashtag_modal.html',
          		controller:  function ($scope, $modalInstance, $timeout, $state) {
              			// Defaults	
              			$scope.hashtag_error = false;
                    $scope.hashtags;
          					// Methods
          					$scope.validateAndPublish = function()  {
          				        // Save to array of hashtags
          				        var words = $('#hashtags-input').text();
                          if (words.length > 140) { words = words.substring(0, 140) };
          				        var tagslistarr = words.split(' ');
          				        var hashtags=[];
          				        angular.forEach(tagslistarr, function(hashtag,val) {
          				            if(hashtag.indexOf('#') == 0){
          				              hashtags.push(hashtag);  
          				            };
          				        });
          				        if (hashtags.length > 0) {
                            $rootScope.basket.hashtags = hashtags;
              							$rootScope.publishMedley();
          				        } else {
          				            $scope.hashtag_error = 'Please enter at least one hashtag';
          				            $timeout(function() {
          				              $scope.hashtag_error = false;
          				            }, 5000);
          				        } // if statement
          					}; // validateAndPublish  
                    $scope.checkLimit = function(e) {
                        if(e.which !== 8 && $('#hashtags-input').text().length > 140) {
                             e.preventDefault();
                        };
                    };
              			$scope.close = function() {
              				  $modalInstance.close();
              			};

              			// Listener - Medley Published
              			$rootScope.$on('MedleyPublished', function(e, medley) {
                				$modalInstance.close();
      						      $('#create-stage ul').html('');
      			            $state.go('show', { basketId: medley.short_id });
      			        });
				      }
		    });
      }
    }; // return
  }
]);