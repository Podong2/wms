

'use strict';

angular.module('wmsApp').directive('wmsPageTitle', wmsPageTitle);
wmsPageTitle.$inject=['$rootScope', '$timeout'];
    function wmsPageTitle($rootScope, $timeout) {
    return {
        restrict: 'A',
        compile: function (element, attributes) {
            element.removeAttr('wms-Page-Title data-wms-Page-Title');

            var defaultTitle = attributes.wmsPageTitle;
            var listener = function(event, toState, toParams, fromState, fromParams) {
                var title = defaultTitle;
                if (toState.data && toState.data.title) title = toState.data.title + ' | ' + title;
                // Set asynchronously so page changes before title does
                $timeout(function() {
                    $('html head title').text(title);
                });
            };

            $rootScope.$on('$stateChangeStart', listener);

        }
    }
}
