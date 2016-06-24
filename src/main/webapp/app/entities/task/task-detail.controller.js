(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskDetailController', TaskDetailController);

    TaskDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Task', 'Code', 'TaskAttachedFile'];

    function TaskDetailController($scope, $rootScope, $stateParams, entity, Task, Code, TaskAttachedFile) {
        var vm = this;

        vm.task = entity;

        var unsubscribe = $rootScope.$on('wmsApp:taskUpdate', function(event, result) {
            vm.task = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
