(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('register', {
            url: '/register',
            data: {
                authorities: [],
                pageTitle: 'register.title'
            },
            views: {
                'root': {
                    templateUrl: 'app/auth/views/register.html',
                    controller: 'RegisterController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('register');
                    $translatePartialLoader.addPart('global');
                    $translatePartialLoader.addPart('user-management');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
