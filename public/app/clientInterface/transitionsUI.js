angular.module('app')
    .factory('uiService', function () {

        return {

            hideRegistration: function () {
                return new Promise((resolve, reject) => {
                    const whitePlane = document.querySelector('.registration-inner');
                    const registration = document.querySelector('.registration');
                    const form = document.querySelector('.registration-form');
                    const inner_animate = document.querySelector('.registration-inner-animate');

                    form.classList.add('ng-hide');
                    inner_animate.style.transition = "transform 1.2s";
                    inner_animate.style.transform = "scale(7)";
                    inner_animate.style.background = "#ECEFF1";

                    setTimeout(function () {
                        registration.classList.add('ng-hide');
                        resolve();
                    }, 1300);
                });

            },

            showAdminPanel: function () {
                const admin = document.querySelector('.admin-panel');
                const orders = document.querySelector('.orders-panel');

                admin.classList.add('enter');
                orders.classList.add('enter');
            }
        }

    });