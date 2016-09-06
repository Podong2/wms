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
            vm.getReadList = getReadList;
            vm.getList = getList;

            vm.notifications=[]; // 총 목록
            vm.notification = {
                id : ''
            }

            vm.tabArea = [
                { status: true },  // 새로운 알림
                { status: false }  // 확인한 알림
            ];
            vm.listType = 'UN_READ';

            function getList(number){
                tabDisplay(number);
                vm.listType = 'UN_READ';
                Notification.query({listType : 'UN_READ'}, onSuccess, onError);
            }
            vm.getList(0);

            function getReadList(number){
                tabDisplay(number);
                vm.listType = 'READ';
                Notification.query({listType : 'READ'}, onSuccess, onError);
            }

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

            function onSuccess(data, headers) {
                $log.debug("notifications : ", data);
                if(data.length > 0){
                    vm.notifications = data;
                    $state.go("my-notification.taskDetail", {taskId : vm.notifications[0].taskDTO.id, listType : 'TODAY'}); // 첫 알림 상세 오픈
                }
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }

            function notificationReadChange(id, checkType, index){
                if(checkType != 'confirm') vm.notifications[index].readYn = true;
                ReadUpload.put(id, checkType).then(function(){
                    Notification.query({listType : vm.listType}, onSuccess, onError);
                });
            }

        }
