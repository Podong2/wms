(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('NotificationRecipientDeleteController',NotificationRecipientDeleteController);

    NotificationRecipientDeleteController.$inject = ['$uibModalInstance', 'entity', 'NotificationRecipient'];

    function NotificationRecipientDeleteController($uibModalInstance, entity, NotificationRecipient) {
        var vm = this;

        vm.notificationRecipient = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            NotificationRecipient.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
