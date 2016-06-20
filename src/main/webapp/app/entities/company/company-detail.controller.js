(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('CompanyDetailController', CompanyDetailController);

    CompanyDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Company'];

    function CompanyDetailController($scope, $rootScope, $stateParams, entity, Company) {
        var vm = this;

        vm.company = entity;

        var unsubscribe = $rootScope.$on('wmsApp:companyUpdate', function(event, result) {
            vm.company = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
