/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("projectListCtrl", projectListCtrl);
projectListCtrl.$inject=['$scope', 'Code', '$log', 'Task', 'AlertService', '$rootScope', '$state', 'ProjectList', '$stateParams', 'toastr', 'tableService'];
        function projectListCtrl($scope, Code, $log, Task, AlertService, $rootScope, $state, ProjectList, $stateParams, toastr, tableService) {
            var vm = this;
            vm.baseUrl = window.location.origin;

            $log.debug("$stateParams : ", $stateParams)

            vm.codes = [{"id":'', "name":"전체"},{"id":1,"name":"활성"},{"id":2,"name":"완료"},{"id":3,"name":"보류"},{"id":4,"name":"취소"}];
            vm.orderTypes = [{"id":'MODIFIED_DATE', "name":"최근 업데이트순"},{"id":'TEXT_ASC',"name":"텍스트 내림차순"},{"id":'TEXT_DESC',"name":"텍스트 오름차순"}];
            vm.projectTeam = [];// 프로젝트 팀원 (중복제거)
            vm.projectList = [];
            vm.responseData = [];
            vm.projects = [];
            vm.childs = [];
            vm.statusId = $stateParams.statusId == '' ? '' : $stateParams.statusId;
            vm.orderType = $stateParams.orderType == '' ? 'MODIFIED_DATE' : $stateParams.orderType;

            $scope.$watchCollection('vm.statusId', function(newValue, oldValue){
                if(newValue != undefined && oldValue != newValue) {
                    //ProjectList.query({statusId : vm.statusId, orderType : vm.orderType}, onSuccess, onError);
                    $state.go("my-project-list", {statusId : vm.statusId, orderType : vm.orderType}, {reload : "my-project-list"})
                }
            });
            $scope.$watchCollection('vm.orderType', function(newValue, oldValue){
                if(newValue != undefined && oldValue != newValue) {
                    //ProjectList.query({statusId : vm.statusId, orderType : vm.orderType}, onSuccess, onError);
                    $state.go("my-project-list", {statusId : vm.statusId, orderType : vm.orderType}, {reload : "my-project-list"})
                }
            });

            function getList(){
                ProjectList.query({statusId : vm.statusId, orderType : vm.orderType}, onSuccess, onError);
            }
            getList();

            function onSuccess(data, headers) {
                vm.projectList = data;
                vm.projects = [];
                $log.debug("가공전 프로젝트 : ", vm.projectList);
                angular.forEach(vm.projectList, function(value, index){
                    vm.projectList[index].taskPercent = {
                        width : Math.floor(value.taskCompleteCount / value.taskTotalCount * 100) + '%'
                    };

                    // 프로젝트 팀원 중복제거
                    vm.projectTeam = _.clone(value.project.projectAdmins);
                    var overlapYn = true;
                    angular.forEach(value.project.projectUsers, function(user, index){
                        angular.forEach(vm.projectTeam, function(admin, index){
                            if(user.id == admin.id){
                                overlapYn = false;
                            }
                        });
                        if(overlapYn) vm.projectTeam.push(user);
                        overlapYn = true;
                    });
                    value.projectTeam = vm.projectTeam;

                    vm.value = _.clone(value.project); // 깊은복사 막기

                    /* 프로젝트 정보 주입 */
                    vm.value.adminYn = value.adminYn;
                    vm.value.memberYn = value.memberYn;
                    vm.value.watcherYn = value.watcherYn;
                    vm.value.taskCompleteCount = value.taskCompleteCount;
                    vm.value.taskTotalCount = value.taskTotalCount ;
                    vm.value.taskPercent = {
                        width : value.taskCompleteCount == 0 && value.taskTotalCount == 0 ? '' : Math.floor(value.taskCompleteCount / value.taskTotalCount * 100) + '%'
                    };
                    if(value.projectStatisticsChilds.length > 0) vm.value.childsYn = false;
                    else vm.value.childsYn = true;

                    vm.projects.push(vm.value); // 프로젝트 리스트 추가

                    vm.childs = _.clone(value.projectStatisticsChilds); // 하위 프로젝트 복사
                    if(value.projectStatisticsChilds.length > 0) treeData(vm.childs) // 하위 프로젝트 유무 체크 후 있으면 재귀 돌림
                    vm.treeDepth = 1; // 기본 depth 세팅

                });
                vm.responseData = _.clone(vm.projects); //최종 프로젝트 리스트 주입
                $log.debug("전체 프로젝트 : ", vm.projects);

            }

            vm.treeDepth = 1;
            /* 트리 테이블 재귀 function */
            function treeData(projectChilds, depth){
                angular.forEach(projectChilds, function(value, index){

                    vm.value = _.clone(value.project); //깊은 복사 막기

                    /* 프로젝트 정보 주입 */
                    vm.value.adminYn = value.adminYn;
                    vm.value.memberYn = value.memberYn;
                    vm.value.watcherYn = value.watcherYn;
                    vm.value.taskCompleteCount = value.taskCompleteCount;
                    vm.value.taskTotalCount = value.taskTotalCount ;
                    vm.value.taskPercent = {
                        width : value.taskCompleteCount == 0 && value.taskTotalCount == 0 ? '' : Math.floor(value.taskCompleteCount / value.taskTotalCount * 100) + '%'
                    };
                    if(depth != undefined )vm.value.depth = vm.treeDepth + depth;
                    else vm.value.depth = vm.treeDepth;
                    if(value.projectStatisticsChilds.length > 0) vm.value.childsYn = false;
                    else vm.value.childsYn = true;

                    vm.projects.push(vm.value); // 프로젝트 리스트 추가
                    if(value.projectStatisticsChilds.length > 0) treeData(value.projectStatisticsChilds, vm.value.depth) // 하위 프로젝트 유무 체크 후 있으면 다시 재귀 돌림
                });
            }

            function onError(error) {
                AlertService.error(error.data.message);
            }
            vm.listType = 'TOTAL';

            vm.projectListType = [ {id : 'TOTAL',name : '전체보기'},{id : 'IN_PROGRESS',name : '진행중인 프로젝트'},{id : 'COMPLETION',name : '완료된 프로젝트'}];


            // 프로젝트 파일첨부 테이블 정보
            vm.tableConfigs = [];
            vm.tableConfigs.push(tableService.getConfig("프로젝트 명", "")
                .setHWidth("width-300-p")
                .setDAlign("text-left")
                .setDType("renderer")
                .setDRenderer("project-name"));
            vm.tableConfigs.push(tableService.getConfig("기간", "")
                .setHWidth("width-200-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("project-date"));
            vm.tableConfigs.push(tableService.getConfig("상태", "")
                .setHWidth("width-60-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("project-status"));
            vm.tableConfigs.push(tableService.getConfig("작업현황", "")
                .setHWidth("width-80-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("project-task-count"));
            vm.tableConfigs.push(tableService.getConfig("진척률", "")
                .setHWidth("width-60-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("project-task-percent"));
            vm.tableConfigs.push(tableService.getConfig("관리자", "")
                .setHWidth("width-200-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("project-admin"));
            vm.tableConfigs.push(tableService.getConfig("멤버", "")
                .setHWidth("width-60-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("project-member"));
            vm.tableConfigs.push(tableService.getConfig("공유", "")
                .setHWidth("width-60-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("project-watcher"));
            vm.tableConfigs.push(tableService.getConfig("최근 업데이트", "")
                .setHWidth("width-100-p")
                .setDAlign("text-center")
                .setDType("renderer")
                .setDRenderer("project-update-date"));

        }
