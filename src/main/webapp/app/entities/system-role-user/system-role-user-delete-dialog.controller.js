(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('SystemRoleUserDeleteController',SystemRoleUserDeleteController);

    SystemRoleUserDeleteController.$inject = ['$uibModalInstance', 'entity', 'SystemRoleUser'];

    function SystemRoleUserDeleteController($uibModalInstance, entity, SystemRoleUser) {
        var vm = this;

        vm.systemRoleUser = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            SystemRoleUser.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
