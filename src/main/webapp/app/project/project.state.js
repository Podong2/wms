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
                title : '프로젝트'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/project/html/project.html', // home에 사용될 template html 파일
                    controller: 'projectInfoCtrl', // home에 사용될 controller 명
                    controllerAs: 'vm' // 별칭을 vm으로 설정
                }
            },
            resolve: {//
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home'); // home.json의 다국어 파일을 주입
                    $translatePartialLoader.addPart('login'); // home.json의 다국어 파일을 주입
                    $translatePartialLoader.addPart('register'); // home.json의 다국어 파일을 주입
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }],
                projectForm : function($stateParams, ProjectInfo){
                    return ProjectInfo.get({
                        projectId : $stateParams.id,
                        page: 0,
                        size: 12,
                        sort: 'desc'
                    }).$promise;
                }
            }
        })
        .state('my-project.detail', { // ui router에서 호출받을 state name 설정
            parent: 'my-project',
            url: '/detail', // 표현 url 설정
            data: {
                authorities: [],
                title : '작업 상세'
            },
            params: { // project DTO 데이타 전달
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
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('my-project.taskDetail', { // ui router에서 호출받을 state name 설정
            parent: 'my-project',
            url: '/detail/{listType}/:taskId', // 표현 url 설정
            data: {
                authorities: [],
                title : '작업 상세'
            },
            params : {
                parentType : 'project',
                projectId : ''
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
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Task', function($stateParams, Task) {
                    return Task.get({id : $stateParams.taskId}).$promise;
                }]
            }
        })
        .state('my-project-functions', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/myProjectFunctions/:projectId', // 표현 url 설정
            data: {
                authorities: []
            },
            params : {
              projectId : ''
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
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('my-project-functions.history', { // ui router에서 호출받을 state name 설정
            parent: 'my-project-functions',
            url: '/history/{id}', // 표현 url 설정
            data: {
                authorities: [],
                title : '프로젝트 히스토리'
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
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('my-project-functions.file', { // ui router에서 호출받을 state name 설정
            parent: 'my-project-functions',
            url: '/file/{id}', // 표현 url 설정
            data: {
                authorities: [],
                title : '프로젝트 파일'
            },
            views: {//
                'functionView@my-project-functions': {//
                    templateUrl: 'app/project/html/projectFile.html', // home에 사용될 template html 파일
                    controller: 'projectFileCtrl', // home에 사용될 controller 명
                    controllerAs: 'vm' // 별칭을 vm으로 설정
                }
            },
            resolve: {//
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home'); // home.json의 다국어 파일을 주입
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('my-project-list', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/myProjectList', // 표현 url 설정
            data: {
                authorities: [],
                title : '프로젝트 작업 목록'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/project/html/projectList.html', // home에 사용될 template html 파일
                    controller: 'projectListCtrl', // home에 사용될 controller 명
                    controllerAs: 'vm' // 별칭을 vm으로 설정
                }
            },
            resolve: {//
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home'); // home.json의 다국어 파일을 주입
                    $translatePartialLoader.addPart('login'); // home.json의 다국어 파일을 주입
                    $translatePartialLoader.addPart('register'); // home.json의 다국어 파일을 주입
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
    }

})();
