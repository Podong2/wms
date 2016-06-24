(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskAttachedFileController', TaskAttachedFileController);

    TaskAttachedFileController.$inject = ['$scope', '$state', 'TaskAttachedFile', 'TaskAttachedFileSearch'];

    function TaskAttachedFileController ($scope, $state, TaskAttachedFile, TaskAttachedFileSearch) {
        var vm = this;
        
        vm.taskAttachedFiles = [];
        vm.search = search;

        loadAll();

        function loadAll() {
            TaskAttachedFile.query(function(result) {
                vm.taskAttachedFiles = result;
            });
        }

        function search () {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            TaskAttachedFileSearch.query({query: vm.searchQuery}, function(result) {
                vm.taskAttachedFiles = result;
            });
        }    }
})();
