(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('app', {
            abstract: true,
            views: {
                //'navbar@': {
                //    templateUrl: 'app/layouts/navbar/navbar.html',
                //    controller: 'NavbarController',
                //    controllerAs: 'vm'
                //},
                'layout@': {
                    templateUrl: 'app/layout/layout.tpl.html',
                    controller: 'NavbarController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                //permissionLoader : function (PagePermission) {
                //    return PagePermission.getPagePermission();
                //},
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.authorize();
                    }
                ],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('global');
                }]
            }
        });
    }
})();
