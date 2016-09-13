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
                fileType : "=fileType"
            },
            link: function(scope, element, attr) {
                element.bind("change", function (changeEvent) {
                    if(changeEvent.target.getAttribute('file-type') == 'comment') {
                        $rootScope.$broadcast('setCommentFiles', changeEvent.target.files);
                    }
                    else if(changeEvent.target.getAttribute('file-type') == 'task-add'){
                        $rootScope.$broadcast('setTaskAddFiles', changeEvent.target.files);
                    } else {
                        $rootScope.$broadcast('setFiles', changeEvent.target.files);
                    }
                    $(".kv-file-upload").remove();
                    $(".kv-file-zoom").remove();
                });
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
