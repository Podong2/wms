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

            $scope.openCalendar = function(){
                $scope.datePickerModel.open = true;
            }
        }],
        link: function (scope, element, attrs) {

            $(element).find("input").change(function() {
                scope.selectedDate = $(this).val();
            });
            $(element).find("input").keyup(function() {
                scope.selectedDate = $(this).val();
            });
            $(element).find("input").blur(function() {
                scope.selectedDate = $(this).val();
            });
        }
    }
}
