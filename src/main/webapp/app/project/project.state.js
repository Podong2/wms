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
            url: '/detail/{listType}/{id}', // 표현 url 설정
            data: {
                authorities: [],
                title : 'My Project Detail'
            },
            views: {//
                'taskDetail': {//
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
    }

})();
