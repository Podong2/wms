/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("taskListCtrl", taskListCtrl);
taskListCtrl.$inject=['$scope', 'Code', '$log', 'Task', 'AlertService', 'ParseLinks', '$rootScope', '$state', 'MyTaskStatistics', '$stateParams', 'PaginationUtil', 'ModalService'];
        function taskListCtrl($scope, Code, $log, Task, AlertService, ParseLinks, $rootScope, $state, MyTaskStatistics, $stateParams, PaginationUtil, ModalService) {
            var vm = this;
            vm.baseUrl = window.location.origin;
            vm.tabDisplay = tabDisplay;
            vm.getList = getList;
            vm.taskListPopup = taskListPopup;
            vm.taskDetailModalOpen = taskDetailModalOpen;
            vm.filterSearch = filterSearch;
            //vm.showDetail = showDetail;

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
            vm.delayed=[]; // 지연된 작업
            vm.scheduledToday=[]; // 오늘 완료 작업
            vm.registeredToday=[]; // 새로 등록된 작업
            vm.inProgress=[]; //진행중인 작업
            vm.noneScheduled=[]; // 일정 미진행 작업
            vm.myTask=[]; // 내작업
            vm.requestTask=[]; // 요청받은작업
            vm.watchedTask=[]; // 참조작업
            vm.listType = "TODAY";
            vm.filterType = '';

            vm.taskPopup = false;
            vm.subTaskPopup = false;
            vm.parentTaskPopup = false;
            vm.relatedTaskPopup = false;
            //var listType = '';
            //function taskListPopup(type, event){
            //    $log.debug("type : ", type)
            //    vm.taskPopup = true;
            //    $(event.target.children).addClass('on');
            //    if(type == listType){
            //        vm.taskPopup = false;
            //        listType = '';
            //    }else{
            //        vm.subTaskPopup = false;
            //        vm.parentTaskPopup = false;
            //        vm.relatedTaskPopup = false;
            //        if(type == 'parent'){
            //            vm.parentTaskPopup = true;
            //        }else if(type == 'sub'){
            //            vm.subTaskPopup = true;
            //        }else if(type == 'related'){
            //            vm.relatedTaskPopup = true;
            //        }
            //        listType = type
            //    }
            //}

            /* layout config option */
            $scope.status = {
                isCustomHeaderOpen: false,
                isDelayedOpen: true,
                isScheduledTodayOpen: true,
                isRegisteredTodayOpen: true,
                inProgressOpen: true,
                isNoneScheduledOpen: true,
                isMyTaskOpen: true,
                isRequestTaskOpen: true,
                isWatchedTaskOpen: true,
                isFirstDisabled: false
            };
            vm.tabArea = [
                { status: true },  // 오늘
                { status: false },  // 예정
                { status: false },  // 보류
                { status: false }   // 완료
            ];

            $log.debug("$stateParams", $stateParams);

            //  탭메뉴 영역 표시 여부 지정
            function tabDisplay (number, type) {
                angular.forEach(vm.tabArea, function (tab, index) {
                    if (number == index) {
                        tab.status = true;
                    }
                    else {
                        tab.status = false;
                    }
                });
                vm.page = 1;
                vm.listType = type;
                vm.filterType = '';
                getList();
            }

            function filterSearch(type, filterType){
                vm.page = 1;
                vm.listType = type;
                vm.filterType = filterType;
                getList();
            }


            /* 타스크 목록 불러오기 */
            function getList(){
                $log.debug("검색 필터 vm.listType : ", vm.listType)
                $log.debug("검색 필터 vm.statusId : ", vm.statusId)
                $log.debug("검색 필터 vm.orderType : ", vm.orderType)
                $log.debug("검색 필터 vm.page : ", vm.page)
                Task.query({
                    listType : vm.listType,
                    filterType : vm.filterType,
                    page: vm.page - 1,
                    size: 15,
                    sort: 'desc'
                }, onSuccess, onError);
            }


            vm.reloadYn = false;
            $rootScope.$on("taskReload", function(event, args){
                vm.reloadYn = true;
                Task.query({
                    listType : vm.listType,
                    filterType : vm.filterType,
                    page: 0,
                    size: 15*(vm.page -1),
                    sort: 'desc'
                }, onSuccess, onError);
                //getList(args);
            });

            //function showDetail(id){
            //    $rootScope.$broadcast("showDetail", { id : id });
            //}

            function onSuccess(data, headers) {
                if(vm.page == 1 || vm.reloadYn) vm.tasks=[];

                angular.forEach(data, function(task){
                    // if(task.statusGroup == "DELAYED") vm.delayed.push(task);
                    // if(task.statusGroup == "SCHEDULED_TODAY") vm.scheduledToday.push(task);
                    // if(task.statusGroup == "REGISTERED_TODAY") vm.registeredToday.push(task);
                    // if(task.statusGroup == "IN_PROGRESS") vm.inProgress.push(task);
                    // if(task.statusGroup == "NONE_SCHEDULED") vm.noneScheduled.push(task);
                    // if(task.statusGroup == "MY_TASK") vm.myTask.push(task);
                    // if(task.statusGroup == "REQUEST_TASK") vm.requestTask.push(task);
                    // if(task.statusGroup == "WATCHED_TASK") vm.watchedTask.push(task);
                    vm.tasks.push(task);
                });
                $log.debug('작업 목록 : ', vm.tasks);

                MyTaskStatistics.get({listType : vm.listType}, countSuccess, onError); // 타스크 목록 카운트 정보 조회
                $scope.taskScroll.loading = false;
                if(!vm.reloadYn)vm.page++; //다음페이지 준비
                vm.reloadYn = false;
                if($stateParams.type != '') $state.go("my-task.detail", {id : vm.tasks[0].id, listType : 'TODAY'});
            }
            function countSuccess(result){
                vm.taskCounts = JSON.parse(result.count);
                $log.debug("vm.taskCounts  : ", vm.taskCounts )
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }

            // 작업 상세 팝업 오픈 테스트
            function taskDetailModalOpen(){
                var editModalConfig = {
                    size : "lg",
                    url : "app/task/html/modal/taskDetailPopup.html",
                    ctrl : "TaskDetailCtrl"
                };

                ModalService.openModal(editModalConfig);
            }



            getList();



        }
