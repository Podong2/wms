/**
 * Created by whjang on 2016-07-05.
 */
(function() {
    'use strict';

    angular.module('wmsApp')
        .directive('wmsTreeTable', wmsTreeTable)
        .directive('dynamicTreeCtrl',dynamicTreeCtrl);

    wmsTreeTable.$inject = ['$log'];
    dynamicTreeCtrl.$inject = ['$compile', '$parse'];

    function wmsTreeTable($log) {

        return {
            restrict: 'E',
            scope: {
                ngModel: '=ngModel',
                tableConfigs: '=tableConfigs',
                updateCallback: '=updateCallback',
                controllerName : '@'
            },
            replace: false,
            templateUrl: 'app/components/wms-table-directive/wmsTreeTable.html',
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

                $scope.my_tree_grid = {};
                $scope._filter = {};
                $scope.orderBy = '';
                $scope.enableModify = true;
                $scope._enableClone = false;
                $scope.expandAll = function () {
                    $scope.my_tree_grid.expand_all();
                };

                $scope.collapseAll = function () {
                    $scope.my_tree_grid.collapse_all();
                };

                $scope.addChildFunction = function(node) {
                    $log.debug(node);
                };

                $scope.addNode = function(childNode) {
                    var node = $scope.my_tree_grid.get_selected_node();

                    if(node != null)
                        childNode.parentId = node.id;

                    $scope.my_tree_grid.add_node(node, childNode);
                };

                $scope.expanding_property = {
                    field:       'name',
                    titleClass:  'text-center',
                    cellClass:   'v-middle',
                    displayName: 'Name'
                };

                if ($scope.disabled == 'true') {
                    $scope.enableModify = false;
                }

                $scope.treeScope = $scope;

                // linear 한 data 구조의 json 을 tree 형태의 json 구조로 변환
            }],
            link: function (scope, element, attrs) {

            }
        }
    }

    function dynamicTreeCtrl($compile, $parse) {
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
