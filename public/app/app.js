'use strict';

const app = angular.module('app', ['Router', 'ngAnimate', 'AuthUser', 'Online','ngMaterial', 'ngMessages']);

angular.module('app')
    .run(function ($state, $stateParams, $transitions, AuthService, uiService) {

        $transitions.onBefore({}, function(transition) {
            return AuthService.getSession();
        });
    });


