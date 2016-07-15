(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('system-role-user', {
            parent: 'app',
            url: '/system-role-user',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.systemRoleUser.home.title',
                title : 'System Role User'
            },
            views: {
                'content@app': {
                    templateUrl: 'app/entities/system-role-user/system-role-users.html',
                    controller: 'SystemRoleUserController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('systemRoleUser');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('system-role-user-detail', {
            parent: 'app',
            url: '/system-role-user/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.systemRoleUser.detail.title',
                title : 'Detail'
            },
            views: {
                'content@app': {
                    templateUrl: 'app/entities/system-role-user/system-role-user-detail.html',
                    controller: 'SystemRoleUserDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('systemRoleUser');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'SystemRoleUser', function($stateParams, SystemRoleUser) {
                    return SystemRoleUser.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('system-role-user.new', {
            parent: 'system-role-user',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/system-role-user/system-role-user-dialog.html',
                    controller: 'SystemRoleUserDialogController',
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
                    $state.go('system-role-user', null, { reload: true });
                }, function() {
                    $state.go('system-role-user');
                });
            }]
        })
        .state('system-role-user.edit', {
            parent: 'system-role-user',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/system-role-user/system-role-user-dialog.html',
                    controller: 'SystemRoleUserDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['SystemRoleUser', function(SystemRoleUser) {
                            return SystemRoleUser.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('system-role-user', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('system-role-user.delete', {
            parent: 'system-role-user',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/system-role-user/system-role-user-delete-dialog.html',
                    controller: 'SystemRoleUserDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['SystemRoleUser', function(SystemRoleUser) {
                            return SystemRoleUser.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('system-role-user', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
