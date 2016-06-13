(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('SystemRolePermissionController', SystemRolePermissionController);

    SystemRolePermissionController.$inject = ['$scope', '$state', 'SystemRolePermission', 'SystemRolePermissionSearch'];

    function SystemRolePermissionController ($scope, $state, SystemRolePermission, SystemRolePermissionSearch) {
        var vm = this;
        
        vm.systemRolePermissions = [];
        vm.search = search;

        loadAll();

        function loadAll() {
            SystemRolePermission.query(function(result) {
                vm.systemRolePermissions = result;
            });
        }

        function search () {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            SystemRolePermissionSearch.query({query: vm.searchQuery}, function(result) {
                vm.systemRolePermissions = result;
            });
        }    }
})();
