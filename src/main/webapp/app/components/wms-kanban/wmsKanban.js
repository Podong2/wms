/**
 * Created by whjang on 2016-07-12.
 */
(function() {
    'use strict';

    angular.module('wmsApp')
        .directive('wmsKanban', wmsKanban);

    wmsKanban.$inject = ['$log'];

    function wmsKanban($log) {

        return {
            restrict: 'E',
            scope: {
                kanbanScope: "=",
                boardList: "=",
                addBoardFunction: "=",
                addCardFunction: "="
            },
            replace: false,
            templateUrl: 'app/components/wms-kanban/wmsKanban.html',
            controller: ['$scope', '$element', '$attrs', '$rootScope', '$filter', function ($scope, $element, $attrs, $rootScope, $filter) {

                $scope.kanbanScope = $scope;
                $scope.viewType = 'card';

                $scope.changeListView = function() {
                    if($scope.viewType == 'card')
                        $scope.viewType = 'list';
                    else
                        $scope.viewType = 'card';
                };

                $scope.sortKanbanCards = function(list) {
                    list.tasks = $filter('orderBy')(list.tasks, "name", false);
                };

                $scope.addKanbanCards = function(index, task) {

                    if(task == null)
                        task = {name:"태스크 임시", assignee: "담당자1",  status:"status1"};

                    $scope.boardList[index].tasks.push(task);
                };

                $scope.removeCard = function(list, task) {

                    var index = list.tasks.indexOf(task);

                    list.tasks.splice(index, 1);
                };

                $scope.addKanbanList = function(index) {

                    var status4 = {
                        label: "상태"+($scope.boardList.length+1),
                        allowedStatus: ['status1','status2','status3'],
                        tasks: [
                            {name: "태스크13", assignee: "담당자2", status: "status1"},
                            {name: "태스크14", assignee: "담당자2", status: "status1"},
                            {name: "태스크15", assignee: "담당자1", status: "status1"}
                        ]
                    };

                    if(index == null)
                        $scope.boardList.push(status4);
                    else
                        $scope.boardList.splice((index+1), 0, status4);
                };
            }],
            link: function (scope, element, attrs) {

            }
        }
    }
})();
