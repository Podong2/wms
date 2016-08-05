/**
 * Created by Jeong on 2016-03-24.
 */
/**
 * Created by Jeong on 2016-03-24.
 */
(function() {
'use strict';

angular.module('wmsApp')
    .directive('wmsSelectBox', wmsSelectBox);
    wmsSelectBox.$inject=['$document', '$log', '$compile'];
function wmsSelectBox($document, $log, $compile) {
    return {
        restrict: 'E',
        scope: {
            save : '=ngModel',
            selectedValue : '=',
            actionsBox : '@',
            multiple : '@',
            datasize : '@',
            datalivesearch : '@',
            disabled : '@'
        },
        replace : false,
        controller : ['$scope', '$element', '$attrs', '$rootScope', function ($scope, $element, $attrs, $rootScope) {
        }],
        compile: function (element) {
            return function($scope){
                console.log($scope);
                var template = '';
                if($scope.multiple == 'true'){
                    template = '<ol class="nya-bs-select col-sm-2" ng-model="selectedValue" actions-box="' + $scope.actionsBox + '" multiple data-size="'+ $scope.datasize +'" data-live-search="'+ $scope.datalivesearch +'" disabled="'+ $scope.disabled +'">' +
                        '<li nya-bs-option="option in save" title="{{option.name}}" data-value="option.id">' +
                        '<a><span><span class="glyphicon" ng-class="option.icon"></span> {{ option.name }}</span><span class="glyphicon glyphicon-ok check-mark"></span></a>' +
                        '</li>' +
                        '</ol>';
                }else{
                    template = '<ol class="nya-bs-select col-sm-2" ng-model="selectedValue" actions-box="' + $scope.actionsBox + '" data-size="'+ $scope.datasize +'" data-live-search="'+ $scope.datalivesearch +'" disabled="'+ $scope.disabled +'">' +
                        '<li nya-bs-option="option in save" title="{{option.name}}" data-value="option.id">' +
                        '<a><span><span class="glyphicon" ng-class="option.icon"></span> {{ option.name }}</span><span class="glyphicon glyphicon-ok check-mark"></span></a>' +
                        '</li>' +
                        '</ol>';
                }
                // TODO compile 함수를 사용하여 처리한다.
                var linkFn = $compile(template);
                var content = linkFn($scope);
                element.append(content);
            }

        }
    }
}
})();
