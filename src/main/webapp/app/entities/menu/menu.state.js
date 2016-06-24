(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('menu', {
            parent: 'entity',
            url: '/menu?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.menu.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/menu/menus.html',
                    controller: 'MenuController',
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
                permissionLoader : function (PagePermission) {
                    return PagePermission.getPagePermission();
                },
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
                    $translatePartialLoader.addPart('menu');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('menu-detail', {
            parent: 'entity',
            url: '/menu/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.menu.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/menu/menu-detail.html',
                    controller: 'MenuDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('menu');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Menu', function($stateParams, Menu) {
                    return Menu.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('menu.new', {
            parent: 'menu',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/menu/menu-dialog.html',
                    controller: 'MenuDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                description: null,
                                area: null,
                                position: null,
                                status: null,
                                projectYn: null,
                                systemYn: null,
                                mobileYn: null,
                                hrIncludeYn: null,
                                urlPath: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('menu', null, { reload: true });
                }, function() {
                    $state.go('menu');
                });
            }]
        })
        .state('menu.edit', {
            parent: 'menu',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/menu/menu-dialog.html',
                    controller: 'MenuDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Menu', function(Menu) {
                            return Menu.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('menu', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('menu.delete', {
            parent: 'menu',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/menu/menu-delete-dialog.html',
                    controller: 'MenuDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Menu', function(Menu) {
                            return Menu.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('menu', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
