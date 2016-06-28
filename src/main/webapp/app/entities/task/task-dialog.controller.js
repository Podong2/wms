(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskDialogController', TaskDialogController);

    TaskDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Task', 'Code', 'TaskAttachedFile', 'User', '$log', 'TaskEdit'];

    function TaskDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Task, Code, TaskAttachedFile, User, $log, TaskEdit) {
        var vm = this;

        vm.task = entity;
        vm.clear = clear;
        vm.save = save;
        vm.codes = Code.query();
        vm.taskattachedfiles = TaskAttachedFile.query();
        vm.users = User.query();
        vm.taskFindSimilar = taskFindSimilar;

        $scope.files = [];
        // 파일 목록 라이브러리에서 가져오기
        $scope.$on('setFiles', function (event, args) {
            $scope.files = args;
            $log.debug("파일 목록 : ", $scope.files);
        });

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.task.id !== null) {
                Task.update(vm.task, onSaveSuccess, onSaveError);
            } else {
                //Task.save(vm.task, onSaveSuccess, onSaveError);

                $log.debug("files : ", $scope.files);

                TaskEdit.addTask({
                    method : "POST",
                        file : $scope.files,
                        //	data 속성으로 별도의 데이터 전송
                        fields : vm.task,
                    fileFormDataName : "file"
                }).then(function (response) {
                    $log.debug("task 생성 성공")
                });
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('wmsApp:taskUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        // 유사 타스크 검색
        function taskFindSimilar(){

        }

    }
})();
