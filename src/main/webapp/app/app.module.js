(function() {
    'use strict';

    angular
        .module('wmsApp', [
            'ngStorage',
            'tmh.dynamicLocale',
            'pascalprecht.translate',
            'ngResource',
            'ngCookies',
            'ngAria',
            'ngCacheBuster',
            'ngFileUpload',
            'ui.bootstrap',
            'ui.bootstrap.datetimepicker',
            'ui.router',
            'infinite-scroll',
            // jhipster-needle-angularjs-add-module JHipster will add new module here
            'angular-loading-bar', /////
            'nya.bootstrap.select',
            'ngAnimate',
            'toastr',
            'ui.bootstrap.datetimepicker',
            'ui.bootstrap.pagination',
            'xeditable',
            // 'drag',
            'jkuri.gallery',
            'react',
            'ui.tree',
            'pasvaz.bindonce',
            'smart-table',
            'summernote',
            'angularFileUpload',
            'ui.mask',
            'ntt.TreeDnD',
            'ngTagsInput',
            'adf',
            'adf.structures.base',
            //'adf.widget.news',
            //'adf.widget.linklist',
            //'adf.widget.markdown',
            //'adf.widget.github',
            //'adf.widget.travis',
            'lrDragNDrop',
            'cellCursor',
            'nvd3',
            //'wms.widget.barChart',
            //'wms.widget.columnChart',
            //'wms.widget.lineChart',
            //'wms.widget.pieChart',
            'wms.widget.myTaskList',
            'wms.widget.myProjectTaskList',
            'wms.widget.myMonthlyTaskChart',
            'wms.widget.myMonthlyProjectTaskChart',
            'mwl.calendar',
            'angularMoment',
            'gantt',
            'gantt.sortable',
            'gantt.movable',
            'gantt.drawtask',
            'gantt.tooltips',
            'gantt.bounds',
            'gantt.progress',
            'gantt.table',
            'gantt.tree',
            'gantt.groups',
            'gantt.dependencies',
            'gantt.overlap',
            'gantt.resizeSensor',
            'mgcrea.ngStrap',
            'mgcrea.ngStrap.collapse',
            'dndLists',
            'bgDirectives',
            //'ngProgress' // 프로그래스 바 개선 시 작업 할것
        ])
        .config(config)
        .run(run);

    config.$inject = ['nyaBsConfigProvider', 'dashboardProvider', '$compileProvider', 'toastrConfig', 'tagsInputConfigProvider'];
    run.$inject = ['stateHandler', 'translationHandler', 'editableOptions'];

    function config(nyaBsConfigProvider, dashboardProvider, $compileProvider, toastrConfig, tagsInputConfigProvider) {
        $compileProvider.debugInfoEnabled(false); // Remove debug info (angularJS >= 1.3)

        nyaBsConfigProvider.setLocalizedText('ko', {
            defaultNoneSelection: '선택',
            noSearchResult: '검색 결과가 존재하지 않습니다',
            numberItemSelected: '%d개 선택 되었습니다',
            selectAll: '전체 선택',
            deselectAll: '전체 해제'
        });
        nyaBsConfigProvider.setLocalizedText('en', {
            defaultNoneSelection: 'Nothing selected',
            noSearchResult: 'NO SEARCH RESULT',
            numberItemSelected: '%d items selected',
            selectAll: 'Select All',
            deselectAll: 'Deselect All'
        });
        nyaBsConfigProvider.setLocalizedText('ja', {
            defaultNoneSelection: '選択してください',
            noSearchResult: '検索結果が存在しません',
            numberItemSelected: '%d個の選択されました',
            selectAll: '全選択',
            deselectAll: '全解除'
        });

        /* select box 다국어 설정 */
        nyaBsConfigProvider.useLocale('ko');

        /* dashboard 기본 영역 */
        dashboardProvider
            .structure('6-6', {
                rows: [{
                    columns: [{
                        styleClass: 'col-md-6'
                    }, {
                        styleClass: 'col-md-6'
                    }]
                }]
            });

        /* toast config */
        angular.extend(toastrConfig, {
            allowHtml: false,
            closeButton: true,
            closeHtml: '<button>&times;</button>',
            extendedTimeOut: 1000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            messageClass: 'toast-message',
            onHidden: null,
            onShown: null,
            onTap: null,
            progressBar: true,
            tapToDismiss: true,
            templates: {
                toast: 'directives/toast/toast.html',
                progressbar: 'directives/progressbar/progressbar.html'
            },
            timeOut: 3000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        });

        tagsInputConfigProvider.setTextAutosizeThreshold(30);
    }

    function run(stateHandler, translationHandler, editableOptions) {
        stateHandler.initialize();
        translationHandler.initialize();
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

    }
})();
