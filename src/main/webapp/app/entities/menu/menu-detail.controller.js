(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('MenuDetailController', MenuDetailController);

    MenuDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Menu'];

    function MenuDetailController($scope, $rootScope, $stateParams, entity, Menu) {
        var vm = this;

        vm.menu = entity;

        var unsubscribe = $rootScope.$on('wmsApp:menuUpdate', function(event, result) {
            vm.menu = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
