'use strict';

angular.module('wmsApp')
    .directive('getFiles', getFiles);
getFiles.$inject=['$log', '$rootScope'];
        function getFiles($log, $rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.bind("change", function (changeEvent) {
                    $rootScope.$broadcast('setFiles', changeEvent.target.files);
                    $(".kv-file-upload").remove();
                    $(".kv-file-zoom").remove();
                });
                element.bind("filebatchselected", function (event, files) {
                    $rootScope.$broadcast('setFiles', files);
                    $(".kv-file-upload").remove();
                    $(".kv-file-zoom").remove();
                });
            }
        }
    }
