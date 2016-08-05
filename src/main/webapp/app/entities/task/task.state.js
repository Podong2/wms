(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('task', {
            parent: 'app',
            url: '/task?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.task.home.title',
                title : 'Entities / Task'
            },
            views: {
                'content@app': {
                    templateUrl: 'app/entities/task/tasks.html',
                    controller: 'TaskController',
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
                    $translatePartialLoader.addPart('task');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('task-detail', {
            parent: 'app',
            url: '/task/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'wmsApp.task.detail.title',
                title : 'Detail'
            },
            views: {
                'content@app': {
                    templateUrl: 'app/entities/task/task-detail.html',
                    controller: 'TaskDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('task');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Task', function($stateParams, Task) {
                    return Task.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('task.new', {
            parent: 'task',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/task/task-dialog.html',
                    controller: 'TaskDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                dueDate: null,
                                contents: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('task', null, { reload: true });
                }, function() {
                    $state.go('task');
                });
            }]
        })
        .state('task.edit', {
            parent: 'task',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/task/task-dialog.html',
                    controller: 'TaskDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Task', function(Task) {
                            return Task.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('task', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('task.delete', {
            parent: 'task',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/task/task-delete-dialog.html',
                    controller: 'TaskDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Task', function(Task) {
                            return Task.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('task', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('my-task', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/myTask', // 표현 url 설정
            data: {
                authorities: [],
                title : 'My Task'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/task/html/myTask.html', // home에 사용될 template html 파일
                    controller: 'taskListCtrl', // home에 사용될 controller 명
                    controllerAs: 'vm' // 별칭을 vm으로 설정
                }
            },
            resolve: {//
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home'); // home.json의 다국어 파일을 주입
                    $translatePartialLoader.addPart('login'); // home.json의 다국어 파일을 주입
                    $translatePartialLoader.addPart('register'); // home.json의 다국어 파일을 주입
                    return $translate.refresh();
                }]
            }
        })
        .state('my-task.detail', { // ui router에서 호출받을 state name 설정
            parent: 'my-task',
            url: '/detail/{listType}/{id}', // 표현 url 설정
            data: {
                authorities: [],
                title : 'My Task Detail'
            },
            views: {//
                'taskDetail': {//
                    templateUrl: 'app/task/html/myTaskDetail.html', // home에 사용될 template html 파일
                    controller: 'TaskDetailCtrl', // home에 사용될 controller 명
                    controllerAs: 'vm' // 별칭을 vm으로 설정
                }
            },
            resolve: {//
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('task');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Task', function($stateParams, Task) {
                    return Task.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        //.state('my-task.view', { // ui router에서 호출받을 state name 설정
        //    url: '/tasks', // 표현 url 설정
        //    data: {
        //        authorities: [],
        //        title : 'My Task Details'
        //    },
        //    views: {//
        //        'taskList': {//
        //            templateUrl: 'app/task/html/myTaskList.html', // home에 사용될 template html 파일
        //            controller: 'taskListCtrl', // home에 사용될 controller 명
        //            controllerAs: 'vm' // 별칭을 vm으로 설정
        //        },
        //        'taskDetail': {//
        //            templateUrl: 'app/task/html/myTaskDetail.html', // home에 사용될 template html 파일
        //            controller: 'TaskDetailCtrl', // home에 사용될 controller 명
        //            controllerAs: 'vm' // 별칭을 vm으로 설정
        //        }
        //    },
        //    resolve: {//
        //        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
        //            $translatePartialLoader.addPart('task');
        //            return $translate.refresh();
        //        }]
        //    }
        //})
    }

})();
