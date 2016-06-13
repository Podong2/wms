(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('MenuPermissionDialogController', MenuPermissionDialogController);

    MenuPermissionDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'MenuPermission', 'Menu', 'Permission'];

    function MenuPermissionDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, MenuPermission, Menu, Permission) {
        var vm = this;

        vm.menuPermission = entity;
        vm.clear = clear;
        vm.save = save;
        vm.menus = Menu.query();
        vm.permissions = Permission.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.menuPermission.id !== null) {
                MenuPermission.update(vm.menuPermission, onSaveSuccess, onSaveError);
            } else {
                MenuPermission.save(vm.menuPermission, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('wmsApp:menuPermissionUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
