(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('SystemRoleDialogController', SystemRoleDialogController);

    SystemRoleDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'SystemRole'];

    function SystemRoleDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, SystemRole) {
        var vm = this;

        vm.systemRole = entity;
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
            if (vm.systemRole.id !== null) {
                SystemRole.update(vm.systemRole, onSaveSuccess, onSaveError);
            } else {
                SystemRole.save(vm.systemRole, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('wmsApp:systemRoleUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
