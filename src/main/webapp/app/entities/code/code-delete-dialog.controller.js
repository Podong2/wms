(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('CodeDeleteController',CodeDeleteController);

    CodeDeleteController.$inject = ['$uibModalInstance', 'entity', 'Code'];

    function CodeDeleteController($uibModalInstance, entity, Code) {
        var vm = this;

        vm.code = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Code.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
