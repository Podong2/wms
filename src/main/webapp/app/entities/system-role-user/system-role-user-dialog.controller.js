(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('SystemRoleUserDialogController', SystemRoleUserDialogController);

    SystemRoleUserDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'SystemRoleUser', 'SystemRole', 'User'];

    function SystemRoleUserDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, SystemRoleUser, SystemRole, User) {
        var vm = this;

        vm.systemRoleUser = entity;
        vm.clear = clear;
        vm.save = save;
        vm.systemroles = SystemRole.query();
        vm.users = User.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.systemRoleUser.id !== null) {
                SystemRoleUser.update(vm.systemRoleUser, onSaveSuccess, onSaveError);
            } else {
                SystemRoleUser.save(vm.systemRoleUser, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('wmsApp:systemRoleUserUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
