(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('SystemRolePermissionDeleteController',SystemRolePermissionDeleteController);

    SystemRolePermissionDeleteController.$inject = ['$uibModalInstance', 'entity', 'SystemRolePermission'];

    function SystemRolePermissionDeleteController($uibModalInstance, entity, SystemRolePermission) {
        var vm = this;

        vm.systemRolePermission = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            SystemRolePermission.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
