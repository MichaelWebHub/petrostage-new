angular.module('Router', ['ui.router']);

angular.module('Router')

    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
        function config($stateProvider, $locationProvider, $urlRouterProvider) {

            $stateProvider
                .state('client', {
                    url: '/',
                    abstract: true,
                    template: '<client-interface></client-interface>'
                })
                .state('auth', {
                    url: '^/auth',
                    template: '<auth-user></auth-user>'
                })
                .state('client.events', {
                    url: '^/events',
                    template: '<events-interface></events-interface>'
                })
                .state('client.about', {
                    url: '^/about',
                    template: '<about-interface></about-interface>'
                })
                .state('client.contact', {
                    url: '^/contact',
                    template: '<contact-interface></contact-interface>'
                });

            $urlRouterProvider.when('/', 'events');
            $locationProvider.hashPrefix('');
            $locationProvider.html5Mode(true);

        }
    ]);