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
            'angular-loading-bar',
            'nya.bootstrap.select',
            'ngAnimate',
            'toastr',
            'ui.bootstrap.datetimepicker',
            'ui.bootstrap.pagination',
            'xeditable',
            'drag',
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
            'adf.widget.news',
            'adf.widget.linklist',
            'adf.widget.markdown',
            'adf.widget.github',
            'adf.widget.travis',
            'ngTagsInput',
            'lrDragNDrop',
            'cellCursor',
            'nvd3',
            'wms.widget.barChart',
            'wms.widget.columnChart',
            'wms.widget.lineChart',
            'wms.widget.pieChart',
            'mwl.calendar',
            'angularMoment'
        ])
        .config(config)
        .run(run);

    config.$inject = ['nyaBsConfigProvider', 'dashboardProvider'];
    run.$inject = ['stateHandler', 'translationHandler', 'editableOptions'];

    function config(nyaBsConfigProvider, dashboardProvider) {
        nyaBsConfigProvider.setLocalizedText('ko', {
            defaultNoneSelection: '선택 해주세요',
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

        nyaBsConfigProvider.useLocale('ko');

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
    }

    function run(stateHandler, translationHandler, editableOptions) {
        stateHandler.initialize();
        translationHandler.initialize();
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }
})();
