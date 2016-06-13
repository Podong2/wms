(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('SystemRoleDeleteController',SystemRoleDeleteController);

    SystemRoleDeleteController.$inject = ['$uibModalInstance', 'entity', 'SystemRole'];

    function SystemRoleDeleteController($uibModalInstance, entity, SystemRole) {
        var vm = this;

        vm.systemRole = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            SystemRole.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
