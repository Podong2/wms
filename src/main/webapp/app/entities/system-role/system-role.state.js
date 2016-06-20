(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('system-role', {
            parent: 'entity',
            url: '/system-role?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.systemRole.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/system-role/system-roles.html',
                    controller: 'SystemRoleController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('systemRole');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('system-role-detail', {
            parent: 'entity',
            url: '/system-role/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.systemRole.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/system-role/system-role-detail.html',
                    controller: 'SystemRoleDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('systemRole');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'SystemRole', function($stateParams, SystemRole) {
                    return SystemRole.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('system-role.new', {
            parent: 'system-role',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/system-role/system-role-dialog.html',
                    controller: 'SystemRoleDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                description: null,
                                roleGubun: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('system-role', null, { reload: true });
                }, function() {
                    $state.go('system-role');
                });
            }]
        })
        .state('system-role.edit', {
            parent: 'system-role',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/system-role/system-role-dialog.html',
                    controller: 'SystemRoleDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['SystemRole', function(SystemRole) {
                            return SystemRole.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('system-role', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('system-role.delete', {
            parent: 'system-role',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/system-role/system-role-delete-dialog.html',
                    controller: 'SystemRoleDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['SystemRole', function(SystemRole) {
                            return SystemRole.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('system-role', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
