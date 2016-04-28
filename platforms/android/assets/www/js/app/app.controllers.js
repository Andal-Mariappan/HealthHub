angular.module('your_app_name.app.controllers', [])


.controller('AppCtrl', function($scope, AuthService, OpenFB) {

    //this will represent our logged user
    // var user = {
    //     about: "Design Lead of Project Fi. Love adventures, green tea, and the color pink.",
    //     name: "Brynn Evans",
    //     picture: "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg",
    //     _id: 0,
    //     followers: 345,
    //     following: 58
    // };

    OpenFB.get('/me?fields=id,name,email,birthday,picture').success(function(user) {
        user.picture = user.picture.data.url;
        user._id = user.id;
        AuthService.saveUser(user);
        $scope.loggedUser = user;
    });

    //save our logged user on the localStorage

})


.controller('ProfileCtrl', function($scope, $stateParams, PostService, $ionicHistory, $state, $ionicScrollDelegate) {

    $scope.$on('$ionicView.afterEnter', function() {
        $ionicScrollDelegate.$getByHandle('profile-scroll').resize();
    });

    var userId = $stateParams.userId;

    $scope.myProfile = $scope.loggedUser._id == userId;
    $scope.posts = [];
    $scope.likes = [];
    $scope.user = {};

    PostService.getUserPosts(userId).then(function(data) {
        $scope.posts = data;
    });

    // PostService.getUserDetails(userId).then(function(data) {
    //     $scope.user = data;
    // });

    PostService.getUserLikes(userId).then(function(data) {
        $scope.likes = data;
    });

    $scope.getUserLikes = function(userId) {
        //we need to do this in order to prevent the back to change
        $ionicHistory.currentView($ionicHistory.backView());
        $ionicHistory.nextViewOptions({ disableAnimate: true });

        $state.go('app.profile.likes', { userId: userId });
    };

    $scope.getUserPosts = function(userId) {
        //we need to do this in order to prevent the back to change
        $ionicHistory.currentView($ionicHistory.backView());
        $ionicHistory.nextViewOptions({ disableAnimate: true });

        $state.go('app.profile.posts', { userId: userId });
    };

})


.controller('PostDetailCtrl', function($scope, $stateParams, PostService, $ionicPopup, $ionicLoading) {
    var postId = $stateParams.postId;
    console.log(postId);
    PostService.getPost(postId).then(function(post) {
        $scope.post = post;
    });

})

