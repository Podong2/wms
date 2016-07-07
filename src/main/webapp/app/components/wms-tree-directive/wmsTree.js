/**
 * Created by whjang on 2016-07-05.
 */

'use strict';

angular.module('wmsApp')
    .directive('wmsTree', wmsTree);

wmsTree.$inject=['$log'];

function wmsTree($log) {

    return {
        restrict: 'E',
        scope: {
            treeModel : '=treeModel',
            disabled : '@disabled',
            enableFilter : '@enableFilter',
            enableSort : '@enableSort',
            enableClone : '@enableClone'
        },
        replace : false,
        templateUrl : 'app/components/wms-tree-directive/wmsTree.html',
        controller : ['$scope', '$element', '$attrs', '$rootScope', '$TreeDnDConvert', function ($scope, $element, $attrs, $rootScope, $TreeDnDConvert) {

            var tree;
            $scope.my_tree = tree = {};
            $scope._filter = {};
            $scope.orderBy = '';
            $scope.enableModify = true;
            $scope._enableClone = false;
            $scope.expandAll = function() {
                $scope.my_tree.expand_all();
            };

            $scope.collapseAll = function() {
                $scope.my_tree.collapse_all();
            };

            $scope.expanding_property = {
                field:       'name',
                titleClass:  'text-center',
                cellClass:   'v-middle'
            };

            if($scope.disabled == 'true') {
                $scope.enableModify = false;
            }

            if($scope.enableClone == 'true') {
                $scope._enableClone = false;
            }

            if($scope.enableSort == 'true') {
                $scope.orderBy = 'name';
            }

            $scope.tree_data = $TreeDnDConvert.line2tree($scope.treeModel, 'id', 'parentId');
        }],
        link: function (scope, element, attrs) {

            element.find('tree-dnd').bind("keydown keypress", function (event) {
                scope.$apply(function () {
                    if(event.keyCode === 40) {
                        scope.my_tree.select_next_node();
                    } else if(event.keyCode === 38) {
                        scope.my_tree.select_prev_node();
                    } else if(event.keyCode === 46) {
                        scope.my_tree.remove_node();
                    }
                    event.preventDefault();
                });
            });
        }
    }
}
