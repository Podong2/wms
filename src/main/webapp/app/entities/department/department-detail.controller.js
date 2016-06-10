(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('DepartmentDetailController', DepartmentDetailController);

    DepartmentDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Department', 'Company'];

    function DepartmentDetailController($scope, $rootScope, $stateParams, entity, Department, Company) {
        var vm = this;

        vm.department = entity;

        var unsubscribe = $rootScope.$on('wmsApp:departmentUpdate', function(event, result) {
            vm.department = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
