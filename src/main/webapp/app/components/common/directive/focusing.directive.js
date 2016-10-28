'use strict';

angular.module('wmsApp')
    .directive('autoFocus', autoFocus)
    .directive('filterFocus', filterFocus);
autoFocus.$inject=['$log', '$rootScope', '$timeout'];
filterFocus.$inject=['$log', '$rootScope', '$timeout'];
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
        function filterFocus($log, $rootScope, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.on('click', function(){
                    $timeout(function () {
                        $('.filter-input').focus();
                    }, 300);
                });
            }
        }
    }
