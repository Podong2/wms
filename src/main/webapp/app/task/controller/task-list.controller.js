/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("taskListCtrl", taskListCtrl);
taskListCtrl.$inject=['$scope', 'Code', '$log', 'Task', 'AlertService', 'ParseLinks', '$rootScope', '$state', 'MyTaskStatistics'];
        function taskListCtrl($scope, Code, $log, Task, AlertService, ParseLinks, $rootScope, $state, MyTaskStatistics) {
            var vm = this;
            vm.tabDisplay = tabDisplay;
            vm.getList = getList;
            //vm.showDetail = showDetail;

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
                getList(type);
                vm.listType = type;
            }


            function getList(type, filterType){
                Task.query({listType : type, filterType : filterType}, onSuccess, onError);
            }
            getList();

            $scope.$on("taskReload", function(event, args){
                getList(args.listType);
            });

            //function showDetail(id){
            //    $rootScope.$broadcast("showDetail", { id : id });
            //}

            function onSuccess(data, headers) {
                vm.tasks=[]; vm.delayed=[]; vm.scheduledToday=[]; vm.registeredToday=[]; vm.inProgress=[]; vm.noneScheduled=[]; vm.myTask=[]; vm.requestTask=[]; vm.watchedTask=[];

                angular.forEach(data, function(task){
                    if(task.statusGroup == "DELAYED") vm.delayed.push(task);
                    if(task.statusGroup == "SCHEDULED_TODAY") vm.scheduledToday.push(task);
                    if(task.statusGroup == "REGISTERED_TODAY") vm.registeredToday.push(task);
                    if(task.statusGroup == "IN_PROGRESS") vm.inProgress.push(task);
                    if(task.statusGroup == "NONE_SCHEDULED") vm.noneScheduled.push(task);
                    if(task.statusGroup == "MY_TASK") vm.myTask.push(task);
                    if(task.statusGroup == "REQUEST_TASK") vm.requestTask.push(task);
                    if(task.statusGroup == "WATCHED_TASK") vm.watchedTask.push(task);
                    vm.tasks.push(task);
                });
                $log.debug('vm.tasks : ', vm.tasks);

                MyTaskStatistics.get({listType : vm.listType}, countSuccess, onError)
            }
            function countSuccess(result){
                vm.taskCounts = JSON.parse(result.count);
                $log.debug("vm.taskCounts  : ", vm.taskCounts )
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }




        }
