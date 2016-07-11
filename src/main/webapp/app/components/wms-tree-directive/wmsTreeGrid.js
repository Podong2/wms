/**
 * Created by whjang on 2016-07-05.
 */
(function() {
    'use strict';

    angular.module('wmsApp')
        .directive('wmsTreeGrid', wmsTreeGrid);

    wmsTreeGrid.$inject = ['$log'];

    function wmsTreeGrid($log) {

        return {
            restrict: 'E',
            scope: {
                treeScope: "=treeScope",
                treeModel: '=treeModel',
                columnDefinitions: "=columnDefinitions",
                disabled: '@disabled',
                enableFilter: '@enableFilter',
                enableSort: '@enableSort',
                enableClone: '@enableClone'
            },
            replace: false,
            templateUrl: 'app/components/wms-tree-directive/wmsTreeGrid.html',
            controller: ['$scope', '$element', '$attrs', '$rootScope', '$TreeDnDConvert', function ($scope, $element, $attrs, $rootScope, $TreeDnDConvert) {

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

                if ($scope.enableClone == 'true') {
                    $scope._enableClone = false;
                }

                if ($scope.enableSort == 'true') {
                    $scope.orderBy = 'name';
                }

                $scope.treeScope = $scope;

                // linear 한 data 구조의 json 을 tree 형태의 json 구조로 변환
                $scope.tree_data = $TreeDnDConvert.line2tree($scope.treeModel, 'id', 'parentId');
            }],
            link: function (scope, element, attrs) {

                element.find('tree-dnd').bind("keydown keypress", function (event) {
                    scope.$apply(function () {
                        if (event.keyCode === 40) {
                            scope.my_tree_grid.select_next_node();
                            event.preventDefault();
                        } else if (event.keyCode === 38) {
                            scope.my_tree_grid.select_prev_node();
                            event.preventDefault();
                        } else if (event.keyCode === 46) {
                            scope.my_tree_grid.remove_node();
                            event.preventDefault();
                        } else if (event.keyCode === 37) {
                            var node = scope.my_tree_grid.get_selected_node();
                            scope.my_tree_grid.collapse_node(node);
                            event.preventDefault();
                        } else if (event.keyCode === 39) {
                            var node = scope.my_tree_grid.get_selected_node();
                            scope.my_tree_grid.expand_node(node);
                            event.preventDefault();
                        }
                    });
                });
            }
        }
    }
})();
