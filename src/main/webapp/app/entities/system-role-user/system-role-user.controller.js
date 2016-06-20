(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('SystemRoleUserController', SystemRoleUserController);

    SystemRoleUserController.$inject = ['$scope', '$state', 'SystemRoleUser', 'SystemRoleUserSearch'];

    function SystemRoleUserController ($scope, $state, SystemRoleUser, SystemRoleUserSearch) {
        var vm = this;
        
        vm.systemRoleUsers = [];
        vm.search = search;

        loadAll();

        function loadAll() {
            SystemRoleUser.query(function(result) {
                vm.systemRoleUsers = result;
            });
        }

        function search () {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            SystemRoleUserSearch.query({query: vm.searchQuery}, function(result) {
                vm.systemRoleUsers = result;
            });
        }    }
})();
