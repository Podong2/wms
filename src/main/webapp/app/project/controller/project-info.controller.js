/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("projectInfoCtrl", projectInfoCtrl);
projectInfoCtrl.$inject=['$scope', 'Code', '$log', 'Task', 'AlertService', 'ParseLinks', '$rootScope', '$state', 'ProjectInfo', '$stateParams', 'toastr', 'projectForm'];
        function projectInfoCtrl($scope, Code, $log, Task, AlertService, ParseLinks, $rootScope, $state, ProjectInfo, $stateParams, toastr, projectForm) {
            var vm = this;
            vm.baseUrl = window.location.origin;
            //vm.codes = Code.query();

            vm.projectTaskAdd = projectTaskAdd;
            vm.getTaskListInProject = getTaskListInProject;
            //vm.showDetail = showDetail;
            vm.codes = [{"id":'', "name":"선택"},{"id":1,"name":"활성"},{"id":2,"name":"완료"},{"id":3,"name":"보류"},{"id":4,"name":"취소"}]
            vm.orderTypes = [{"id":'', "name":"선택"},{"id":'IMPORTANT',"name":"중요도"},{"id":'TASK_NAME',"name":"텍스트 오름 차순"}];
            vm.sortType="1";

            vm.tasks=[]; // 총 목록
            vm.projectTeam = [];// 프로젝트 팀원 (중복제거)
            vm.statusId = '';
            vm.taskAdd = false;
            vm.orderType = '';
            vm.listType = '';

            // 작업 목록 필터값
            $scope.chartFilterYn = false;
            $scope.completeYn = true;
            $scope.delayYn = true;
            $scope.holdYn = true;
            $scope.inProgressYn = true;


            /* layout config option */
            $scope.status = {
                isCustomHeaderOpen: false,
                isDelayedOpen: true,
                isRegisteredTodayOpen: true,
                inProgressOpen: true,
                isNoneScheduledOpen: true,
                isScheduledTodayOpen: true,
                isScheduledOpen: true,
                isCompleteOpen: true,
                isHoldOpen: true,
                isCancelOpen: true,
                isFirstDisabled: false
            };

            $scope.$watchCollection('vm.statusId', function(newValue, oldValue){
                if(newValue != undefined && oldValue != newValue) {
                    $scope.chartFilterYn = false;
                    getList();
                }
            });
            $scope.$watchCollection('vm.orderType', function(newValue, oldValue){
                if(newValue != undefined && oldValue != newValue) {
                    $scope.chartFilterYn = false;
                    getList();
                }
            });

            // 프로젝트 타스크 목록 필터
            function getTaskListInProject(listType){
                vm.listType = listType;
                $scope.chartFilterYn = false;
                getList();
            }


            vm.listType = 'TOTAL'
            function getList(){
                ProjectInfo.get({projectId : $stateParams.id, listType : vm.listType, statusId : vm.statusId, orderType : vm.orderType}, onSuccess, onError);
            }
            //getList();
            onSuccess(projectForm)

            vm.reloadYn = false;
            $scope.$on("projectReload", function(event, args){
                vm.reloadYn = true;
                getList();
            });

            //function showDetail(id){
            //    $rootScope.$broadcast("showDetail", { id : id });
            //}
            function onSuccess(data, headers) {
                $log.debug("data", data);
                vm.tasks=[]; vm.delayed=[]; vm.scheduledToday=[]; vm.registeredToday=[]; vm.inProgress=[]; vm.noneScheduled=[]; vm.complete=[]; vm.hold=[]; vm.scheduled=[];  vm.cancel=[];
                vm.project = data.project;
                vm.info = data;
                angular.forEach(data.tasks, function(task){
                    if(task.statusGroup == "DELAYED") vm.delayed.push(task);
                    if(task.statusGroup == "SCHEDULED_TODAY") vm.scheduledToday.push(task);
                    if(task.statusGroup == "REGISTERED_TODAY") vm.registeredToday.push(task);
                    if(task.statusGroup == "IN_PROGRESS") vm.inProgress.push(task);
                    if(task.statusGroup == "NONE_SCHEDULED") vm.noneScheduled.push(task);
                    if(task.statusGroup == "SCHEDULED") vm.scheduled.push(task); // 예정
                    if(task.statusGroup == "HOLD") vm.hold.push(task);  //보류
                    if(task.statusGroup == "COMPLETE") vm.complete.push(task); // 완료
                    if(task.statusGroup == "CANCEL") vm.cancel.push(task); // 완료
                    vm.tasks.push(task);
                });
                $state.go("my-project.detail", {project : vm.project});

                //vm.page = pagingParams.page;

                // 프로젝트 팀원 중복제거
                vm.projectTeam = _.clone(vm.project.projectAdmins);
                var overlapYn = true;
                angular.forEach(vm.project.projectUsers, function(user, index){
                    angular.forEach(vm.projectTeam, function(admin, index){
                        if(user.id == admin.id){
                            overlapYn = false;
                        }
                    });
                    if(overlapYn) vm.projectTeam.push(user);
                    overlapYn = true;
                });


                vm.coumplatePercent= {
                    width : vm.tasks.length == 0 ? '0%' : Math.floor(vm.info.completeCount / vm.tasks.length * 100) + '%'
                };

                $scope.pieData = [
                    {
                        key: "지연",
                        y: vm.info.delayedCount,
                        callback: function () {
                            chartFiltering('delay');
                        }
                    },
                    {
                        key: "보류",
                        y: vm.info.holdCount,
                        callback: function () {
                            chartFiltering('hold');
                        }
                    },
                    {
                        key: "진행",
                        y: vm.info.inProgressCount,
                        callback: function () {
                            chartFiltering('inProgress');
                        }
                    },
                    {
                        key: "완료",
                        y: vm.info.completeCount,
                        callback: function () {
                            chartFiltering('complete');
                        }
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
                        title: "총 "+(vm.info.delayedCount + vm.info.holdCount + vm.info.inProgressCount + vm.info.completeCount)+"건",
                        labelThreshold: 0.01,
                        labelSunbeamLayout: false, // 그래프 내 텍스트 회전 옵션
                        showLegend: false
                        // legend: {
                        //     margin: {
                        //         top: 5,
                        //         right: 35,
                        //         bottom: 5,
                        //         left: 0
                        //     }
                        // }
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
            function onError(error) {
                AlertService.error(error.data.message);
            }


            function chartFiltering(type){
                $scope.chartFilterYn = true;
                $scope.holdYn = false;
                $scope.inProgressYn = false;
                $scope.completeYn = false;
                $scope.delayYn = false;
                if(type == 'delay'){
                    $scope.delayYn = true;
                }else if(type == 'complete'){
                    $scope.completeYn = true;
                }else if(type == 'hold'){
                    $scope.holdYn = true;
                }else if(type == 'inProgress'){
                    $scope.inProgressYn = true;
                }
                $scope.$apply()
            }

            vm.task = {
                name : '',
                projectId : $stateParams.id
            }
            function projectTaskAdd(){
                projectIdPush()
                if(vm.task.name != '') Task.save({name : vm.task.name, projectId : vm.task.projectId}, onSaveSuccess, onSaveError);
            }
            function onSaveSuccess (result) {
                vm.reloadYn = true;
                vm.taskAdd = false;
                $log.debug("프로젝트 타스크 생성 결과 : ", result);
                toastr.success('태스크 생성 완료', '태스크 생성 완료');
                getList();
                $state.go('my-project.taskDetail', {taskId : result.id, listType : vm.listType, projectId : vm.project.id});
            }
            function onSaveError () {
            }
            // 타스크에 프로젝트 아이디 주입
            function projectIdPush(ids){
                var typeIds = [];
                    typeIds.push(vm.project.id);
                vm.task.projectIds = typeIds.join(",");
            }




        }
