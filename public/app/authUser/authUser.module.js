angular.module('AuthUser', ['Router', 'Online']);

angular.module('AuthUser')

    .factory('AuthService', function ($state, mySocket, uiService) {

        let user = {
            status: false
        };


        return {
            login: function (aUser, callback) {
                mySocket.emit('logIn', aUser);

                mySocket.on('retrieveUserData', function (data) {
                    user = data;
                    callback(user);

                    if (data.status) {
                        // Animated interface switch and state change
                        uiService.hideRegistration()
                            .then(function () {
                                $state.go('client');
                            })
                    }
                })

            },

            signup: function (aUser, callback) {
                mySocket.emit('signUp', aUser);

                mySocket.on('retrieveUserData', function (data) {
                    user = data;
                    console.log(user);
                    callback(user);

                    if (data.status) {
                        // Animated interface switch and state change
                        uiService.hideRegistration()
                            .then(function () {
                                $state.go('client');
                            })
                    }
                })
            },

            isLoggedIn: function () {
                return user;
            },

            logOut: function () {
                user = {
                    status: false
                };
            }
        };

    });




