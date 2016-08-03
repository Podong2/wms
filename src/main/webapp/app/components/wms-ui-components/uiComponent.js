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
                    templateUrl: 'app/components/wms-ui-components/uiComponent.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('alerts', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/alerts', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Alerts'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsAlerts.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('autoComplete', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/autoComplete', // 표현 url 설정
            data: {
                authorities: [],
                title : 'AutoComplete'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsAutoComplete.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('button', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/button', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Button'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsButton.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('calender', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/calender', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Calender'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsCalender.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('chart', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/chart', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Chart'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsChart.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('dashboard', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/dashboard', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Dashboard'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsDashboard.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('datePicker', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/datePicker', // 표현 url 설정
            data: {
                authorities: [],
                title : 'DatePicker'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsDatePicker.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('ganttChart', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/ganttChart', // 표현 url 설정
            data: {
                authorities: [],
                title : 'GanttChart'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsGanttChart.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('input', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/input', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Input'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsInputBox.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('kanbanBoard', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/kanbanBoard', // 표현 url 설정
            data: {
                authorities: [],
                title : 'KanbanBoard'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsKanbanBoard.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('layout', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/layout', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Layout'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsLayout.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('modal', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/modal', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Modal'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsModal.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('ngGallery', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/ngGallery', // 표현 url 설정
            data: {
                authorities: [],
                title : 'NgGallery'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsNgGallery.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('pagination', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/pagination', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Pagination'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsPagination.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('progressbar', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/progressbar', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Progressbar'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsProgressbar.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('selectBox', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/selectBox', // 표현 url 설정
            data: {
                authorities: [],
                title : 'SelectBox'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsSelectBox.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('summerNote', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/summerNote', // 표현 url 설정
            data: {
                authorities: [],
                title : 'SummerNote'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsSummerNote.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('table', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/table', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Table'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsTable.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('toast', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/toast', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Toast'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsToast.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('tooltip', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/tooltip', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Tooltip'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsTooltip.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('tree', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/tree', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Tree'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsTree.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('xeditable', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/xeditable', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Xeditable'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsXeditable.html', // home에 사용될 template html 파일
                    controller: 'UiComponentController', // home에 사용될 controller 명
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
        .state('ui-layout', { // ui router에서 호출받을 state name 설정
            parent: 'app',
            url: '/uiLayout', // 표현 url 설정
            data: {
                authorities: [],
                title : 'Ui Layout'
            },
            views: {//
                'content@app': {//
                    templateUrl: 'app/components/wms-ui-components/ui-templates/wmsUILayout.html', // home에 사용될 template html 파일
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
    }
})();
