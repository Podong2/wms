(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('PermissionCategoryDetailController', PermissionCategoryDetailController);

    PermissionCategoryDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'PermissionCategory'];

    function PermissionCategoryDetailController($scope, $rootScope, $stateParams, entity, PermissionCategory) {
        var vm = this;

        vm.permissionCategory = entity;

        var unsubscribe = $rootScope.$on('wmsApp:permissionCategoryUpdate', function(event, result) {
            vm.permissionCategory = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
