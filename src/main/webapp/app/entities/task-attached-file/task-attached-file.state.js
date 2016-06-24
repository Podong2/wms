(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('task-attached-file', {
            parent: 'entity',
            url: '/task-attached-file',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.taskAttachedFile.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/task-attached-file/task-attached-files.html',
                    controller: 'TaskAttachedFileController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('taskAttachedFile');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('task-attached-file-detail', {
            parent: 'entity',
            url: '/task-attached-file/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.taskAttachedFile.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/task-attached-file/task-attached-file-detail.html',
                    controller: 'TaskAttachedFileDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('taskAttachedFile');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'TaskAttachedFile', function($stateParams, TaskAttachedFile) {
                    return TaskAttachedFile.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('task-attached-file.new', {
            parent: 'task-attached-file',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/task-attached-file/task-attached-file-dialog.html',
                    controller: 'TaskAttachedFileDialogController',
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
                    $state.go('task-attached-file', null, { reload: true });
                }, function() {
                    $state.go('task-attached-file');
                });
            }]
        })
        .state('task-attached-file.edit', {
            parent: 'task-attached-file',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/task-attached-file/task-attached-file-dialog.html',
                    controller: 'TaskAttachedFileDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['TaskAttachedFile', function(TaskAttachedFile) {
                            return TaskAttachedFile.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('task-attached-file', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('task-attached-file.delete', {
            parent: 'task-attached-file',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/task-attached-file/task-attached-file-delete-dialog.html',
                    controller: 'TaskAttachedFileDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['TaskAttachedFile', function(TaskAttachedFile) {
                            return TaskAttachedFile.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('task-attached-file', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
