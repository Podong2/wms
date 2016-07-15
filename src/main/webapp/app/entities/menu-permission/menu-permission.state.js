(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('menu-permission', {
            parent: 'app',
            url: '/menu-permission',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.menuPermission.home.title',
                title : 'Menu Permission'
            },
            views: {
                'content@app': {
                    templateUrl: 'app/entities/menu-permission/menu-permissions.html',
                    controller: 'MenuPermissionController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('menuPermission');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('menu-permission-detail', {
            parent: 'app',
            url: '/menu-permission/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.menuPermission.detail.title',
                title : 'Detail'
            },
            views: {
                'content@app': {
                    templateUrl: 'app/entities/menu-permission/menu-permission-detail.html',
                    controller: 'MenuPermissionDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('menuPermission');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'MenuPermission', function($stateParams, MenuPermission) {
                    return MenuPermission.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('menu-permission.new', {
            parent: 'menu-permission',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/menu-permission/menu-permission-dialog.html',
                    controller: 'MenuPermissionDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('menu-permission', null, { reload: true });
                }, function() {
                    $state.go('menu-permission');
                });
            }]
        })
        .state('menu-permission.edit', {
            parent: 'menu-permission',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/menu-permission/menu-permission-dialog.html',
                    controller: 'MenuPermissionDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['MenuPermission', function(MenuPermission) {
                            return MenuPermission.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('menu-permission', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('menu-permission.delete', {
            parent: 'menu-permission',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/menu-permission/menu-permission-delete-dialog.html',
                    controller: 'MenuPermissionDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['MenuPermission', function(MenuPermission) {
                            return MenuPermission.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('menu-permission', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
