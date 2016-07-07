/**
 * Created by Jeong on 2016-03-24.
 */
/**
 * Created by Jeong on 2016-03-24.
 */
'use strict';

angular.module('wmsApp')
    .directive('selectBox', selectBox);
selectBox.$inject=['$document', '$log', '$compile']
function selectBox($document, $log, $compile) {

    return {
        restrict: 'E',
        required : "ngModel",
        scope: {
            search : '=selected',
            save : '=ngModel'
        },
        replace : false,
        controller : ['$scope', '$element', '$attrs', '$rootScope', function ($scope, $element, $attrs, $rootScope) {

            $scope.$watch("selectedValue", function(){
                $scope.$parent.vm[$scope.selectedValueName] = $scope.selectedValue;
            });

        }],
        link: function (scope, element, attrs) {
            scope.selectedValueName = attrs['selectedvalue'];
            scope.actionsBox = attrs['actionsbox'];
            scope.multiple = attrs['multiple'];
            scope.dataSize = attrs['datasize'];
            scope.dataLiveSearch = attrs['datalivesearch'];
            scope.disabled = attrs['disabled'];
            var template = '';
            if(scope.multiple == 'true'){
                template = '<ol class="nya-bs-select" ng-model="selectedValue" actions-box="' + scope.actionsBox + '" multiple data-size="'+ scope.dataSize +'" data-live-search="'+ scope.dataLiveSearch +'" disabled="'+ scope.disabled +'">' +
                                '<li nya-bs-option="option in save">' +
                                    '<a><span><span class="glyphicon" ng-class="option.icon"></span> {{ option.name }}</span><span class="glyphicon glyphicon-ok check-mark"></span></a>' +
                                '</li>' +
                            '</ol>';
            }else{
                template = '<ol class="nya-bs-select" ng-model="selectedValue" actions-box="' + scope.actionsBox + '" data-size="'+ scope.dataSize +'" data-live-search="'+ scope.dataLiveSearch +'" disabled="'+ scope.disabled +'">' +
                                '<li nya-bs-option="option in save">' +
                                    '<a><span><span class="glyphicon" ng-class="option.icon"></span> {{ option.name }}</span><span class="glyphicon glyphicon-ok check-mark"></span></a>' +
                                '</li>' +
                            '</ol>';
            }
            var linkFn = $compile(template);
            var content = linkFn(scope);
            element.append(content);
        }
    }
}
