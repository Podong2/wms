(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskDeleteController',TaskDeleteController);

    TaskDeleteController.$inject = ['$uibModalInstance', 'entity', 'Task', '$log', 'toastr'];

    function TaskDeleteController($uibModalInstance, entity, Task, $log, toastr) {
        var vm = this;

        vm.task = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Task.delete({id: id},
                function (result) {
                    $log.debug("result : ", result);

                    toastr.success('태스크 삭제 완료', '태스크 삭제 완료');
                    $uibModalInstance.close(true);
                });
        }
    }
})();
