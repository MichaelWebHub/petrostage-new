angular.module('Router', ['ui.router']);

angular.module('Router')

    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
        function config($stateProvider, $locationProvider, $urlRouterProvider) {

            $stateProvider
                .state('auth', {
                    url: '/auth',
                    template: '<auth-user></auth-user>'
                })
                .state('client', {
                    url: '/',
                    template: '<client-interface></client-interface>'
                })
                .state('client.events', {
                    url: 'events',
                    template: '<events-interface></events-interface>'
                })
                .state('client.about', {
                    url: 'about',
                    template: '<about-interface></about-interface>'
                });

            $urlRouterProvider.otherwise('/');
            $locationProvider.hashPrefix('');
            $locationProvider.html5Mode(true);

        }
    ]);