'use strict';

angular.module('wmsApp')
    .directive('autoFocus', autoFocus);
autoFocus.$inject=['$log', '$rootScope', '$timeout'];
        function autoFocus($log, $rootScope, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                $timeout(function () {
                    element.focus();
                }, 700);
            }
        }
    }
