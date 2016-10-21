/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("projectInfoCtrl", projectInfoCtrl);
projectInfoCtrl.$inject=['$scope', 'Code', '$log', 'Task', 'AlertService', 'ParseLinks', '$rootScope', '$state', 'ProjectInfo', '$stateParams', 'toastr', 'ProjectTasks', 'PaginationUtil', 'TaskCreateByProject', 'projectStatistics', 'projectTaskList'];
        function projectInfoCtrl($scope, Code, $log, Task, AlertService, ParseLinks, $rootScope, $state, ProjectInfo, $stateParams, toastr, ProjectTasks, PaginationUtil, TaskCreateByProject, projectStatistics, projectTaskList) {
            var vm = this;
            vm.baseUrl = window.location.origin;
            //vm.codes = Code.query();

            vm.projectTaskAdd = projectTaskAdd;
            vm.getTaskListInProject = getTaskListInProject;
            vm.initProjectTaskList = initProjectTaskList;
            vm.taskInputFunction = taskInputFunction;
            vm.findTasks = findTasks;
            vm.getTaskListInProjectFilter = getTaskListInProjectFilter;
            //vm.showDetail = showDetail;
            vm.codes = [{"id":'', "name":"선택"},{"id":1,"name":"활성"},{"id":2,"name":"완료"},{"id":3,"name":"보류"},{"id":4,"name":"취소"}];
            vm.orderTypes = [{"id":'', "name":"선택"},{"id":'IMPORTANT',"name":"중요도"},{"id":'TASK_NAME',"name":"텍스트 오름 차순"}];
            vm.sortType="1";
            vm.projectInfoViewYn = false;
            vm.firstLoding = false; // 처음 로딩 유무
            vm.pageType = 'project';
            vm.counts = { // 차트 카운트
                delayedCount : 0,
                holdCount : 0,
                inProgressCount : 0,
                completeCount : 0,
                cancelCount : 0
            };

            // page 파라미터
            vm.params = {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            };

            // 작업 목록 스크롤 로딩
            $scope.taskScroll= {
                loading : false
            }

            vm.page =  PaginationUtil.parsePage(vm.params.page.value);
            vm.sort =  vm.params.sort.value;
            vm.predicate =  PaginationUtil.parsePredicate(vm.params.sort.value);
            vm.ascending =  PaginationUtil.parseAscending(vm.params.sort.value);
            vm.search =  vm.params.search;

            vm.tasks=[]; // 총 목록
            vm.projectTeam = [];// 프로젝트 팀원 (중복제거)
            vm.statusId = 1;
            vm.taskAdd = false;
            vm.taskSearch = false;
            vm.orderType = '';
            vm.listType = '';
            vm.statusType = '';
            vm.dDay = '';
            vm.scrollLoderYn = true; // 스크롤 시 결과값이 있으면 true 결과 값이 없으면 false를 주어 반복로딩을 막는다.

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
                    vm.page = 1;
                    vm.tasks=[];
                    vm.scrollLoderYn = true;
                    getList();
                }
            });
            $scope.$watchCollection('vm.orderType', function(newValue, oldValue){
                if(newValue != undefined && oldValue != newValue) {
                    $scope.chartFilterYn = false;
                    vm.page = 1;
                    vm.tasks=[];
                    vm.scrollLoderYn = true;
                    getList();
                }
            });

            // 프로젝트 타스크 목록 스크롤
            function getTaskListInProject(listType){
                vm.listType = listType;
                vm.reloadYn =false;
                $scope.chartFilterYn = false;
                if(vm.scrollLoderYn) getList();
            }

            // 프로젝트 타스크 목록 필터
            function getTaskListInProjectFilter(listType){
                vm.listType = listType;
                vm.reloadYn =false;
                $scope.chartFilterYn = false;
                vm.scrollLoderYn = true;
                vm.tasks=[];
                vm.page = 1;
                getList();
            }


            vm.listType = 'TOTAL'

            function getList(){
                $log.debug("검색 필터 projectId : ", $stateParams.id)
                $log.debug("검색 필터 vm.listType : ", vm.listType)
                $log.debug("검색 필터 vm.statusId : ", vm.statusId)
                $log.debug("검색 필터 vm.statusType : ", vm.statusType)
                $log.debug("검색 필터 vm.orderType : ", vm.orderType)
                $log.debug("검색 필터 vm.page : ", vm.page)
                ProjectInfo.get({
                    projectId : $stateParams.id,
                    listType : vm.listType,
                    statusId : vm.statusId,
                    orderType : vm.orderType,
                    statusType : vm.statusType,
                    taskName : vm.taskName,
                    page: vm.page - 1,
                    size: 15,
                    sort: 'desc'
                }, onInfoSuccess, onError);

            }
            function onInfoSuccess(data){
                vm.data = data;
                $log.debug("프로젝트 정보 : ", data);
                ProjectTasks.query({
                    projectId : $stateParams.id,
                    listType : vm.listType,
                    statusId : vm.statusId,
                    orderType : vm.orderType,
                    statusType : vm.statusType,
                    taskName : vm.taskName,
                    page: vm.page -1,
                    size: 15,
                    sort: 'desc'
                }, getTaskSuccess, onError)
            }
            function getTaskSuccess(tasks){
                vm.data.tasks = tasks;
                if(vm.data.tasks.length == 0) vm.scrollLoderYn = false;
                $log.debug("프로젝트 작업 정보 : ", tasks);
                onSuccess(vm.data);
            }


            function findTasks(){
                ProjectTasks.query({
                    projectId : $stateParams.id,
                    listType : vm.listType,
                    statusId : vm.statusId,
                    orderType : vm.orderType,
                    statusType : vm.statusType,
                    taskName : vm.taskName,
                    page: 0,
                    size: 99999,
                    sort: 'desc'
                }, findTaskSuccess, onError)
            }
            function findTaskSuccess(tasks){
                vm.tasks = tasks;
                vm.scrollLoderYn = false;
                $log.debug("프로젝트 작업 정보 : ", tasks);
            }

            //getList();
            vm.data = projectStatistics;
            vm.data.tasks = projectTaskList;
            $log.debug("project Info : ", vm.data);
            onSuccess(vm.data);

            vm.reloadYn = false;
            $scope.$on("projectReload", function(event, args){
                vm.reloadYn = true;
                ProjectInfo.get({
                    projectId : $stateParams.id,
                    listType : vm.listType,
                    statusId : vm.statusId,
                    orderType : vm.orderType,
                    statusType : vm.statusType,
                    page: 0,
                    size: 15*(vm.page -1),
                    sort: 'desc'
                }, onSuccess, onError);
                //getList();
            });

            //function showDetail(id){
            //    $rootScope.$broadcast("showDetail", { id : id });
            //}
            function onSuccess(data, headers) {
                $log.debug("프로젝트 및 작업 정보 : ", data);
                if(vm.page == 1 || vm.reloadYn) vm.tasks=[];
                vm.info = _.clone(data);
                vm.project = data.project;
                angular.forEach(data.tasks, function(task){
                    vm.tasks.push(task);
                });
                vm.counts.delayedCount = data.delayedCount;
                vm.counts.holdCount = data.holdCount;
                vm.counts.inProgressCount = data.inProgressCount;
                vm.counts.completeCount = data.completeCount;
                vm.counts.cancelCount = data.cancelCount;
                if(!vm.firstLoding){
                    $state.go("my-project.detail", {project : vm.project});
                }
                vm.firstLoding = true;
                $scope.taskScroll.loading = false;
                if(!vm.reloadYn)vm.page++; //다음페이지 준비
                vm.reloadYn = false;

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

                /* 프로젝트 남을 날짜 계산 */
                var day = new Date();
                var endDate = new Date(vm.project.endDate);
                var btDay = (endDate.getTime() - day.getTime()) / (1000*60*60*24) ;
                vm.dDay = btDay > 0 ? Math.round(btDay) <= 0 ? 0 : Math.round(btDay) : '0';


                vm.coumplatePercent= {
                    width : vm.tasks.length == 0 ? '0%' : Math.floor(vm.info.completeCount / vm.tasks.length * 100) + '%'
                };

                $log.debug("vm.counts ", vm.counts)
                $scope.pieData = [
                    {
                        key: "지연",
                        y: vm.counts.delayedCount,
                        color : '#FF6161',
                        callback: function () {
                            chartFiltering('DELAYED');
                        }
                    },
                    {
                        key: "보류",
                        y: vm.counts.holdCount,
                        color : '#E663FF',
                        callback: function () {
                            chartFiltering('HOLD');
                        }
                    },
                    {
                        key: "진행",
                        y: vm.counts.inProgressCount,
                        color : '#5B79FF',
                        callback: function () {
                            chartFiltering('IN_PROGRESS');
                        }
                    },
                    {
                        key: "완료",
                        y: vm.counts.completeCount,
                        color : '#60FF5A',
                        callback: function () {
                            chartFiltering('COMPLETE');
                        }
                    },
                    {
                        key: "취소",
                        y: vm.counts.cancelCount,
                        color : '#BFBFBF',
                        callback: function () {
                            chartFiltering('CANCEL');
                        }
                    }
                ];

                $scope.pieOptions = {
                    chart: {
                        type: 'pieChart',
                        height: 200,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        showLabels: true, //그래프 내에 표시될 텍스트 노출 유무
                        duration: 500,
                        donut : true,
                        title: "총 "+(vm.counts.delayedCount + vm.counts.holdCount + vm.counts.inProgressCount + vm.counts.completeCount + vm.counts.cancelCount)+"건",
                        labelThreshold: 0.01,
                        labelSunbeamLayout: false, // 그래프 내 텍스트 회전 옵션
                        showLegend: false,
                        growOnHover : false
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
                vm.page = 1;
                $scope.chartFilterYn = true;
                $scope.holdYn = false;
                $scope.inProgressYn = false;
                $scope.completeYn = false;
                $scope.delayYn = false;
                vm.scrollLoderYn = true;
                if(type == 'DELAYED'){
                    $scope.delayYn = true;
                }else if(type == 'COMPLETE'){
                    $scope.completeYn = true;
                }else if(type == 'HOLD'){
                    $scope.holdYn = true;
                }else if(type == 'IN_PROGRESS'){
                    $scope.inProgressYn = true;
                }else if(type == 'CANCEL'){
                    $scope.cancelYn = true;
                }
                vm.statusType = type;
                $scope.$apply();
                getList();
            }

            vm.task = {
                name : '',
                projectId : $stateParams.id
            }

            /*  */
            function projectTaskAdd(){
                projectIdPush()
                if(vm.task.name != '') {
                    TaskCreateByProject.save({name : vm.task.name, projectId : vm.task.projectId}, onSaveSuccess, onSaveError);
                }
            }
            function onSaveSuccess (result) {
                vm.reloadYn = true;
                vm.taskAdd = false;
                vm.page = 1;
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

            // 프로젝트 작업 목록 초기화
            function initProjectTaskList(){
                vm.tasks=[];
                vm.page = 1;
                vm.scrollLoderYn = true;
                if(vm.statusId != '' || vm.orderType != ''){
                    vm.listType = 'TOTAL';
                    vm.statusId = '';
                    vm.orderType = '';
                }else{
                    getList();
                }
            }
            function taskInputFunction(type){
                if(type == 'add'){
                    vm.taskAdd = vm.taskAdd ? false : true;
                    vm.taskSearch = false;
                    vm.taskName = '';
                }else{
                    vm.taskAdd = false;
                    vm.taskSearch = vm.taskSearch ? false : true;
                    vm.taskName = vm.taskSearch ? vm.taskName : '';
                }
            }




        }
