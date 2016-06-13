(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('SystemRoleDetailController', SystemRoleDetailController);

    SystemRoleDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'SystemRole'];

    function SystemRoleDetailController($scope, $rootScope, $stateParams, entity, SystemRole) {
        var vm = this;

        vm.systemRole = entity;

        var unsubscribe = $rootScope.$on('wmsApp:systemRoleUpdate', function(event, result) {
            vm.systemRole = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
