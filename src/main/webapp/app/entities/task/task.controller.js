(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('TaskController', TaskController);

    TaskController.$inject = ['$scope', '$state', 'Task', 'TaskRemove', 'TaskSearch', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants', 'FIndCode', 'User', '$log', '$rootScope', 'findUser', '$q', 'TaskListSearch', 'tableService', 'DateUtils', 'TaskEdit', 'toastr', '$http'];

    function TaskController ($scope, $state, Task, TaskRemove, TaskSearch, ParseLinks, AlertService, pagingParams, paginationConstants, FIndCode, User, $log, $rootScope, findUser, $q, TaskListSearch, tableService, DateUtils, TaskEdit, toastr, $http) {
        var vm = this;


        vm.tableService = tableService;
        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.clear = clear;
        vm.search = search;
        //vm.searchQuery = pagingParams.search;
        vm.currentSearch = pagingParams.search;
        vm.openCalendar = openCalendar;
        vm.assigneeUsers = [];
        vm.userLoad = userLoad;
        vm.getList = getList;
        vm.removeTasks = removeTasks;
        vm.singleUpload = singleUpload;
        vm.page = 1;
        vm.totalItems = null;

        //	목록 데이터 저장
        vm.responseData = {
            data : [],
            page : {
                totalPage : 1
            }
        };

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


        ////검색 데이터 - 임시
        //vm.searchData = {
        //    id : "",
        //    name : "",
        //    dueDateFrom :  "",
        //    dueDateTo : "",
        //    Severities : "",
        //    assignees : "",
        //    assigneeName : "",
        //    contents : ""
        //};
        vm.severities = [];
        // 검색 form data
        vm.searchQuery = {
            dueDateFrom : "",
            dueDateTo : "",
            assignees : [],
            name : "",
            severities : []
        };

        vm.multipleValue=[];

        // 담당자 변경
        $scope.$watchCollection("vm.assigneeUsers", function(newValue, oldValue){
            vm.searchQuery.assignees =[];
            angular.forEach(newValue, function(value){
                vm.searchQuery.assignees.push(value.id);
            });

        });

        // date 포멧 변경
        $scope.$watch("vm.dueDateFrom.date", function(newValue, oldValue){
            if(oldValue != newValue){
                var d = newValue;
                var formatDate =
                    DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' +  DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                //datePickerFormat(d.getHours(), 2) + ':' + datePickerFormat(d.getMinutes(), 2) + ':' + datePickerFormat(d.getSeconds(), 2);
                vm.searchQuery.dueDateFrom = formatDate;
            }

        });
        // date 포멧 변경
        $scope.$watch("vm.dueDateTo.date", function(newValue, oldValue){
            if(oldValue != newValue){
                var d = newValue;
                var formatDate =
                    DateUtils.datePickerFormat(d.getFullYear(), 4) + '-' + DateUtils.datePickerFormat(d.getMonth() + 1, 2) + '-' + DateUtils.datePickerFormat(d.getDate(), 2)
                //datePickerFormat(d.getHours(), 2) + ':' + datePickerFormat(d.getMinutes(), 2) + ':' + datePickerFormat(d.getSeconds(), 2);
                vm.searchQuery.dueDateTo = formatDate;
            }
        });

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
                vm.responseData.data = data;
                $log.debug("data : ", vm.responseData);
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
        //var unwatchMinMaxValues = $scope.$watch(function() {
        //    return [vm.dueDateFrom, vm.dueDateTo];
        //}, function() {
        //    // min max dates
        //    vm.dueDateFrom.datepickerOptions.maxDate = vm.dueDateTo.date;
        //    vm.dueDateTo.datepickerOptions.minDate = vm.dueDateFrom.date;
        //
        //    if (vm.dueDateFrom.date && vm.dueDateTo.date) {
        //        var diff = vm.dueDateFrom.date.getTime() - vm.dueDateTo.date.getTime();
        //        vm.dayRange = Math.round(Math.abs(diff/(1000*60*60*24)))
        //    } else {
        //        vm.dayRange = 'n/a';
        //    }
        //
        //}, true);

        // 사용자 검색
        function userLoad(name, excludeList){
            var deferred = $q.defer();
            findUser.findByName(name).then(function(result){
                vm.Users = result;
                deferred.resolve(result);
            }); //user search
            return deferred.promise;
        }

        function getList(){

            $log.debug("vm.searchQuery : ", vm.searchQuery);

            // TODO 페이지 처리 공통 처리 할것
            vm.searchQuery.page = (vm.page -1);
            vm.searchQuery.size = 20;
            vm.searchQuery.sort = "desc";
            vm.searchQuery.sortField = "id";

            // {page: vm.page - 1, size: paginationConstants.itemsPerPage}
            TaskListSearch.findTaskList(vm.searchQuery).then(function(result){
                $log.debug("vm.tasks : ", result);
                //vm.tasks = result;

                vm.links = ParseLinks.parse(result.headers('link'));
                vm.totalItems = result.headers('X-Total-Count');

                $log.debug("vm.links : ", vm.links);
                $log.debug("vm.totalItems : ", vm.totalItems);

                vm.responseData = result;
            })
        }

        function removeTasks() {
            $log.debug("tasks : ", vm.tasks);

            var removeTargetIds = [];

            angular.forEach(vm.tasks, function(task){

                if(task.checked)
                    removeTargetIds.push(task.id);
            });

            $log.debug("removeTargetIds.length : ", removeTargetIds.length);

            if(removeTargetIds.length == 0)
                return;

            if(removeTargetIds.length == 1) {

                return $http.delete( '/api/tasks/'+removeTargetIds[0], {}, {}).then(function (result) {

                    toastr.success('태스크 삭제 완료', '태스크 삭제 완료');
                    $state.go("task", {}, {reload : true});
                    return result;
                });
            } else {

                return $http.delete( '/api/tasks?targetIds='+removeTargetIds.join(","), {}, {}).then(function (result) {

                    toastr.success('태스크 삭제 완료', '태스크 삭제 완료');
                    $state.go("task", {}, {reload : true});
                    return result;
                });
            }

        }

        $scope.changPageRowCount = changPageRowCount;

        // 페이지 로우 변경 감지
        function changPageRowCount (selectedPageRowCount) {
            $scope.selectedPageRowCount = selectedPageRowCount;
            //변경된 페이지 숫자 쿠키 기록
            //cookieService.setCookie("/selectedPageRowCount", $scope.selectedPageRowCount);

            vm.getList(0);
        }

        /* 이슈 명 단일 변경 이벤트 */
        function singleUpload(taskInfo){
            $log.debug("taskInfo :", taskInfo);
            TaskEdit.singleUpload(taskInfo).then(function (response) {
                $log.debug("Task single upload success.");
            });
            $scope.tableConfigs = []; // 테이블 초기화
            makeTableConfig(); // 테이블 다시 그리기
        }

        $scope.makeTableConfig = makeTableConfig;
        // 테이블 설정
        $scope.tableConfigs = [];
        function makeTableConfig () {
            $scope.tableConfigs.push(tableService.getConfig("", "checked")
                .setHWidth("width-30-p")
                .setDAlign("text-center")
                .setHAlign("text-center")
                .setDType("check"));
            $scope.tableConfigs.push(tableService.getConfig("이슈 명", "name")
                .setDType("renderer")
                .setDRenderer("issue_detail"));
            $scope.tableConfigs.push(tableService.getConfig("담당자", "assigneeName")
                .setHWidth("width-160-p")
                .setDAlign("text-center"));
            $scope.tableConfigs.push(tableService.getConfig("종료일", "dueDate")
                .setHWidth("width-160-p")
                .setDAlign("text-center"));

            /**
             *
             .setDType(uiConstant.common.RENDERER)
             .setDRenderer(uiConstant.renderType.PROJECT_ROLE_DETAIL)
             */

            $scope.tableConfigs.push(tableService.getConfig("중요도", "severityName")
                .setHWidth("width-80-p")
                .setDAlign("text-center"));
            $scope.tableConfigs.push(tableService.getConfig("설정")
                .setHWidth("width-80-p")
                .setDAlign("text-center")
                .setHAlign("text-center")
                .setDType("renderer")
                .setDRenderer("config"));
        }

        vm.getData = getData;
        function getData () {
            return vm.responseData.data;
        }

        $scope.makeTableConfig();

    }
})();
