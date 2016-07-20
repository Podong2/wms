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
    inputBox.$inject=[];

    function inputBox () {
        return {
            restrict: 'E',
            required : 'ngModel',
            scope : {
                formName : '@',
                inputName : '@',
                minlength : '@',
                maxlength : '@',
                pattern : '@',
                requiredText : '@',
                minText : '@',
                maxText : '@',
                patternText : '@',
                placeholderText : '@',
                inputType : '@',
                tooltip : '@',
                tooltipIcon : '@',
                ngModel : '=ngModel'
            },
            //templateUrl : 'app/components/wms-input/wmsInputTemplate.html',
            replace: false,
            compile: function (element, attrs) {
                var template = '<label class="input" for="'+ attrs.inputName +'"><i data-ng-hide="\''+attrs.tooltip+'\' == \'\' || \''+attrs.tooltip+'\' == undefined" class="icon-append fa '+ attrs.tooltipIcon +'"></i>'+
                                    '<input type="'+ attrs.inputType +'" class="form-control" id="'+ attrs.inputName +'" name="'+ attrs.inputName +'" placeholder="{{\''+ attrs.placeholderText +'\' | translate}}" ' +
                                    'ng-model="'+ attrs.ngModel +'" ng-minlength="'+ attrs.minlength +'" ng-maxlength="'+ attrs.maxlength +'" ng-pattern="'+ attrs.pattern +'" required wms-kr-update>' +
                                    '<b class="tooltip tooltip-top-right" data-ng-hide="\''+attrs.tooltip+'\' == \'\' || \''+attrs.tooltip+'\' == undefined" ><i class="fa txt-color-teal '+ attrs.tooltipIcon +'"></i> '+ attrs.tooltip +'</b></label>'+
                                '<div ng-show="'+ attrs.formName +'.'+ attrs.inputName +'.$dirty && '+ attrs.formName +'.'+ attrs.inputName +'.$invalid">' +
                                    '<p class="help-block" ng-show="'+ attrs.formName +'.'+ attrs.inputName +'.$error.required" translate="'+attrs.requiredText+'"></p>' +
                                    '<p class="help-block" ng-show="'+ attrs.formName +'.'+ attrs.inputName +'.$error.minlength" translate="'+attrs.minText+'"></p>' +
                                    '<p class="help-block" ng-show="'+ attrs.formName +'.'+ attrs.inputName +'.$error.maxlength" translate="'+attrs.maxText+'"></p>' +
                                    '<p class="help-block" ng-show="'+ attrs.formName +'.'+ attrs.inputName +'.$error.pattern" translate="'+attrs.patternText+'"></p>' +
                                '</div>';
                element.append(template);

            }
        };


    }
})();
