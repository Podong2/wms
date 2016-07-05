/**
 * Created by whjang on 2016-07-05.
 */

'use strict';

angular.module('wmsApp')
    .directive('periodDatePicker', periodDatePicker);

periodDatePicker.$inject=['$timeout', '$log'];

function periodDatePicker($timeout, $log) {

    return {
        restrict: 'E',
        required: ['fromDate', 'fromDateModel', 'toDate', 'toDateModel'],
        scope: {
            fromDate : '=fromDate',
            fromDateModel : '=fromDateModel',
            toDate : '=toDate',
            toDateModel : '=toDateModel'
        },
        replace : false,
        templateUrl : 'app/components/datePicker-directive/periodDatePicker.html',
        controller : ['$scope', '$element', '$attrs', '$rootScope', function ($scope, $element, $attrs, $rootScope) {

            $scope.$watch(function() {
                return [$scope.fromDate];
            }, function() {
                $scope.toDateModel.option.minDate = new Date($scope.fromDate);
            }, true);

            $scope.$watch(function() {
                return [$scope.toDate];
            }, function() {
                $scope.fromDateModel.option.maxDate = new Date($scope.toDate);
            }, true);

        }],
        link: function (scope, element, attrs) {
            $('body').click(function (e) {

                var target = $(element).find('.editSection');

                if (target.addClass("on")) {
                    if (!$(element).has(e.target).length) {
                        target.removeClass("on");
                    }
                }
            });
            element.on('click', function(_this) {
                $timeout(function () {
                    $(element).find("input[name=datePicker]:eq(0)").focus();
                }, 200);
            });
        }
    }
}
