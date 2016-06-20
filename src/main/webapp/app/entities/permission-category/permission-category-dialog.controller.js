(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('PermissionCategoryDialogController', PermissionCategoryDialogController);

    PermissionCategoryDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'PermissionCategory'];

    function PermissionCategoryDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, PermissionCategory) {
        var vm = this;

        vm.permissionCategory = entity;
        vm.clear = clear;
        vm.save = save;

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.permissionCategory.id !== null) {
                PermissionCategory.update(vm.permissionCategory, onSaveSuccess, onSaveError);
            } else {
                PermissionCategory.save(vm.permissionCategory, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('wmsApp:permissionCategoryUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
