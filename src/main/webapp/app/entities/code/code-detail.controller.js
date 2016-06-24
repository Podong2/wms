(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('CodeDetailController', CodeDetailController);

    CodeDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Code'];

    function CodeDetailController($scope, $rootScope, $stateParams, entity, Code) {
        var vm = this;

        vm.code = entity;

        var unsubscribe = $rootScope.$on('wmsApp:codeUpdate', function(event, result) {
            vm.code = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
