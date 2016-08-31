(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('my-profile', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/myProfile', // 표현 url 설정
            data: {
                authorities: [],
                title : '내 정보'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/user/html/userProfile.html', // home에 사용될 template html 파일
                    controller: 'userProfileCtrl', // home에 사용될 controller 명
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
