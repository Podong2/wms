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
        .run(run);

    run.$inject = ['stateHandler', 'translationHandler', 'editableOptions'];

    function run(stateHandler, translationHandler, editableOptions) {
        stateHandler.initialize();
        translationHandler.initialize();
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }
})();
