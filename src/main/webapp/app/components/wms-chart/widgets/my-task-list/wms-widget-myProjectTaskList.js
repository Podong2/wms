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



angular.module('wms.widget.myProjectTaskList', ['adf.provider'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('myProjectTaskList', {
        title: '내 프로젝트 작업 목록',
        subject: 'myProjectTaskList',
        description: '내 작업 목록을 확인 할 수 있습니다.',
        templateUrl: 'app/components/wms-chart/widgets/my-task-list/widgetMyProjectTaskListTemplate.html',
        edit: {
          templateUrl: '{widgetsPath}/task/src/edit.html',
          controller: 'myProjectTaskListCtrl',
          controllerAs : 'vm'
        }
      });
  }]).controller('myProjectTaskListCtrl', ["$scope", 'DashboardMyTask', '$log', 'Project', function($scope, DashboardMyTask, $log, Project){
    var vm = this;
    vm.getTodayTask = getTodayTask;
    vm.taskTypeChange = taskTypeChange;
    vm.listType = "TODAY";
    vm.taskType = 'ASSIGNED';
    vm.projectList=[{
        contents:null,
        endDate:'',
        folderYn:false,
        id:'',
        name:"선택하세요"
    }];
    vm.projectId= '';
    function taskTypeChange(type){
        vm.taskType = type;
    }
    function getTodayTask(type, projectId){
        if(type !='' && type != undefined) vm.listType = type;
        DashboardMyTask.get({listType : vm.listType, projectId : vm.projectId}, success, error)
    }
    function success(result){
        vm.task = result;
    }
    function error(){

    }

    function getProjectList(){
        Project.query({}, onSuccess, onError);
    }

    function onSuccess (result) {
        angular.forEach(result, function(val){
            vm.projectList.push(val);
        })

        //$rootScope.$broadcast('projectListLoading')
    }
    function onError (result) {
    }

    $scope.$watchCollection('vm.projectId', function(oldValue, newValue){
        DashboardMyTask.get({listType : vm.listType, projectId : vm.projectId}, success, error)
    });

    getTodayTask(); //오늘 작업
    getProjectList(); // 프로젝트 목록(최상위 프로젝트만 씀)


  }]);

    angular.module("wms.widget.myProjectTaskList").
    run(["$templateCache", function($templateCache) {
      $templateCache.put("{widgetsPath}/task/src/edit.html","<form class=form-inline role=form><div>"+
          "<button type=button class=\"btn btn-primary\" ng-click=addLink()><i class=\"fa fa-plus\"></i> Add</button></form>");
    /*$templateCache.put("{widgetsPath}/chart/src/wedgetBarChartTemplate.html","<nvd3 options='barOptions' data='barData'></nvd3>");*/
    }]);
})(window);
