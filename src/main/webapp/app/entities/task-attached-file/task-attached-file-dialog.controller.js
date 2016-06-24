(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskAttachedFileDialogController', TaskAttachedFileDialogController);

    TaskAttachedFileDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'TaskAttachedFile', 'Task'];

    function TaskAttachedFileDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, TaskAttachedFile, Task) {
        var vm = this;

        vm.taskAttachedFile = entity;
        vm.clear = clear;
        vm.save = save;
        vm.tasks = Task.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.taskAttachedFile.id !== null) {
                TaskAttachedFile.update(vm.taskAttachedFile, onSaveSuccess, onSaveError);
            } else {
                TaskAttachedFile.save(vm.taskAttachedFile, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('wmsApp:taskAttachedFileUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
