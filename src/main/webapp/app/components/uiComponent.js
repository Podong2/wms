/*
 * Copyright (c) 2016. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

(function() {
    'use strict';

    angular
        .module('wmsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('component', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/component', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Components'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/uiComponent.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
