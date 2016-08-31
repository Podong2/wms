/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("projectListCtrl", projectListCtrl);
projectListCtrl.$inject=['$scope', 'Code', '$log', 'Task', 'AlertService', '$rootScope', '$state', 'ProjectList', '$stateParams', 'toastr'];
        function projectListCtrl($scope, Code, $log, Task, AlertService, $rootScope, $state, ProjectList, $stateParams, toastr) {
            var vm = this;

            $scope.$watchCollection('vm.listType', function(newValue){
                ProjectList.query({listType : newValue}, onSuccess, onError);
            })

            function getList(){
                ProjectList.query({listType : 'TOTAL'}, onSuccess, onError);
            }
            getList();


            function onSuccess(data, headers) {
                vm.projectList = data;
                angular.forEach(vm.projectList, function(value, index){
                    vm.projectList[index].taskPercent = {
                        width : Math.floor(value.taskCompleteCount / value.taskTotalCount * 100) + '%'
                    };
                });
                $log.debug("전체 프로젝트 : ", vm.projectList);
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
            vm.listType = 'TOTAL';

            vm.projectListType = [ {id : 'TOTAL',name : '전체보기'},{id : 'IN_PROGRESS',name : '진행중인 프로젝트'},{id : 'COMPLETION',name : '완료된 프로젝트'}];

        }
