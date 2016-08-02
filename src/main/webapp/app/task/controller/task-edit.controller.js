/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("taskEditCtrl", taskEditCtrl);
taskEditCtrl.$inject=['$scope', '$uibModalInstance', 'Code', '$log', 'Task', 'toastr', '$state', '$timeout', 'DateUtils', 'SubTask', 'Principal'];
        function taskEditCtrl($scope, $uibModalInstance, Code, $log, Task, toastr, $state, $timeout, DateUtils, SubTask, Principal) {
            var vm = this;
            vm.save = save;
            vm.subTaskSave = subTaskSave;
            vm.openCalendar = openCalendar;
            vm.ok = ok;
            vm.cancel = cancel;
            vm.userInfo = Principal.getIdentity();


            vm.codes = Code.query();

            vm.task = {
                name : '',
                id : '',
                startDate : '',
                endDate : ''
            };

            vm.subTask = {
                name : '',
                parentId : '',
                assigneeId : 3
            };

            // min date picker
            this.dueDateFrom = {
                date: "",
                datepickerOptions: {
                    maxDate: null
                }
            };
            // max date picker
            this.dueDateTo = {
                date: "",
                datepickerOptions: {
                    minDate: null
                }
            };

            $log.debug("vm.codes : ", vm.codes);
            $log.debug("vm.vm.userInfo : ", vm.userInfo);

            // date 포멧 변경
            $scope.$watch("vm.dueDateFrom.date", function(newValue, oldValue){
                if(oldValue != newValue){
                    var d = newValue;
                    var formatDate =
                        DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' +  DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                        //DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2) + ':' + DateUtils.datePickerFormat(d.getSeconds(), 2);
                    vm.task.startDate= formatDate;
                }

            });
            // date 포멧 변경
            $scope.$watch("vm.dueDateTo.date", function(newValue, oldValue){
                if(oldValue != newValue){
                    var d = newValue;
                    var formatDate =
                        DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                        //DateUtils.datePickerFormat(d.getHours(), 2) + ':' + DateUtils.datePickerFormat(d.getMinutes(), 2) + ':' + DateUtils.datePickerFormat(d.getSeconds(), 2);
                    vm.task.endDate = formatDate;
                }
            });


            // 달력 오픈
            function openCalendar(e, picker) {
                vm[picker].open = true;
            }

            //  전송
            function ok () {

                $uibModalInstance.dismiss('cancel');
            }

            //  닫기
            function cancel () {
                $uibModalInstance.dismiss('cancel');
            }

            function save(){
                if(vm.task.name != '') Task.save(vm.task, onSaveSuccess, onSaveError);
            }

            function subTaskSave(){
                if(vm.subTask.name != '') SubTask.save(vm.subTask, onSaveSuccess, onSaveError);
            }

            function onSaveSuccess (result) {
                //$scope.$emit('wmsApp:taskUpdate', result);
                toastr.success('태스크 생성 완료', '태스크 생성 완료');
                vm.task.id = result.id;
                vm.subTask.parentId = result.id;
                //$state.go("task", {}, {reload : true});
                $timeout(function(){ // state reload 명령과 충돌하는 문제 때문에 설정
                    //$uibModalInstance.dismiss('cancel');
                }, 100);
            }

            function onSaveError () {
            }


        }
