angular.module('Router', ['ui.router']);

angular.module('Router')

    .config(['$stateProvider',
        function config($stateProvider) {

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
                })
        }
    ]);