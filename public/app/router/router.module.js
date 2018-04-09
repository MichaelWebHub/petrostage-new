angular.module('Router', ['ui.router']);

angular.module('Router')

    .config(['$stateProvider', '$locationProvider',
        function config($stateProvider, $locationProvider) {

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

            $locationProvider.hashPrefix('');
            $locationProvider.html5Mode(true);

        }
    ]);