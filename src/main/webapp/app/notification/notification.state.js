(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('my-notification', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/myNotification/{id}', // 표현 url 설정
            data: {
                authorities: [],
                title : '알림'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/notification/html/notification.html', // home에 사용될 template html 파일
                    controller: 'notificationListCtrl', // home에 사용될 controller 명
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
        .state('my-notification.projectDetail', { // ui router에서 호출받을 state name 설정
            parent: 'my-notification',
            url: '/projectDetail', // 표현 url 설정
            data: {
                authorities: [],
                title : '프로젝트 상세'
            },
            params: {
                notification: {}
            },
            views: {//
                'notificationDetail': {//
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
            }
        })
        .state('my-notification.taskDetail', { // ui router에서 호출받을 state name 설정
            parent: 'my-notification',
            url: '/taskDetail/{listType}/:taskId', // 표현 url 설정
            data: {
                authorities: [],
                title : '작업 상세'
            },
            views: {//
                'notificationDetail': {//
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
    }

})();
