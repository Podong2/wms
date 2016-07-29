(function(){

    "use strict";
    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('login', {
                url: '/login',
                views: {
                    'root': {
                        templateUrl: 'app/auth/views/login.html',
                        controller: 'LoginController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'login',
                    htmlId: 'extr-page'
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('register');
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                }
            })
            .state('realLogin', {
                url: '/real-login',

                views: {
                    root: {
                        templateUrl: "app/auth/view/login.html",
                        controller: 'LoginController'
                    }
                },
                data: {
                    title: 'Login',
                    rootId: 'extra-page'
                }

            })
            .state('forgotPassword', {
                url: '/forgot-password',
                views: {
                    root: {
                        templateUrl: 'app/auth/views/forgot-password.html'
                    }
                },
                data: {
                    title: 'Forgot Password',
                    htmlId: 'extr-page'
                }
            })

            .state('lock', {
                url: '/lock',
                views: {
                    root: {
                        templateUrl: 'app/auth/views/lock.html'
                    }
                },
                data: {
                    title: 'Locked Screen',
                    htmlId: 'lock-page'
                }
            })
    }

})();
