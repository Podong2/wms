(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('PermissionDetailController', PermissionDetailController);

    PermissionDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Permission', 'PermissionCategory'];

    function PermissionDetailController($scope, $rootScope, $stateParams, entity, Permission, PermissionCategory) {
        var vm = this;

        vm.permission = entity;

        var unsubscribe = $rootScope.$on('wmsApp:permissionUpdate', function(event, result) {
            vm.permission = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
