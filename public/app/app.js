'use strict';

const app = angular.module('app', ['Router', 'ngAnimate', 'AuthUser', 'Online', 'ngMaterial', 'ngMessages']);

angular.module('app')
    .run(function ($state, $stateParams, $transitions, AuthService, uiService) {

        $transitions.onStart({to: 'client'}, function (transition) {
            $state.go('client.events');
            // if (!AuthService.isLoggedIn().status) {
            //     console.log("Denied! Transition to Auth");
            //     $state.go('auth');
            // } else {
            //     console.log("Start moving to " + transition.targetState()._identifier);
            // }
        });


        $transitions.onError({}, function (transition) {
            console.log("Transition from " + transition.from().name + " to " + transition.to().name + " failed. ");
        });
    });


