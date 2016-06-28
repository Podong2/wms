(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('NotificationDetailController', NotificationDetailController);

    NotificationDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Notification', 'NotificationRecipient'];

    function NotificationDetailController($scope, $rootScope, $stateParams, entity, Notification, NotificationRecipient) {
        var vm = this;

        vm.notification = entity;

        var unsubscribe = $rootScope.$on('wmsApp:notificationUpdate', function(event, result) {
            vm.notification = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
