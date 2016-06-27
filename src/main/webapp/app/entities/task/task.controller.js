(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskController', TaskController);

    TaskController.$inject = ['$scope', '$state', 'Task', 'TaskSearch', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants', 'FIndCode', 'User', '$log', '$rootScope', 'findUser', '$q'];

    function TaskController ($scope, $state, Task, TaskSearch, ParseLinks, AlertService, pagingParams, paginationConstants, FIndCode, User, $log, $rootScope, findUser, $q) {
        var vm = this;



        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.clear = clear;
        vm.search = search;
        vm.searchQuery = pagingParams.search;
        vm.currentSearch = pagingParams.search;
        vm.openCalendar = openCalendar;
        vm.assigneeUsers = [];
        vm.userLoad = userLoad;

        // 중요도 요청
        FIndCode.findByCodeType("severity").then(function(result){
            vm.code = result;
        }); //code 요청

        // min date picker
        this.dueDateFrom = {
            date: "",
            datepickerOptions: {
                maxDate: null
            }
        };
        // max date picker
        this.dueDateTo = {
            date: "",
            datepickerOptions: {
                minDate: null
            }
        };


        //검색 데이터 - 임시
        vm.searchData = {
            id : "",
            name : "",
            dueDateFrom :  "",
            dueDateTo : "",
            Severities : "",
            assignees : "",
            assigneeName : "",
            contents : ""
        };

        // 검색 form data
        vm.searchQuery = {
            dueDateFrom : "",
            dueDateTo : "",
            assigneeName : []
        };

        vm.multipleValue=[];

        // date 포멧 변경
        $scope.$watch("vm.dueDateFrom.date", function(newValue, oldValue){
            if(oldValue != newValue){
                var d = newValue;
                var formatDate =
                    datePickerFormat(d.getFullYear(), 4) + '-' +  datePickerFormat(d.getMonth() + 1, 2) + '-' + datePickerFormat(d.getDate(), 2)
                //datePickerFormat(d.getHours(), 2) + ':' + datePickerFormat(d.getMinutes(), 2) + ':' + datePickerFormat(d.getSeconds(), 2);
                vm.searchQuery.dueDateFrom = formatDate;
            }

        });
        // date 포멧 변경
        $scope.$watch("vm.dueDateTo.date", function(newValue, oldValue){
            if(oldValue != newValue){
                var d = newValue;
                var formatDate =
                    datePickerFormat(d.getFullYear(), 4) + '-' + datePickerFormat(d.getMonth() + 1, 2) + '-' + datePickerFormat(d.getDate(), 2)
                //datePickerFormat(d.getHours(), 2) + ':' + datePickerFormat(d.getMinutes(), 2) + ':' + datePickerFormat(d.getSeconds(), 2);
                vm.searchQuery.dueDateTo = formatDate;
            }
        });

        // date 포멧 변경
        function datePickerFormat(n, digits) {
            var zero = '';
            n = n.toString();

            if (n.length < digits) {
                for (var i = 0; i < digits - n.length; i++)
                    zero += '0';
            }
            return zero + n;
        }


        loadAll();

        function loadAll () {
            if (pagingParams.search) {
                TaskSearch.query({
                    query: pagingParams.search,
                    page: pagingParams.page - 1,
                    size: paginationConstants.itemsPerPage,
                    sort: sort()
                }, onSuccess, onError);
            } else {
                Task.query({
                    page: pagingParams.page - 1,
                    size: paginationConstants.itemsPerPage,
                    sort: sort()
                }, onSuccess, onError);
            }
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }
            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                vm.queryCount = vm.totalItems;
                vm.tasks = data;
                vm.page = pagingParams.page;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function loadPage (page) {
            vm.page = page;
            vm.transition();
        }

        function transition () {
            $state.transitionTo($state.$current, {
                page: vm.page,
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc'),
                search: vm.currentSearch
            });
        }

        function search (searchQuery) {
            $log.debug("searchQuery : ", searchQuery)
            if (!searchQuery){
                return vm.clear();
            }
            vm.links = null;
            vm.page = 1;
            vm.predicate = '_score';
            vm.reverse = false;
            vm.currentSearch = searchQuery;
            vm.transition();
        }

        function clear () {
            vm.links = null;
            vm.page = 1;
            vm.predicate = 'id';
            vm.reverse = true;
            vm.currentSearch = null;
            vm.transition();
        }

        // 달력 오픈
        function openCalendar(e, picker) {
            vm[picker].open = true;
        };
        // watch min and max dates to calculate difference
        var unwatchMinMaxValues = $scope.$watch(function() {
            return [vm.dueDateFrom, vm.dueDateTo];
        }, function() {
            // min max dates
            vm.dueDateFrom.datepickerOptions.maxDate = vm.dueDateTo.date;
            vm.dueDateTo.datepickerOptions.minDate = vm.dueDateFrom.date;

            if (vm.dueDateFrom.date && vm.dueDateTo.date) {
                var diff = vm.dueDateFrom.date.getTime() - vm.dueDateTo.date.getTime();
                vm.dayRange = Math.round(Math.abs(diff/(1000*60*60*24)))
            } else {
                vm.dayRange = 'n/a';
            }

        }, true);

        // 사용자 검색
        function userLoad(name, excludeList){
            var deferred = $q.defer();
            findUser.findByName(name).then(function(result){
                vm.Users = result;
                deferred.resolve(result);
            }); //user search
            return deferred.promise;
        }

    }
})();
