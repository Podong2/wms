/**
 * Created by whjang on 2016-07-08.
 */
(function() {
    'use strict';

    angular.module('wmsApp')
        .directive('wmsCalendar', wmsCalendar);

    wmsCalendar.$inject = ['$log'];

    function wmsCalendar($log) {

        return {
            restrict: 'E',
            required : ['events'],
            scope: {
                events: '=',
                clickEventFunction: '=',
                timeChangeEventFunction: '=',
                editEventFunction: '=',
                deleteEventFunction: '=',
                holidays: '='
            },
            replace: false,
            templateUrl: 'app/components/wms-calendar-directive/wmsCalendar.html',
            controller: ['$scope', '$element', '$attrs', '$rootScope', function ($scope, $element, $attrs, $rootScope) {

                $scope.calendarView = 'month';
                $scope.viewDate = new Date();

                $scope.toggle = function($event, field, event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    event[field] = !event[field];
                };

                $scope.cellModifier = function(cell) {

                    if (cell.isWeekend) {
                        cell.cssClass = 'cell-weekend';
                    } else {

                        if($scope.holidays != undefined && $scope.holidays.length > 0) {
                            if($scope.holidays.indexOf(cell.date.format("MM-DD")) != -1) {
                                cell.cssClass = 'cell-holiday';
                            }
                        }
                    }
                };

            }],
            link: function (scope, element, attrs) {

            }
        }
    }
})();
