angular.module('Router', ['ui.router']);

angular.module('Router')

    .config(['$stateProvider', '$locationProvider',
        function config($stateProvider, $locationProvider) {

            $stateProvider
                .state({
                    name: 'client',
                    url: '/',
                    template: '<client-interface></client-interface>'
                })
                .state({
                    name: 'auth',
                    url: '/auth',
                    template: '<auth-user></auth-user>'
                });

            $locationProvider.hashPrefix('');
            $locationProvider.html5Mode(true);

        }
    ]);