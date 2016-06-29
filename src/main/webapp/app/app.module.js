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
            'angularFileUpload'
        ])
        .config(config)
        .run(run);

    config.$inject = ['nyaBsConfigProvider'];
    run.$inject = ['stateHandler', 'translationHandler', 'editableOptions'];

    function config(nyaBsConfigProvider) {
        nyaBsConfigProvider.setLocalizedText('ko-kr', {
            defaultNoneSelection: '선택 해주세요',
            noSearchResult: '검색 결과가 존재하지 않습니다',
            numberItemSelected: '%d개 선택 되었습니다',
            selectAll: '전체 선택',
            deselectAll: '전체 해제'
        });

        nyaBsConfigProvider.useLocale('ko-kr');
    }

    function run(stateHandler, translationHandler, editableOptions) {
        stateHandler.initialize();
        translationHandler.initialize();
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }
})();
