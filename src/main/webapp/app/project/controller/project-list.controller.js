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

            function getList(){
                ProjectInfo.get({projectId : $stateParams.id, listType : 'TOTAL'}, onSuccess, onError);
            }
            getList();


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
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }

        }
