'use strict';

angular.module('wmsApp')
    .directive('getFiles', getFiles)
    .directive('customOnChange', customOnChange);
getFiles.$inject=['$log', '$rootScope'];
customOnChange.$inject=['$log', '$rootScope'];
        function getFiles($log, $rootScope) {
        return {
            restrict: 'A',
            scope : {
                fileType : "@"
            },
            link: function(scope, element) {
                element.bind("change", function (changeEvent) {
                    if(scope.fileType == 'comment') $rootScope.$broadcast('setCommentFiles', changeEvent.target.files);
                    else $rootScope.$broadcast('setFiles', changeEvent.target.files);
                    $(".kv-file-upload").remove();
                    $(".kv-file-zoom").remove();
                });
                //element.bind("filebatchselected", function (event, files) {
                //    if(scope.fileType == 'comment') $rootScope.$broadcast('setCommentFiles', files);
                //    else $rootScope.$broadcast('setFiles', files);
                //    $(".kv-file-upload").remove();
                //    $(".kv-file-zoom").remove();
                //});
            }
        }
    }
function customOnChange() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeHandler);
        }
    };
}
