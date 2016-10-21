(function(window, undefined) {'use strict';
/* *
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */



angular.module('wms.widget.myTaskList', ['adf.provider'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('myTaskList', {
        title: '내 작업 목록',
        subject: '내 작업 목록',
        description: '내 작업 목록을 확인 할 수 있습니다.',
        templateUrl: 'app/components/wms-chart/widgets/my-task-list/widgetMyTaskListTemplate.html',
        edit: {
          templateUrl: '{widgetsPath}/task/src/edit.html',
          controller: 'myTaskListCtrl',
          controllerAs : 'vm'
        }
      });
  }]).controller('myTaskListCtrl', ["$scope", 'DashboardMyTask', '$log', 'TaskInfo', '$state', function($scope, DashboardMyTask, $log, TaskInfo, $state){
    var vm = this;
    vm.baseUrl = window.location.origin;
    vm.getTodayTask = getTodayTask;
    vm.taskTypeChange = taskTypeChange;
    vm.openTaskPopup = openTaskPopup;
    vm.listType = "TODAY";
    vm.pageType = 'task';
    vm.taskType = 'ASSIGNED';

    function taskTypeChange(type){
        vm.taskType = type;
    }
    function getTodayTask(type, projectId){
        if(type !='' && type != undefined) vm.listType = type;
        DashboardMyTask.get({listType : vm.listType, projectId : projectId}, success, error)
    }
    getTodayTask();
    function success(result){
        vm.task = result;
    }
    function error(){

    }

    // 작업 상세 팝업 오픈 테스트
    function openTaskPopup(taskId, listType){
        $log.debug("taskId : ", taskId)
        TaskInfo.get({id : taskId}, successTask, erorrTask);

        //var editModalConfig = {
        //    size : "lg",
        //    url : "app/task/html/modal/taskDetailPopup.html",
        //    ctrl : "TaskDetailCtrl"
        //};
        //
        //ModalService.openModal(editModalConfig);
    }
    function successTask(result){
        $state.go("my-task.detailPopup", {task : result})
    }
    function erorrTask(){

    }


  }]);

    angular.module("wms.widget.myTaskList").
    run(["$templateCache", function($templateCache) {
      $templateCache.put("{widgetsPath}/task/src/edit.html","<form class=form-inline role=form><div>"+
          "<button type=button class=\"btn btn-primary\" ng-click=addLink()><i class=\"fa fa-plus\"></i> Add</button></form>");
    /*$templateCache.put("{widgetsPath}/chart/src/wedgetBarChartTemplate.html","<nvd3 options='barOptions' data='barData'></nvd3>");*/
    }]);
})(window);
