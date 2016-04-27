angular.module('your_app_name.auth.controllers', [])


.controller('WelcomeCtrl', function($scope, $state, $ionicModal, OpenFB) {
    // $scope.bgs = ["http://lorempixel.com/640/1136"];
    $scope.bgs = ["img/welcome-bg.jpeg"];

    $scope.facebookSignIn = function() {

        OpenFB.login('email,public_profile,user_friends,user_photos,user_posts,publish_actions,user_birthday,email,manage_pages,publish_pages,read_page_mailboxes').then(
            function() {

                $state.go('app.feed');
            },
            function() {
                alert('OpenFB : Login Failed! Please Try Again...');
            });

    };

    $ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.privacy_policy_modal = modal;
    });

    $ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.terms_of_service_modal = modal;
    });

    $scope.showPrivacyPolicy = function() {
        $scope.privacy_policy_modal.show();
    };

    $scope.showTerms = function() {
        $scope.terms_of_service_modal.show();
    };
})

.controller('CreateAccountCtrl', function($scope, $state) {
    $scope.doSignUp = function() {
        console.log("doing sign up");
        $state.go('app.feed');
    };
})

.controller('WelcomeBackCtrl', function($scope, $state, $ionicModal) {
    $scope.doLogIn = function() {
        console.log("doing log in");
        $state.go('app.feed');
    };

    $ionicModal.fromTemplateUrl('views/auth/forgot-password.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.forgot_password_modal = modal;
    });

    $scope.showForgotPassword = function() {
        $scope.forgot_password_modal.show();
    };

    $scope.requestNewPassword = function() {
        console.log("requesting new password");
    };

    // //Cleanup the modal when we're done with it!
    // $scope.$on('$destroy', function() {
    //   $scope.modal.remove();
    // });
    // // Execute action on hide modal
    // $scope.$on('modal.hidden', function() {
    //   // Execute action
    // });
    // // Execute action on remove modal
    // $scope.$on('modal.removed', function() {
    //   // Execute action
    // });
})

.controller('ForgotPasswordCtrl', function($scope) {

})

;
