/**
 * Created by whjang on 2016-07-05.
 */
(function() {
    'use strict';

    angular.module('wmsApp')
        .directive('wmsCollapseTable', wmsCollapseTable);

    wmsCollapseTable.$inject = ['$log'];

    function wmsCollapseTable($log) {

        return {
            restrict: 'E',
            scope: {
                ngModel: '=ngModel',
                tableConfigs: '=tableConfigs',
                updateCallback: '=updateCallback'
            },
            replace: false,
            templateUrl: 'app/components/wms-table-directive/wmsCollapseTable.html',
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
})();
