(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskAttachedFileDeleteController',TaskAttachedFileDeleteController);

    TaskAttachedFileDeleteController.$inject = ['$uibModalInstance', 'entity', 'TaskAttachedFile'];

    function TaskAttachedFileDeleteController($uibModalInstance, entity, TaskAttachedFile) {
        var vm = this;

        vm.taskAttachedFile = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            TaskAttachedFile.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
