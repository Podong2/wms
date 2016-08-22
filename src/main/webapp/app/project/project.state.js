(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('my-project', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/myProject/{id}', // 표현 url 설정
            data: {
                authorities: [],
                title : 'My Project'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/project/html/project.html', // home에 사용될 template html 파일
                    controller: 'projectListCtrl', // home에 사용될 controller 명
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
        .state('my-project.detail', { // ui router에서 호출받을 state name 설정
            parent: 'my-project',
            url: '/detail', // 표현 url 설정
            data: {
                authorities: [],
                title : 'My Project Detail'
            },
            params: {
                project: {}
            },
            views: {//
                'projectDetail': {//
                    templateUrl: 'app/project/html/projectDetail.html', // home에 사용될 template html 파일
                    controller: 'projectDetailCtrl', // home에 사용될 controller 명
                    controllerAs: 'vm' // 별칭을 vm으로 설정
                }
            },
            resolve: {//
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('task');
                    return $translate.refresh();
                }]
                //entity: ['$stateParams', 'Project', function($stateParams, Project) {
                //    return Project.get({id : $stateParams.id}).$promise;
                //}]
            }
        })
        .state('my-project.taskDetail', { // ui router에서 호출받을 state name 설정
            parent: 'my-project',
            url: '/detail/{listType}/:taskId', // 표현 url 설정
            data: {
                authorities: [],
                title : 'My Task Detail'
            },
            views: {//
                'projectDetail': {//
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
                    return Task.get({id : $stateParams.taskId}).$promise;
                }]
            }
        })
        .state('my-project-functions', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/myProjectFunctions', // 표현 url 설정
            data: {
                authorities: []
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/project/html/projectFunctions.html', // home에 사용될 template html 파일
                    controller: 'projectFunctionsCtrl',
                    controllerAs : 'vm'
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
        .state('my-project-functions.history', { // ui router에서 호출받을 state name 설정
            parent: 'my-project-functions',
            url: '/history/{id}', // 표현 url 설정
            data: {
                authorities: [],
                title : 'My Project History'
            },
            views: {//
                'functionView@my-project-functions': {//
                    templateUrl: 'app/project/html/projectHistory.html', // home에 사용될 template html 파일
                    controller: 'projectHistoryCtrl', // home에 사용될 controller 명
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
    }

})();
