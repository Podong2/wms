(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('system-role-permission', {
            parent: 'app',
            url: '/system-role-permission',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.systemRolePermission.home.title',
                title : 'System Role Permission'
            },
            views: {
                'content@app': {
                    templateUrl: 'app/entities/system-role-permission/system-role-permissions.html',
                    controller: 'SystemRolePermissionController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('systemRolePermission');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('system-role-permission-detail', {
            parent: 'app',
            url: '/system-role-permission/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.systemRolePermission.detail.title',
                title : 'Detail'
            },
            views: {
                'content@app': {
                    templateUrl: 'app/entities/system-role-permission/system-role-permission-detail.html',
                    controller: 'SystemRolePermissionDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('systemRolePermission');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'SystemRolePermission', function($stateParams, SystemRolePermission) {
                    return SystemRolePermission.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('system-role-permission.new', {
            parent: 'system-role-permission',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/system-role-permission/system-role-permission-dialog.html',
                    controller: 'SystemRolePermissionDialogController',
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
                    $state.go('system-role-permission', null, { reload: true });
                }, function() {
                    $state.go('system-role-permission');
                });
            }]
        })
        .state('system-role-permission.edit', {
            parent: 'system-role-permission',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/system-role-permission/system-role-permission-dialog.html',
                    controller: 'SystemRolePermissionDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['SystemRolePermission', function(SystemRolePermission) {
                            return SystemRolePermission.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('system-role-permission', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('system-role-permission.delete', {
            parent: 'system-role-permission',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/system-role-permission/system-role-permission-delete-dialog.html',
                    controller: 'SystemRolePermissionDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['SystemRolePermission', function(SystemRolePermission) {
                            return SystemRolePermission.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('system-role-permission', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
