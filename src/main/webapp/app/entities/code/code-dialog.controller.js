(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('CodeDialogController', CodeDialogController);

    CodeDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Code'];

    function CodeDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Code) {
        var vm = this;

        vm.code = entity;
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
            if (vm.code.id !== null) {
                Code.update(vm.code, onSaveSuccess, onSaveError);
            } else {
                Code.save(vm.code, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('wmsApp:codeUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
