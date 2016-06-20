(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('SystemRolePermissionDetailController', SystemRolePermissionDetailController);

    SystemRolePermissionDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'SystemRolePermission', 'SystemRole', 'Permission'];

    function SystemRolePermissionDetailController($scope, $rootScope, $stateParams, entity, SystemRolePermission, SystemRole, Permission) {
        var vm = this;

        vm.systemRolePermission = entity;

        var unsubscribe = $rootScope.$on('wmsApp:systemRolePermissionUpdate', function(event, result) {
            vm.systemRolePermission = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
