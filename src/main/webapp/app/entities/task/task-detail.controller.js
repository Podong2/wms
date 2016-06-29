(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskDetailController', TaskDetailController);

    TaskDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Task', 'Code', 'TaskAttachedFile', 'summaryService', '$log'];

    function TaskDetailController($scope, $rootScope, $stateParams, entity, Task, Code, TaskAttachedFile, summaryService, $log) {
        var vm = this;

        vm.task = entity;
        vm.makeTableConfig = makeTableConfig;
        vm.tabDisplay = tabDisplay;

        //  탭 메뉴 표시 여부 결정
        vm.tabArea = [
            { status: true },
            { status: false },
            { status: false }
        ];

        //  탭메뉴 영역 표시 여부 지정
        function tabDisplay (number) {
            angular.forEach(vm.tabArea, function (tab, index) {
                if (number == index) {
                    tab.status = true;
                }
                else {
                    tab.status = false;
                }
            });
        }

        var unsubscribe = $rootScope.$on('wmsApp:taskUpdate', function(event, result) {
            vm.task = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.responseData = vm.task;
        $log.debug("$scope.responseData : ", $scope.responseData);

        $scope.summaryConfigs = [];
        $scope.tempConfigs = [];

        function makeTableConfig(){
            $scope.tempConfigs.push(summaryService.getConfig()
                .setName("wmsApp.task.name")
                .setKey("name"));
            $scope.tempConfigs.push(summaryService.getConfig()
                .setName("wmsApp.task.dueDate")
                .setKey("dueDate"));

            $scope.summaryConfigs.push($scope.tempConfigs);
            $scope.tempConfigs = [];

            $scope.tempConfigs.push(summaryService.getConfig()
                .setName("wmsApp.task.severity")
                .setKey("severityName"));
            $scope.tempConfigs.push(summaryService.getConfig()
                .setName("wmsApp.task.taskAttachedFiles")
                .setKey("taskAttachedFiles"));

            $scope.summaryConfigs.push($scope.tempConfigs);
        }

        makeTableConfig();
    }
})();
