(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('home', { // ui router에서 호출받을 state name 설정
            parent: 'app', // app 이라는 parent의 $stateProvider를 상속받아 사용이 가능하다.
            url: '/', // 표현 url 설정
            data: { // 해당페이지의 권한 체크를 위한 authorities값을 주입한다.
                authorities: []
            },
            views: {// 호출받은 router 페이지의 ui-view에 대한 템플릿 및 컨트롤러를 설정할 수 있다.
                'content@': {// 해당 뷰의 name
                    templateUrl: 'app/home/home.html', // home에 사용될 template html 파일
                    controller: 'HomeController', // home에 사용될 controller 명
                    controllerAs: 'vm' // 별칭을 vm으로 설정
                }
            },
            resolve: {// 라우팅 전에 특정 설정파일들을 설정한다.
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home'); // home.json의 다국어 파일을 주입
                    $translatePartialLoader.addPart('global'); // home.json의 다국어 파일을 주입
                    return $translate.refresh();
                }]
            }
        });
    }
})();
