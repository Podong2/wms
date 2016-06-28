'use strict';

angular.module('wmsApp')
    .directive('getFiles', getFiles);
getFiles.$inject=['$log', '$rootScope'];
        function getFiles($log, $rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.bind("change", function (changeEvent) {
                    $rootScope.$broadcast('setFiles', changeEvent.currentTarget.files);
                });
            }
        }
    }
