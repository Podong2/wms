(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('projectRevertCtrl', projectRevertCtrl);

    projectRevertCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'TaskListSearch', 'ModalService', 'parameter', '$log', 'TaskEdit', '$uibModalInstance', 'tableService', '$sce'];

    function projectRevertCtrl($scope, $rootScope, $stateParams, TaskListSearch, ModalService, parameter, $log, TaskEdit, $uibModalInstance, tableService, $sce) {
        var vm = this;
        vm.cancel = cancel;

        vm.project = parameter.data;
        vm.commentList=[];
        $scope.renderHtml = renderHtml;
        $log.debug("복원 팝업 vm.project : ", vm.project)

        TaskListSearch.TaskAudigLog({'entityId' : vm.project.id, 'entityName' : 'Project', entityField : 'contents'}).then(function(result){
            vm.TaskAuditLog = result;
            angular.forEach(vm.TaskAuditLog.data, function(val){
                val.createdDate = new Date (val.createdDate).format("yyyy-MM-dd HH:mm");
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
            .setDRenderer("set_project_content"));


    }

})();


