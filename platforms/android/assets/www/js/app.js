angular.module('underscore', [])
    .factory('_', function() {
        return window._; // assumes underscore has already been loaded on the page
    });

angular.module('your_app_name', [
    'ionic',
    'your_app_name.common.directives',
    'your_app_name.app.controllers',
    'your_app_name.auth.controllers',
    'your_app_name.app.services',
    // 'your_app_name.views',
    'underscore',
    'angularMoment',
    'ngIOS9UIWebViewPatch',
    'openfb'
])


// Enable native scrolls for Android platform only,
// as you see, we're disabling jsScrolling to achieve this.
.config(function($ionicConfigProvider) {
    if (ionic.Platform.isAndroid()) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
    }
})

.run(function($ionicPlatform, $rootScope, $ionicHistory, $state, $window, OpenFB) {

    OpenFB.init('1016249008445839', 'http://localhost:8100/oauthcallback.html');

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState) {
        if (toState.name !== "facebook-sign-in" && toState.name !== "app.logout" && !$window.sessionStorage['fbtoken']) {
            $state.go('facebook-sign-in');
            event.preventDefault();
        }
    });

    $rootScope.$on('OAuthException', function() {
        $state.go('facebook-sign-in');
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider

    //SIDE MENU ROUTES
        .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "views/app/side-menu.html",
        controller: 'AppCtrl'
    })

    .state('app.feed', {
        url: "/feed",
        views: {
            'menuContent': {
                templateUrl: "views/app/feed.html",
                controller: "FeedCtrl"
            }
        }
    })

    .state('app.profile', {
        abstract: true,
        url: '/profile/:userId',
        views: {
            'menuContent': {
                templateUrl: "views/app/profile/profile.html",
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('app.profile.posts', {
        url: '/posts',
        views: {
            'profileContent': {
                templateUrl: 'views/app/profile/profile.posts.html'
            }
        }
    })

    .state('app.profile.likes', {
        url: '/likes',
        views: {
            'profileContent': {
                templateUrl: 'views/app/profile/profile.likes.html'
            }
        }
    })

    .state('app.settings', {
        url: "/settings",
        views: {
            'menuContent': {
                templateUrl: "views/app/profile/settings.html",
                controller: 'SettingsCtrl'
            }
        }
    })

    .state('app.shop', {
        url: "/shop",
        abstract: true,
        views: {
            'menuContent': {
                templateUrl: "views/app/shop/shop.html"
            }
        }
    })

    .state('app.shop.home', {
        url: "/",
        views: {
            'shop-home': {
                templateUrl: "views/app/shop/shop-home.html",
                controller: 'ShopCtrl'
            }
        }
    })

    .state('app.shop.popular', {
        url: "/popular",
        views: {
            'shop-popular': {
                templateUrl: "views/app/shop/shop-popular.html",
                controller: 'ShopCtrl'
            }
        }
    })

    .state('app.shop.sale', {
        url: "/sale",
        views: {
            'shop-sale': {
                templateUrl: "views/app/shop/shop-sale.html",
                controller: 'ShopCtrl'
            }
        }
    })

    .state('app.cart', {
        url: "/cart",
        views: {
            'menuContent': {
                templateUrl: "views/app/shop/cart.html",
                controller: 'ShoppingCartCtrl'
            }
        }
    })

    .state('app.radio-buttom-cart', {
        url: "/radio-buttom-cart",
        views: {
            'menuContent': {
                templateUrl: "views/app/shop/radio-buttom-cart.html",
                controller: 'ShoppingCartCtrl'
            }
        }
    })

    .state('app.shipping-address', {
        url: "/shipping-address",
        views: {
            'menuContent': {
                templateUrl: "views/app/shop/shipping-address.html",
                controller: "CheckoutCtrl"
            }
        }
    })

    .state('app.checkout', {
        url: "/checkout",
        views: {
            'menuContent': {
                templateUrl: "views/app/shop/checkout.html",
                controller: "CheckoutCtrl"
            }
        }
    })

    .state('app.product-detail', {
            url: "/product/:productId",
            views: {
                'menuContent': {
                    templateUrl: "views/app/shop/product-detail.html",
                    controller: 'ProductCtrl'
                }
            }
        })
        .state('app.shop.search', {
            url: "/search",
            views: {
                'shop-search': {
                    templateUrl: "views/app/shop/shop-search.html",
                    controller: 'ShopCtrl'
                }
            }
        })
        .state('app.postCardDetail', {
            url: "/postCardDetail/:postId",
            views: {
                'menuContent': {
                    templateUrl: "views/app/partials/post-card-detail.html",
                    controller: 'PostDetailCtrl'
                }
            }
        })


    //AUTH ROUTES
    .state('facebook-sign-in', {
        url: "/facebook-sign-in",
        templateUrl: "views/auth/facebook-sign-in.html",
        controller: 'WelcomeCtrl'
    })

    .state('dont-have-facebook', {
        url: "/dont-have-facebook",
        templateUrl: "views/auth/dont-have-facebook.html",
        controller: 'WelcomeCtrl'
    })

    .state('create-account', {
        url: "/create-account",
        templateUrl: "views/auth/create-account.html",
        controller: 'CreateAccountCtrl'
    })

    .state('welcome-back', {
        url: "/welcome-back",
        templateUrl: "views/auth/welcome-back.html",
        controller: 'WelcomeBackCtrl'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/facebook-sign-in');
    $ionicConfigProvider.tabs.position('bottom');
    // $urlRouterProvider.otherwise('/app/feed');

})

<<<<<<< HEAD
;
=======
;



angular.module('openfb', [])

.factory('OpenFB', function($rootScope, $q, $window, $http) {

    var FB_LOGIN_URL = 'https://www.facebook.com/dialog/oauth',

        // By default we store fbtoken in sessionStorage. This can be overriden in init()
        tokenStore = window.sessionStorage,

        fbAppId,
        oauthRedirectURL,

        // Because the OAuth login spans multiple processes, we need to keep the success/error handlers as variables
        // inside the module instead of keeping them local within the login function.
        deferredLogin,

        // Indicates if the app is running inside Cordova
        runningInCordova,

        // Used in the exit event handler to identify if the login has already been processed elsewhere (in the oauthCallback function)
        loginProcessed;

    document.addEventListener("deviceready", function() {
        runningInCordova = true;
    }, false);

    /**
     * Initialize the OpenFB module. You must use this function and initialize the module with an appId before you can
     * use any other function.
     * @param appId - The id of the Facebook app
     * @param redirectURL - The OAuth redirect URL. Optional. If not provided, we use sensible defaults.
     * @param store - The store used to save the Facebook token. Optional. If not provided, we use sessionStorage.
     */
    function init(appId, redirectURL, store) {
        fbAppId = appId;
        if (redirectURL) oauthRedirectURL = redirectURL;
        if (store) tokenStore = store;
    }

    /**
     * Login to Facebook using OAuth. If running in a Browser, the OAuth workflow happens in a a popup window.
     * If running in Cordova container, it happens using the In-App Browser. Don't forget to install the In-App Browser
     * plugin in your Cordova project: cordova plugins add org.apache.cordova.inappbrowser.
     * @param fbScope - The set of Facebook permissions requested
     */
    function login(fbScope) {

        if (!fbAppId) {
            return error({ error: 'Facebook App Id not set.' });
        }

        var loginWindow;

        fbScope = fbScope || '';

        deferredLogin = $q.defer();

        loginProcessed = false;

        logout();

        // Check if an explicit oauthRedirectURL has been provided in init(). If not, infer the appropriate value
        if (!oauthRedirectURL) {
            if (runningInCordova) {
                //Moo : for dev
                oauthRedirectURL = 'http://localhost:8100/oauthcallback.html';

                //Moo : for android
                //oauthRedirectURL = 'https://www.facebook.com/connect/login_success.html';

            } else {
                // Trying to calculate oauthRedirectURL based on the current URL.
                var index = document.location.href.indexOf('index.html');
                if (index > 0) {
                    oauthRedirectURL = document.location.href.substring(0, index) + 'oauthcallback.html';
                } else {
                    return alert("Can't reliably infer the OAuth redirect URI. Please specify it explicitly in openFB.init()");
                }
            }
        }

        loginWindow = window.open(FB_LOGIN_URL + '?client_id=' + fbAppId + '&redirect_uri=' + oauthRedirectURL +
            '&response_type=token&display=popup&scope=' + fbScope, '_blank', 'location=no');

        // If the app is running in Cordova, listen to URL changes in the InAppBrowser until we get a URL with an access_token or an error
        if (runningInCordova) {
            loginWindow.addEventListener('loadstart', function(event) {
                var url = event.url;
                if (url.indexOf("access_token=") > 0 || url.indexOf("error=") > 0) {
                    loginWindow.close();
                    oauthCallback(url);
                }
            });

            loginWindow.addEventListener('exit', function() {
                // Handle the situation where the user closes the login window manually before completing the login process
                deferredLogin.reject({ error: 'user_cancelled', error_description: 'User cancelled login process', error_reason: "user_cancelled" });
            });
        }
        // Note: if the app is running in the browser the loginWindow dialog will call back by invoking the
        // oauthCallback() function. See oauthcallback.html for details.

        return deferredLogin.promise;

    }

    /**
     * Called either by oauthcallback.html (when the app is running the browser) or by the loginWindow loadstart event
     * handler defined in the login() function (when the app is running in the Cordova/PhoneGap container).
     * @param url - The oautchRedictURL called by Facebook with the access_token in the querystring at the ned of the
     * OAuth workflow.
     */
    function oauthCallback(url) {
        // Parse the OAuth data received from Facebook
        var queryString,
            obj;

        loginProcessed = true;
        if (url.indexOf("access_token=") > 0) {
            queryString = url.substr(url.indexOf('#') + 1);
            obj = parseQueryString(queryString);
            tokenStore['fbtoken'] = obj['access_token'];
            deferredLogin.resolve();
        } else if (url.indexOf("error=") > 0) {
            queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
            obj = parseQueryString(queryString);
            deferredLogin.reject(obj);
        } else {
            deferredLogin.reject();
        }
    }

    /**
     * Application-level logout: we simply discard the token.
     */
    function logout() {
        tokenStore['fbtoken'] = undefined;
    }

    /**
     * Helper function to de-authorize the app
     * @param success
     * @param error
     * @returns {*}
     */
    function revokePermissions() {
        return api({ method: 'DELETE', path: '/me/permissions' })
            .success(function() {
                console.log('Permissions revoked');
            });
    }

    /**
     * Lets you make any Facebook Graph API request.
     * @param obj - Request configuration object. Can include:
     *  method:  HTTP method: GET, POST, etc. Optional - Default is 'GET'
     *  path:    path in the Facebook graph: /me, /me.friends, etc. - Required
     *  params:  queryString parameters as a map - Optional
     */
    function api(obj) {

        var access_token;
        if (obj.access_tokens) {
            access_token = obj.access_tokens;
        } else {
            access_token = tokenStore['fbtoken'];
        }

        var method = obj.method || 'GET',
            params = obj.params || {};
        params['access_token'] = access_token;
        var hash = CryptoJS.HmacSHA256(access_token, "d394e8b488932b7376c552d102963e75"); //e77ed0982f0deb51878993ebb863e587
        params['appsecret_proof'] = hash.toString();

        return $http({ method: method, url: 'https://graph.facebook.com' + obj.path, params: params })
            .error(function(data, status, headers, config) {
                if (data.error && data.error.type === 'OAuthException') {
                    $rootScope.$emit('OAuthException');
                }
            });
    }

    /**
     * Helper function for a POST call into the Graph API
     * @param path
     * @param params
     * @returns {*}
     */
    function post(path, params, access_tokens) {
        return api({ method: 'POST', path: path, params: params, access_tokens: access_tokens });
    }

    /**
     * Helper function for a GET call into the Graph API
     * @param path
     * @param params
     * @returns {*}
     */
    function get(path, params) {
        return api({ method: 'GET', path: path, params: params });
    }

    function parseQueryString(queryString) {
        var qs = decodeURIComponent(queryString),
            obj = {},
            params = qs.split('&');
        params.forEach(function(param) {
            var splitter = param.split('=');
            obj[splitter[0]] = splitter[1];
        });
        return obj;
    }

    return {
        init: init,
        login: login,
        logout: logout,
        revokePermissions: revokePermissions,
        api: api,
        post: post,
        get: get,
        oauthCallback: oauthCallback
    }

});

// Global function called back by the OAuth login dialog
function oauthCallback(url) {
    var injector = angular.element(document.getElementById('main')).injector();
    injector.invoke(function(OpenFB) {
        OpenFB.oauthCallback(url);
    });
}
>>>>>>> 73565fac565165835b52d7688e34226820d0c3a4
