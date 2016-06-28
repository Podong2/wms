(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('NotificationRecipientDetailController', NotificationRecipientDetailController);

    NotificationRecipientDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'NotificationRecipient', 'Notification'];

    function NotificationRecipientDetailController($scope, $rootScope, $stateParams, entity, NotificationRecipient, Notification) {
        var vm = this;

        vm.notificationRecipient = entity;

        var unsubscribe = $rootScope.$on('wmsApp:notificationRecipientUpdate', function(event, result) {
            vm.notificationRecipient = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
