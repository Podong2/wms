/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("projectListCtrl", projectListCtrl);
projectListCtrl.$inject=['$scope', 'Code', '$log', 'Task', 'AlertService', 'ParseLinks', '$rootScope', '$state', 'ProjectInfo', '$stateParams', 'toastr'];
        function projectListCtrl($scope, Code, $log, Task, AlertService, ParseLinks, $rootScope, $state, ProjectInfo, $stateParams, toastr) {
            var vm = this;
            vm.projectTaskAdd = projectTaskAdd;
            //vm.showDetail = showDetail;
            vm.codes = [{"id":1,"name":"활성"},{"id":2,"name":"완료"},{"id":3,"name":"보류"},{"id":4,"name":"취소"}]
            vm.sortType="1";

            vm.tasks=[]; // 총 목록

            vm.taskAdd = false;

            /* layout config option */
            $scope.status = {
                isCustomHeaderOpen: false,
                isDelayedOpen: true,
                isScheduledTodayOpen: true,
                isScheduledOpen: true,
                isFirstDisabled: false
            };

            function getList(){
                ProjectInfo.get({projectId : $stateParams.id, listType : 'TOTAL'}, onSuccess, onError);
            }
            getList();

            //$scope.$on("taskReload", function(event, args){
            //    getList(args.listType);
            //});

            //function showDetail(id){
            //    $rootScope.$broadcast("showDetail", { id : id });
            //}

            function onSuccess(data, headers) {
                $log.debug("data", data);
                vm.tasks=[]; vm.delayed=[]; vm.scheduledToday=[]; vm.complete=[]; vm.hold=[]; vm.scheduled=[];
                vm.project = data.project;
                vm.info = data;
                angular.forEach(data.tasks, function(task){
                    if(task.statusGroup == "DELAYED") vm.delayed.push(task); //지연
                    if(task.statusGroup == "SCHEDULED_TODAY") vm.scheduledToday.push(task); // 오늘
                    if(task.statusGroup == "SCHEDULED") vm.scheduled.push(task); // 예정
                    if(task.statusGroup == "HOLD") vm.hold.push(task);  //보류
                    if(task.statusGroup == "COMPLETE") vm.complete.push(task); // 완료
                    vm.tasks.push(task);
                });
                $state.go("my-project.detail", {project : vm.project});
                //vm.page = pagingParams.page;

                $scope.pieData = [
                    {
                        key: "지연",
                        y: vm.info.delayedCount
                    },
                    {
                        key: "보류",
                        y: vm.info.holdCount
                    },
                    {
                        key: "진행",
                        y: vm.info.inProgressCount
                    },
                    {
                        key: "완료",
                        y: vm.info.completeCount
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
                        title: "총 "+vm.tasks.length+"건",
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
            function onError(error) {
                AlertService.error(error.data.message);
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
                toastr.success('태스크 생성 완료', '태스크 생성 완료');
                vm.task.id = result.id;
                vm.subTask.parentId = result.id;
                $timeout(function(){ // state reload 명령과 충돌하는 문제 때문에 설정
                    //$uibModalInstance.dismiss('cancel');
                }, 100);
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
