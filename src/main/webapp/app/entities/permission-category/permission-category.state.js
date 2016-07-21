(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('permission-category', {
            parent: 'app',
            url: '/permission-category?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.permissionCategory.home.title',
                title : 'Permission Category'
            },
            views: {
                'content@app': {
                    templateUrl: 'app/entities/permission-category/permission-categories.html',
                    controller: 'PermissionCategoryController',
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
                    $translatePartialLoader.addPart('permissionCategory');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('permission-category-detail', {
            parent: 'app',
            url: '/permission-category/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.permissionCategory.detail.title',
                title : 'Detail'
            },
            views: {
                'content@app': {
                    templateUrl: 'app/entities/permission-category/permission-category-detail.html',
                    controller: 'PermissionCategoryDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('permissionCategory');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'PermissionCategory', function($stateParams, PermissionCategory) {
                    return PermissionCategory.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('permission-category.new', {
            parent: 'permission-category',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/permission-category/permission-category-dialog.html',
                    controller: 'PermissionCategoryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                description: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('permission-category', null, { reload: true });
                }, function() {
                    $state.go('permission-category');
                });
            }]
        })
        .state('permission-category.edit', {
            parent: 'permission-category',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/permission-category/permission-category-dialog.html',
                    controller: 'PermissionCategoryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['PermissionCategory', function(PermissionCategory) {
                            return PermissionCategory.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('permission-category', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('permission-category.delete', {
            parent: 'permission-category',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/permission-category/permission-category-delete-dialog.html',
                    controller: 'PermissionCategoryDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['PermissionCategory', function(PermissionCategory) {
                            return PermissionCategory.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('permission-category', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
