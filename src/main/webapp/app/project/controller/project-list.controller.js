/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("projectListCtrl", projectListCtrl);
projectListCtrl.$inject=['$scope', 'Code', '$log', 'Task', 'AlertService', 'ParseLinks', '$rootScope', '$state', 'ProjectInfo', 'entity'];
        function projectListCtrl($scope, Code, $log, Task, AlertService, ParseLinks, $rootScope, $state, ProjectInfo, entity) {
            var vm = this;
            //vm.showDetail = showDetail;


            vm.tasks=[]; // 총 목록

            /* layout config option */
            $scope.status = {
                isCustomHeaderOpen: false,
                isDelayedOpen: true,
                isScheduledTodayOpen: true,
                isRegisteredTodayOpen: true,
                isFirstDisabled: false
            };

            function getList(){
                ProjectInfo.get({projectId : 1, listType : 'TOTAL'}, onSuccess, onError);
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
                //vm.tasks=[]; vm.delayed=[]; vm.scheduledToday=[]; vm.registeredToday=[]; vm.inProgress=[]; vm.noneScheduled=[]; vm.myTask=[]; vm.requestTask=[]; vm.watchedTask=[];
                //
                //angular.forEach(data, function(task){
                //    if(task.statusGroup == "DELAYED") vm.delayed.push(task);
                //    if(task.statusGroup == "SCHEDULED_TODAY") vm.scheduledToday.push(task);
                //    if(task.statusGroup == "REGISTERED_TODAY") vm.registeredToday.push(task);
                //    if(task.statusGroup == "IN_PROGRESS") vm.inProgress.push(task);
                //    if(task.statusGroup == "NONE_SCHEDULED") vm.noneScheduled.push(task);
                //    if(task.statusGroup == "MY_TASK") vm.myTask.push(task);
                //    if(task.statusGroup == "REQUEST_TASK") vm.requestTask.push(task);
                //    if(task.statusGroup == "WATCHED_TASK") vm.watchedTask.push(task);
                //    vm.tasks.push(task);
                //});
                //$state.go("my-task.detail", { id : vm.tasks[0].id, listType : vm.listType });
                //vm.page = pagingParams.page;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }


        }
