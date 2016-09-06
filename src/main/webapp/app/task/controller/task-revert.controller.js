(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('taskRevertCtrl', taskRevertCtrl);

    taskRevertCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'TaskListSearch', 'ModalService', 'parameter', '$log', 'TaskEdit', '$uibModalInstance', 'tableService', '$sce'];

    function taskRevertCtrl($scope, $rootScope, $stateParams, TaskListSearch, ModalService, parameter, $log, TaskEdit, $uibModalInstance, tableService, $sce) {
        var vm = this;
        vm.cancel = cancel;

        vm.task = parameter.data;
        vm.commentList=[];
        $scope.renderHtml = renderHtml;
        $log.debug("복원 팝업 vm.task  : ", vm.task)

        TaskListSearch.TaskAudigLog({'entityId' : vm.task.id, 'entityName' : 'Task', entityField : 'contents'}).then(function(result){
            vm.TaskAuditLog = result;
            angular.forEach(vm.TaskAuditLog.data, function(val){
                    vm.commentList.push(val);
            });
            vm.responseData = vm.commentList;
            $log.debug("vm.commentList : ", vm.commentList)
        });

        $rootScope.$on('cancel', function(){
            $uibModalInstance.close();
        })



        //  닫기
        function cancel () {
            $uibModalInstance.close();
        }

        //설명 html 형식으로 표현
        function renderHtml (data) {
            return $sce.trustAsHtml(data);
        }


        vm.tableConfigs = [];
        vm.tableConfigs.push(tableService.getConfig("본문내용", "")
            .setHWidth("width-80-p")
            .setDAlign("text-center")
            .setDType("renderer")
            .setDRenderer("revert_task_content"));
        vm.tableConfigs.push(tableService.getConfig("수정자", "createdByName")
            .setHWidth("width-200-p")
            .setDAlign("text-center"));
        vm.tableConfigs.push(tableService.getConfig("수정일", "createdDate")
            .setHWidth("width-80-p")
            .setDAlign("text-center"));
        vm.tableConfigs.push(tableService.getConfig("복원", "")
            .setHWidth("width-80-p")
            .setDAlign("text-center")
            .setDType("renderer")
            .setDRenderer("set_task_content"));


    }

})();


