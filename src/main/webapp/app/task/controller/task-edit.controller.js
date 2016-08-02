/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("taskEditCtrl", taskEditCtrl);
taskEditCtrl.$inject=['$scope', '$uibModalInstance', 'Code', '$log', 'Task', 'toastr', '$state'];
        function taskEditCtrl($scope, $uibModalInstance, Code, $log, Task, toastr, $state) {
            var vm = this;
            vm.codes = Code.query();
            $log.debug("vm.codes : ", vm.codes);
            vm.task = {
                name : ""
            };
            vm.save = save;

            $scope.ok = ok;
            $scope.cancel = cancel;

            //  전송
            function ok () {

                $uibModalInstance.dismiss('cancel');
            }

            //  닫기
            function cancel () {
                $uibModalInstance.dismiss('cancel');
            }

            function save(){
                Task.save(vm.task, onSaveSuccess, onSaveError);
            }
            function onSaveSuccess (result) {
                //$scope.$emit('wmsApp:taskUpdate', result);
                toastr.success('태스크 생성 완료', '태스크 생성 완료');
                //$state.go("task", {}, {reload : true});
                $timeout(function(){ // state reload 명령과 충돌하는 문제 때문에 설정
                    //$uibModalInstance.dismiss('cancel');
                }, 100);
            }

            function onSaveError () {
            }


        }
