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

                    if (data.token) {
                        localStorage.token = data.token;
                    }

                    if (data.status) {
                        // Animated interface switch and state change
                        uiService.hideRegistration()
                            .then(function () {
                                $state.go('client.events');
                            })
                    }
                })

            },

            loginAsGuest: function() {
                uiService.hideRegistration()
                    .then(function () {
                        $state.go('client.events');
                    })
            },

            signup: function (aUser, callback) {
                mySocket.emit('signUp', aUser);

                mySocket.on('retrieveUserData', function (data) {
                    user = data;
                    callback(user);

                    if (data.token) {
                        localStorage.token = data.token;
                    }

                    if (data.status) {
                        // Animated interface switch and state change
                        uiService.hideRegistration()
                            .then(function () {
                                $state.go('client.events');
                            })
                    }
                })
            },

            getSession: function() {
                return new Promise((resolve, reject) => {
                    fetch('/check', {
                        method: 'get',
                        headers: {
                            "x-access-token": localStorage.getItem('token')
                        }
                    })
                        .then(result => result.json())
                        .then((data) => {
                            user = data;
                            resolve(user);
                        })
                        .catch((err) => console.log(err));
                })
            },

            isLoggedIn: function () {
                return user;
            },

            logOut: function () {
                localStorage.removeItem('token');
                user = {
                    status: false
                };
            }
        };

    });




