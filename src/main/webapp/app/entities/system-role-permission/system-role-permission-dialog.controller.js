(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('SystemRolePermissionDialogController', SystemRolePermissionDialogController);

    SystemRolePermissionDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'SystemRolePermission', 'SystemRole', 'Permission'];

    function SystemRolePermissionDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, SystemRolePermission, SystemRole, Permission) {
        var vm = this;

        vm.systemRolePermission = entity;
        vm.clear = clear;
        vm.save = save;
        vm.systemroles = SystemRole.query();
        vm.permissions = Permission.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.systemRolePermission.id !== null) {
                SystemRolePermission.update(vm.systemRolePermission, onSaveSuccess, onSaveError);
            } else {
                SystemRolePermission.save(vm.systemRolePermission, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('wmsApp:systemRolePermissionUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
