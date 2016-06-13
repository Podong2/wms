(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('PermissionDialogController', PermissionDialogController);

    PermissionDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Permission', 'PermissionCategory'];

    function PermissionDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Permission, PermissionCategory) {
        var vm = this;

        vm.permission = entity;
        vm.clear = clear;
        vm.save = save;
        vm.permissioncategories = PermissionCategory.query();
        vm.permissions = Permission.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.permission.id !== null) {
                Permission.update(vm.permission, onSaveSuccess, onSaveError);
            } else {
                Permission.save(vm.permission, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('wmsApp:permissionUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
