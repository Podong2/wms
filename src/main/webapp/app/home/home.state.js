(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('home', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/', // 표현 url 설정
            data: {
                authorities: []
            },
            views: {//
                'content@': {//
                    templateUrl: 'app/home/home.html', // home에 사용될 template html 파일
                    controller: 'HomeController', // home에 사용될 controller 명
                    controllerAs: 'vm' // 별칭을 vm으로 설정
                }
            },
            resolve: {//
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home'); // home.json의 다국어 파일을 주입
                    return $translate.refresh();
                }]
            }
        });
    }
})();
