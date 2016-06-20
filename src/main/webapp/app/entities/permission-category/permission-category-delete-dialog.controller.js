(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('PermissionCategoryDeleteController',PermissionCategoryDeleteController);

    PermissionCategoryDeleteController.$inject = ['$uibModalInstance', 'entity', 'PermissionCategory'];

    function PermissionCategoryDeleteController($uibModalInstance, entity, PermissionCategory) {
        var vm = this;

        vm.permissionCategory = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            PermissionCategory.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
