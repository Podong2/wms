(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('permission', {
            parent: 'app',
            url: '/permission?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.permission.home.title',
                title : 'Entities / Permission'
            },
            views: {
                'content@app': {
                    templateUrl: 'app/entities/permission/permissions.html',
                    controller: 'PermissionController',
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
                    $translatePartialLoader.addPart('permission');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('permission-detail', {
            parent: 'app',
            url: '/permission/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.permission.detail.title',
                title : 'Detail'
            },
            views: {
                'content@app': {
                    templateUrl: 'app/entities/permission/permission-detail.html',
                    controller: 'PermissionDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('permission');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Permission', function($stateParams, Permission) {
                    return Permission.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('permission.new', {
            parent: 'permission',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/permission/permission-dialog.html',
                    controller: 'PermissionDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                description: null,
                                status: null,
                                action: null,
                                roleGubun: null,
                                rolePermissionYn: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('permission', null, { reload: true });
                }, function() {
                    $state.go('permission');
                });
            }]
        })
        .state('permission.edit', {
            parent: 'permission',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/permission/permission-dialog.html',
                    controller: 'PermissionDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Permission', function(Permission) {
                            return Permission.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('permission', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('permission.delete', {
            parent: 'permission',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/permission/permission-delete-dialog.html',
                    controller: 'PermissionDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Permission', function(Permission) {
                            return Permission.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('permission', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
