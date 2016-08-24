/**
 * Created by whjang on 2016-07-05.
 */
(function() {
    'use strict';

    angular.module('wmsApp')
        .directive('wmsTable', wmsTable)
        .directive('dynamicCtrl',dynamicCtrl);

    wmsTable.$inject = ['$log'];
    dynamicCtrl.$inject = ['$compile', '$parse'];

    function wmsTable($log) {

        return {
            restrict: 'E',
            scope: {
                ngModel: '=ngModel',
                tableConfigs: '=tableConfigs',
                updateCallback: '=updateCallback',
                controllerName : '@'
            },
            replace: false,
            templateUrl: 'app/components/wms-table-directive/wmsTable.html',
            controller: ['$scope', '$element', '$attrs', '$rootScope', 'tableService', function ($scope, $element, $attrs, $rootScope, tableService) {

                $scope.tableService = tableService;
                $scope._tableConfigs = [];

                function loadTableConfigs() {
                    angular.forEach($scope.tableConfigs, function(config) {
                        $scope._tableConfigs.push(angular.copy(config));
                    });
                }

                $scope._updateCallback = function(row) {
                    $scope._tableConfigs = [];
                    loadTableConfigs();

                    $scope.updateCallback(row);
                };

                $scope.getData = function() {
                    return $scope.ngModel;
                };

                loadTableConfigs();
            }],
            link: function (scope, element, attrs) {

            }
        }
    }

    function dynamicCtrl($compile, $parse) {
        return {
            restrict: 'A',
            terminal: true,
            priority: 100000,
            link: function(scope, elem) {
                var name = $parse(elem.attr('dynamic-ctrl'))(scope);
                elem.removeAttr('dynamic-ctrl');
                elem.attr('ng-controller', name);
                $compile(elem)(scope);
            }
        };
    }
})();
