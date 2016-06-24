(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskAttachedFileDetailController', TaskAttachedFileDetailController);

    TaskAttachedFileDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'TaskAttachedFile', 'Task'];

    function TaskAttachedFileDetailController($scope, $rootScope, $stateParams, entity, TaskAttachedFile, Task) {
        var vm = this;

        vm.taskAttachedFile = entity;

        var unsubscribe = $rootScope.$on('wmsApp:taskAttachedFileUpdate', function(event, result) {
            vm.taskAttachedFile = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
