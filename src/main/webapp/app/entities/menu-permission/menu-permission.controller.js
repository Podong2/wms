(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('MenuPermissionController', MenuPermissionController);

    MenuPermissionController.$inject = ['$scope', '$state', 'MenuPermission', 'MenuPermissionSearch'];

    function MenuPermissionController ($scope, $state, MenuPermission, MenuPermissionSearch) {
        var vm = this;
        
        vm.menuPermissions = [];
        vm.search = search;

        loadAll();

        function loadAll() {
            MenuPermission.query(function(result) {
                vm.menuPermissions = result;
            });
        }

        function search () {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            MenuPermissionSearch.query({query: vm.searchQuery}, function(result) {
                vm.menuPermissions = result;
            });
        }    }
})();
