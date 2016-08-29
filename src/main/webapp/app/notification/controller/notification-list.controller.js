/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("notificationListCtrl", notificationListCtrl);
notificationListCtrl.$inject=['$scope', 'Code', '$log', 'AlertService', '$rootScope', '$state', '$stateParams', 'toastr', 'Notification', 'ReadUpload'];
        function notificationListCtrl($scope, Code, $log, AlertService, $rootScope, $state, $stateParams, toastr, Notification, ReadUpload) {
            var vm = this;
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

            function getList(number){
                tabDisplay(number);
                Notification.query({listType : 'UN_READ'}, onSuccess, onError);
            }
            vm.getList(0);

            function getReadList(number){
                tabDisplay(number);
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
                vm.notifications = data;
                //$state.go("my-project.detail", {project : vm.project});
                //vm.page = pagingParams.page;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }

            function notificationReadChange(id, checkType){
                ReadUpload.put(id, checkType).then(function(){
                    getList();
                });
            }

        }
