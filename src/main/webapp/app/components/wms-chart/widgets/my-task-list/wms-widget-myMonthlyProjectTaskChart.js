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



angular.module('wms.widget.myMonthlyProjectTaskChart', ['adf.provider'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('myMonthlyProjectTaskChart', {
        title: '이 달의 프로젝트 진척도',
        subject: '이 달의 프로젝트 진척도',
        description: '이 달의 프로젝트 진척도를 확인 할 수 있습니다.',
        templateUrl: 'app/components/wms-chart/widgets/my-task-list/widgetMyMonthlyProjectTaskChartTemplate.html',
        edit: {
          templateUrl: '{widgetsPath}/task/src/edit.html',
          controller: 'myMonthlyProjectTaskChartCtrl',
          controllerAs : 'vm'
        }
      });
  }]).controller('myMonthlyProjectTaskChartCtrl', ["$scope", 'DashboardMyTask', '$log', 'Project', 'DashboardMyTaskCount', function($scope, DashboardMyTask, $log, Project, DashboardMyTaskCount){
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
    vm.assignedPercent='';
    vm.createdPercent='';
    vm.watchedPercent='';
    function taskTypeChange(type){
        vm.taskType = type;
    }
    function getTodayTask(type, projectId){
        if(type !='' && type != undefined) vm.listType = type;
        DashboardMyTask.get({listType : vm.listType, projectId : vm.projectId}, success, error)
    }
    function getTodayTaskCount(type, projectId){
        if(type !='' && type != undefined) vm.listType = type;
        DashboardMyTaskCount.get({listType : vm.listType, projectId : vm.projectId}, successCount, error)
    }
    function successCount(result){
        vm.taskCountInfo = result;
        $log.debug("vm.taskCountInfo : ", vm.taskCountInfo)

        vm.assignedPercent= {
            width : Math.floor(vm.taskCountInfo.assignedTaskCompleteCount / vm.taskCountInfo.assignedTaskTotalCount * 100) + '%'
        }
        vm.createdPercent= {
            width : Math.floor(vm.taskCountInfo.createdTaskCompleteCount / vm.taskCountInfo.createdTaskTotalCount * 100) + '%'
        }
        vm.watchedPercent= {
            width : Math.floor(vm.taskCountInfo.watchedTaskCompleteCount / vm.taskCountInfo.watchedTaskTotalCount * 100) + '%'
        }

        $scope.pieData = [
            {
                key: "담당",
                y: vm.taskCountInfo.assignedTaskTotalCount
            },
            {
                key: "요청",
                y: vm.taskCountInfo.createdTaskTotalCount
            },
            {
                key: "참조",
                y: vm.taskCountInfo.watchedTaskTotalCount
            }
        ];

        $scope.pieOptions = {
            chart: {
                type: 'pieChart',
                height: 250,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true, //그래프 내에 표시될 텍스트 노출 유무
                duration: 500,
                donut : true,
                title: "총 "+(vm.taskCountInfo.assignedTaskTotalCount+vm.taskCountInfo.createdTaskTotalCount+vm.taskCountInfo.watchedTaskTotalCount)+"건",
                labelThreshold: 0.01,
                labelSunbeamLayout: false, // 그래프 내 텍스트 회전 옵션
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            },
            title: {
                enable: false,
                text: '파이차트'
            },
            subtitle: {
                enable: false,
                text: '타이틀',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };
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
        $log.debug("대시보드 위젯 프로젝트 목록 : ", vm.projectList);
    }
    function onError (result) {
    }

    $scope.$watchCollection('vm.projectId', function(oldValue, newValue){
        DashboardMyTaskCount.get({listType : vm.listType, projectId : vm.projectId}, successCount, error)
    });


    getTodayTask(); //오늘 작업
    getProjectList(); // 프로젝트 목록(최상위 프로젝트만 씀)
    getTodayTaskCount(); //오늘 작업 count


  }]);

    angular.module("wms.widget.myMonthlyProjectTaskChart").
    run(["$templateCache", function($templateCache) {
      $templateCache.put("{widgetsPath}/task/src/edit.html","<form class=form-inline role=form><div>"+
          "<button type=button class=\"btn btn-primary\" ng-click=addLink()><i class=\"fa fa-plus\"></i> Add</button></form>");
    /*$templateCache.put("{widgetsPath}/chart/src/wedgetBarChartTemplate.html","<nvd3 options='barOptions' data='barData'></nvd3>");*/
    }]);
})(window);
