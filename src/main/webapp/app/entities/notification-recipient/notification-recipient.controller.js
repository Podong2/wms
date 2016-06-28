(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('NotificationRecipientController', NotificationRecipientController);

    NotificationRecipientController.$inject = ['$scope', '$state', 'NotificationRecipient', 'NotificationRecipientSearch'];

    function NotificationRecipientController ($scope, $state, NotificationRecipient, NotificationRecipientSearch) {
        var vm = this;
        
        vm.notificationRecipients = [];
        vm.search = search;

        loadAll();

        function loadAll() {
            NotificationRecipient.query(function(result) {
                vm.notificationRecipients = result;
            });
        }

        function search () {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            NotificationRecipientSearch.query({query: vm.searchQuery}, function(result) {
                vm.notificationRecipients = result;
            });
        }    }
})();
