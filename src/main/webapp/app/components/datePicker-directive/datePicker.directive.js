/**
 * Created by whjang on 2016-07-05.
 */

'use strict';

angular.module('wmsApp')
    .directive('datePicker', datePicker);

datePicker.$inject=['$log'];

function datePicker($log) {

    return {
        restrict: 'E',
        required : ["ngModel", "datePickerModel"],
        scope: {
            datePickerModel : '=datePickerModel',
            selectedDate : '=ngModel'
        },
        replace : false,
        templateUrl : 'app/components/datePicker-directive/datePicker.html',
        controller : ['$scope', '$element', '$attrs', '$rootScope', function ($scope, $element, $attrs, $rootScope) {
            $scope.date = $scope.selectedDate;
            $scope.isValid = true;

            $scope.openCalendar = function(){
                $scope.datePickerModel.open = true;
            };

            $scope.validation = function() {

                var regexDate = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
                var regexDateTime = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;

                return regexDate.test($scope.selectedDate);
            };

            $scope.updateValue = function(value) {
                $scope.selectedDate = value;
                $scope.isValid = $scope.validation();

                var linkedPicker = $scope.datePickerModel.linkedPicker;

                if($scope.isValid) {
                    if(linkedPicker.type == 'minDate') {
                        linkedPicker.model.option.minDate = new Date(value);
                    } else if(linkedPicker.type == 'maxDate') {
                        linkedPicker.model.option.maxDate = new Date(value);
                    }
                }
            }
        }],
        link: function (scope, element, attrs) {

            $(element).find("input").change(function() {
                scope.updateValue($(this).val());
            });
            $(element).find("input").keyup(function() {
                scope.updateValue($(this).val());
            });
            $(element).find("input").blur(function() {
                scope.updateValue($(this).val());
            });
        }
    }
}
