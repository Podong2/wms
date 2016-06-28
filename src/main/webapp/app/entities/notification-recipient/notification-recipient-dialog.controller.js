(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('NotificationRecipientDialogController', NotificationRecipientDialogController);

    NotificationRecipientDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'NotificationRecipient', 'Notification'];

    function NotificationRecipientDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, NotificationRecipient, Notification) {
        var vm = this;

        vm.notificationRecipient = entity;
        vm.clear = clear;
        vm.save = save;
        vm.notifications = Notification.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.notificationRecipient.id !== null) {
                NotificationRecipient.update(vm.notificationRecipient, onSaveSuccess, onSaveError);
            } else {
                NotificationRecipient.save(vm.notificationRecipient, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('wmsApp:notificationRecipientUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