.controller('ProductCtrl', function($scope, $stateParams, ShopService, $ionicPopup, $ionicLoading) {
    var productId = $stateParams.productId;

    ShopService.getProduct(productId).then(function(product) {
        $scope.product = product;
    });

    $scope.var = 1;
    $scope.click = function(num) {
        $scope.var = num;
    }

    // show add to cart popup on button click
    $scope.showAddToCartPopup = function(product, product_price) {
        $scope.data = {};
        $scope.data.product = product;
        $scope.data.product_price = product_price;
        $scope.data.productOption = 1;
        $scope.data.productQuantity = 1;

        var myPopup = $ionicPopup.show({
            cssClass: 'add-to-cart-popup',
            templateUrl: 'views/app/shop/partials/add-to-cart-popup.html',
            title: 'Confirm Order',
            scope: $scope,
            buttons: [
                { text: '', type: 'close-popup ion-ios-close-outline' }, {
                    text: 'Confirm',
                    onTap: function(e) {
                        return $scope.data;
                    }
                }
            ]
        })
        myPopup.then(function(res) {
            if (res) {
                $ionicLoading.show({ template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">Loading</p>', duration: 1000 });
                res.product.price = res.product_price;
                ShopService.addProductToCart(res.product);
                console.log('Item added to cart!', res);
            } else {
                console.log('Popup closed');
            }
        });
    };



    // show add to rating on button click
    $scope.showAddRate = function(product) {
        $scope.data = {};
        $scope.data.product = product;
        $scope.data.productOption = 1;
        $scope.data.productQuantity = 1;

        var myPopup = $ionicPopup.show({
            cssClass: 'add-to-cart-popup',
            templateUrl: 'views/app/shop/partials/add-rating.html',
            title: 'Write a Review',
            scope: $scope,
            buttons: [
                { text: '', type: 'close-popup ion-ios-close-outline' }, {
                    text: 'Send',
                    onTap: function(e) {
                        return $scope.data;
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            if (res) {
                // $ionicLoading.show({ template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">Sending</p>', duration: 1000 });
                // ShopService.addProductToCart(res.product);
                // console.log('Item added to cart!', res);
            } else {
                // console.log('Popup closed');
            }
        });
    };

})


.controller('FeedCtrl', function($scope, PostService, OpenFB, AuthService) {
    $scope.posts = [];
    $scope.page = 1;
    $scope.totalPages = 1;
    $scope.chat2 = "gdfgdfg";

    $scope.loadFeed = function() {

        PostService.getFeedHostpital($scope.page)
            .then(function(data) {
                //We will update this value in every request because new posts can be created
                $scope.totalPages = data.totalPages;
                $scope.posts = $scope.posts.concat(data.posts);

                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    }

    $scope.doRefresh = function() {
        PostService.getFeedHostpital(1)
            .then(function(data) {
                $scope.totalPages = data.totalPages;
                $scope.posts = data.posts;

                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.getNewData = function() {
        //do something to load your new data here
        $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.sendMessage = function() {
        $scope.chat2 = null;
        console.log('tttt');
    };

    $scope.sendLike = function(obj) {

        PostService.sendLike(obj.id);
        $scope._likes = obj.id;
        PostService.getUserLikes(obj.id)
            .then(function(data) {
                obj.likes = data;
            });
        //$scope.doRefresh();
    }

    $scope.isLiked = function(likes) {
        var _user = AuthService.getLoggedUser();
        var like = _.filter(likes, function(like) {
            return like.name == _user.name;
        });
        //return like.length > 0;
        if (like.length > 0) {
            return true;
        }
        return false;
    }

    $scope.loadMoreData = function() {
        $scope.page += 1;

        PostService.getFeedHostpital($scope.page)
            .then(function(data) {
                //We will update this value in every request because new posts can be created
                $scope.totalPages = data.totalPages;
                $scope.posts = $scope.posts.concat(data.posts);

                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.moreDataCanBeLoaded = function() {
        return $scope.totalPages > $scope.page;
    };

    $scope.doRefresh();



})


.controller('ShopCtrl', function($scope, ShopService) {
    $scope.products = [];
    $scope.popular_products = [];

    ShopService.getProducts().then(function(products) {
        $scope.products = products;
    });



    ShopService.getProducts().then(function(products) {
        $scope.show_products = products;

    });
    ShopService.getHospital().then(function(hospital) {
        $scope.hospital = hospital;

    });

})


.controller('ShoppingCartCtrl', function($scope, ShopService, $stateParams, $ionicActionSheet, _) {
    $scope.products = ShopService.getCartProducts();
    $scope.product_appointment = ShopService.getProductsAppointMent($stateParams.product_appointment).then(function(product) {
        $scope.product = product;
    });


    $scope.removeProductFromCart = function(product) {
        $ionicActionSheet.show({
            destructiveText: 'Remove from cart',
            cancelText: 'Cancel',
            cancel: function() {
                return true;
            },
            destructiveButtonClicked: function() {
                ShopService.removeProductFromCart(product);
                $scope.products = ShopService.getCartProducts();
                return true;
            }
        });
    };

    $scope.getSubtotal = function() {
        return _.reduce($scope.products, function(memo, product) {

            return memo + product.price;
        }, 0);
    };
    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.range = function(count) {

        var ratings = [];

        for (var i = 0; i < count; i++) {
            ratings.push(i)
        }

        return ratings;
    }
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };

})


.controller('CheckoutCtrl', function($scope) {
    //$scope.paymentDetails;
})

.controller('SettingsCtrl', function($scope, $ionicModal, OpenFB, $state) {

    $scope.signOut = function() {

        OpenFB.revokePermissions().then(
            function() {
                $state.go('facebook-sign-in');
            },
            function() {
                alert('OpenFB : Revoke Permissions Failed!ppppp');
            });

    }

    $ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.terms_of_service_modal = modal;
    });

    $ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.privacy_policy_modal = modal;
    });


    $scope.showTerms = function() {
        $scope.terms_of_service_modal.show();
    };

    $scope.showPrivacyPolicy = function() {
        $scope.privacy_policy_modal.show();
    };


});
