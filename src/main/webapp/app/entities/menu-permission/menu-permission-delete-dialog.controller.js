(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('MenuPermissionDeleteController',MenuPermissionDeleteController);

    MenuPermissionDeleteController.$inject = ['$uibModalInstance', 'entity', 'MenuPermission'];

    function MenuPermissionDeleteController($uibModalInstance, entity, MenuPermission) {
        var vm = this;

        vm.menuPermission = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            MenuPermission.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
