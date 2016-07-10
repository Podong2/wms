/*
 * Copyright (c) 2016. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

(function() {
    'use strict';

    angular
        .module('wmsApp')
        .directive('inputBox', inputBox);
    inputBox.$inject=['$compile'];

    function inputBox ($compile) {
        return {
            restrict: 'E',
            scope : {
                formName : '@',
                inputName : '@',
                minlength : '@',
                maxlength : '@',
                pattern : '@',
                ngModel : '=ngModel',
                requiredText : '@',
                minText : '@',
                maxText : '@',
                patternText : '@',
                placeholderText : '@'
            },
            replace: false,
            compile: function (element) {

                return function($scope){
                    var template = '<form  name="'+ $scope.formName +'" role="'+ $scope.formName +'" novalidate show-validation>' +
                        '<div class="form-group">'+
                        '<label class="control-label" for="'+ $scope.inputName +'" translate="global.form.username">Username</label>'+
                        '<input type="text" class="form-control" id="'+ $scope.inputName +'" name="'+ $scope.inputName +'" placeholder="{{\''+ $scope.placeholderText +'\' | translate}}" ' +
                        'ng-model="ngModel" ng-minlength="'+ $scope.minlength +'" ng-maxlength="'+ $scope.maxlength +'" ng-pattern="'+ $scope.pattern +'" required wms-kr-update>'+
                        '<div ng-show="'+ $scope.formName +'.'+ $scope.inputName +'.$dirty && '+ $scope.formName +'.'+ $scope.inputName +'.$invalid">' +
                        '<p class="help-block" ng-if="'+ $scope.formName +'.'+ $scope.inputName +'.$error.required" translate="'+$scope.requiredText+'"></p>' +
                        '<p class="help-block" ng-if="'+ $scope.formName +'.'+ $scope.inputName +'.$error.minlength" translate="'+$scope.minText+'"></p>' +
                        '<p class="help-block" ng-if="'+ $scope.formName +'.'+ $scope.inputName +'.$error.maxlength" translate="'+$scope.maxText+'"></p>' +
                        '<p class="help-block" ng-if="'+ $scope.formName +'.'+ $scope.inputName +'.$error.pattern" translate="'+$scope.patternText+'"></p>' +
                        '</div>' +
                        '</div>';
                    '</form>';
                    var linkFn = $compile(template);
                    var content = linkFn($scope);
                    element.append(content);
                }

            }
        };


    }
})();
