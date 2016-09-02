(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskProgressStatusCtrl', TaskProgressStatusCtrl);

    TaskProgressStatusCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'Task', 'Code', '$uibModalInstance', '$log', 'ModalService', 'TaskProgressStatus', 'parameter'];

    function TaskProgressStatusCtrl($scope, $rootScope, $stateParams, Task, Code, $uibModalInstance, $log,  ModalService, TaskProgressStatus, parameter) {
        var vm = this;
        vm.baseUrl = window.location.origin;
        vm.task = parameter.data;
        vm.cancel = cancel;

        vm.getTaskProgressStatus = getTaskProgressStatus;

        function getTaskProgressStatus(){
            TaskProgressStatus.get({id : vm.task.id}, taskProgressStatusSuccess, taskProgressStatusErorr)
        }
        function taskProgressStatusSuccess(result){
            vm.taskProgressStatus = result.taskDTO;
            $log.debug("vm.taskProgressStatus : ", vm.taskProgressStatus)
        }
        function taskProgressStatusErorr(){

        }

        //  닫기
        function cancel () {
            $uibModalInstance.close();
        }


        getTaskProgressStatus(); // 작업 현황 목록 조회

    }

})();


