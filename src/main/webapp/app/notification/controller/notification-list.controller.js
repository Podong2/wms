/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("notificationListCtrl", notificationListCtrl);
notificationListCtrl.$inject=['$scope', 'Code', '$log', 'AlertService', '$rootScope', '$state', '$stateParams', 'toastr', 'Notification', 'ReadUpload'];
        function notificationListCtrl($scope, Code, $log, AlertService, $rootScope, $state, $stateParams, toastr, Notification, ReadUpload) {
            var vm = this;
            vm.baseUrl = window.location.origin;
            //vm.showDetail = showDetail;
            vm.notificationReadChange = notificationReadChange;
            vm.getList = getList;

            vm.notifications=[]; // 총 목록
            vm.notification = {
                id : ''
            }
            vm.firstYn = true;

            vm.tabArea = [
                { status: true },  // 새로운 알림
                { status: false }  // 확인한 알림
            ];
            vm.listType = 'UN_READ';
            // 목록 스크롤 로딩
            $scope.taskScroll= {
                loading : false
            };

            /* 알림 목록 // 0 : 안읽은, 1: 읽은 */
            function getList(number, initYn){
                tabDisplay(number);
                vm.initYn = initYn == undefined ? false : initYn;
                if(number != undefined){
                    vm.page = 1;
                    if(number == 0) vm.listType = 'UN_READ';
                    else vm.listType ='READ';
                }
                Notification.query({
                    listType : vm.listType,
                    page: vm.page - 1,
                    size: 15,
                    sort: 'desc'
                }, onSuccess, onError);
            }
            vm.getList(0);

            function onSuccess(data, headers) {
                if(data.length > 0){
                    if(vm.initYn) vm.notifications = [];
                    angular.forEach(data, function (newValue, oldValue){
                        vm.notifications.push(newValue)
                    });

                    $log.debug("notifications : ", vm.notifications);
                    vm.page++;
                    $scope.taskScroll.loading = false;
                    //if(vm.firstYn) $state.go("my-notification.taskDetail", {taskId : vm.notifications[0].taskDTO.id, listType : 'TODAY'}); // 첫 알림 상세 오픈
                }
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }

            ///* 읽은 알림 목록 */
            //function getReadList(number){
            //    tabDisplay(number);
            //    vm.listType = 'READ';
            //    Notification.query({
            //        listType : 'READ',
            //        page: vm.page - 1,
            //        size: 15,
            //        sort: 'desc'
            //    }, onSuccess, onError);
            //}

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

            /* 알림 읽음 변경 */
            function notificationReadChange(id, checkType, index){
                vm.firstYn = false;
                if(checkType != 'confirm') vm.notifications[index].readYn = true;
                ReadUpload.put(id, checkType).then(function(){
                    getList(0, true)
                });
            }

        }
