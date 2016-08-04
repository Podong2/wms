/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("taskListCtrl", taskListCtrl);
taskListCtrl.$inject=['$scope', 'Code', '$log', 'Task', 'AlertService', 'ParseLinks', '$rootScope'];
        function taskListCtrl($scope, Code, $log, Task, AlertService, ParseLinks, $rootScope) {
            var vm = this;
            vm.tabDisplay = tabDisplay;
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

            /* layout config option */
            $scope.status = {
                isCustomHeaderOpen: false,
                isFirstOpen: true,
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
            }

            function getList(type){
                Task.query({listType : type}, onSuccess, onError);
            }
            getList();

            $scope.$on("taskReload", function(){
                getList();
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
                //vm.responseData.data = data;
                //$log.debug("vm.tasks : ", vm.tasks);
                //$log.debug("지연된 작업 : ", vm.delayed);
                //$log.debug("오늘 완료 작업 : ", vm.scheduledToday);
                //$log.debug("새로 등록된 작업 : ", vm.registeredToday);
                //$log.debug("진행 중인 작업 : ", vm.inProgress);
                //$log.debug("일정 미정 작업 : ", vm.noneScheduled);
                //$log.debug("내 작업 : ", vm.myTask);
                //$log.debug("요청받은 작업 : ", vm.requestTask);
                //$log.debug("참조 작업 : ", vm.watchedTask);
                //$rootScope.$broadcast("showDetail", { id : vm.tasks[0].id });
                //vm.page = pagingParams.page;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }


        }
