(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('MenuPermissionDetailController', MenuPermissionDetailController);

    MenuPermissionDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'MenuPermission', 'Menu', 'Permission'];

    function MenuPermissionDetailController($scope, $rootScope, $stateParams, entity, MenuPermission, Menu, Permission) {
        var vm = this;

        vm.menuPermission = entity;

        var unsubscribe = $rootScope.$on('wmsApp:menuPermissionUpdate', function(event, result) {
            vm.menuPermission = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
