(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('SystemRoleUserDetailController', SystemRoleUserDetailController);

    SystemRoleUserDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'SystemRoleUser', 'SystemRole'];

    function SystemRoleUserDetailController($scope, $rootScope, $stateParams, entity, SystemRoleUser, SystemRole) {
        var vm = this;

        vm.systemRoleUser = entity;

        var unsubscribe = $rootScope.$on('wmsApp:systemRoleUserUpdate', function(event, result) {
            vm.systemRoleUser = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
