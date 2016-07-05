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
                /*
                 (2[0-3]|[01][0-9]):[0-5][0-9]
                 */
                
                var regex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;

                return regex.test($scope.selectedDate);
            };
        }],
        link: function (scope, element, attrs) {

            $(element).find("input").change(function() {
                scope.selectedDate = $(this).val();
                scope.isValid = scope.validation();
            });
            $(element).find("input").keyup(function() {
                scope.selectedDate = $(this).val();
                scope.isValid = scope.validation();
            });
            $(element).find("input").blur(function() {
                scope.selectedDate = $(this).val();
                scope.isValid = scope.validation();
            });
        }
    }
}
