/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("taskRecentHistoryCtrl", taskRecentHistoryCtrl);
taskRecentHistoryCtrl.$inject=['$scope', 'Code', '$log', 'AlertService', 'ParseLinks', '$rootScope', '$state', 'paginationConstants', 'FindTaskRecentHistory', 'PaginationUtil', '$stateParams', 'UnreadCount', '$translate','$translatePartialLoader'];
        function taskRecentHistoryCtrl($scope, Code, $log, AlertService, ParseLinks, $rootScope, $state, paginationConstants, FindTaskRecentHistory, PaginationUtil, $stateParams, UnreadCount, $translate, $translatePartialLoader) {
            var vm = this;
            vm.getCurrentHistory = getCurrentHistory;

            vm.params = {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            };
            vm.day = new Date().format("MM/dd")

            vm.page =  PaginationUtil.parsePage(vm.params.page.value);
            vm.sort =  vm.params.sort.value;
            vm.predicate =  PaginationUtil.parsePredicate(vm.params.sort.value);
            vm.ascending =  PaginationUtil.parseAscending(vm.params.sort.value);
            vm.search =  vm.params.search;
            vm.historyList = [];

            vm.totalItems = null;

            //vm.searchQuery.page = (vm.page -1);
            //vm.searchQuery.size = paginationConstants.itemsPerPage;
            //vm.searchQuery.sort = "desc";
            //vm.searchQuery.sortField = "id";


            function list(){
                FindTaskRecentHistory.query({
                    query: vm.search,
                    page: vm.page - 1,
                    size: 10,
                    sort: 'desc'
                }, onSuccess, onError);
            }
            function onSuccess(result){
                vm.historyList = result;
                $translatePartialLoader.addPart('global');
                $translate.refresh();
            }

            function onError(){

            }

            list();

            function getCurrentHistory(){
                vm.page ++;
                $log.debug("vm.page : ", vm.page);
                FindTaskRecentHistory.query({
                    query: vm.search,
                    page: vm.page - 1,
                    size: 10,
                    sort: 'desc'
                }, onPlusSuccess, onError);
            }
            function onPlusSuccess(result){
                $log.debug("더보기 결과 : ", result)
                angular.forEach(result, function(value, index){
                    vm.historyList.push(value);
                });
            }

            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }

            /* 알림 카운트 */
            vm.notificationCount = '';
            UnreadCount.get({}, successNotification, erorrNotification);
            function successNotification(result){
                vm.notificationCount = result.count;
            }
            function erorrNotification(){

            }

        }
