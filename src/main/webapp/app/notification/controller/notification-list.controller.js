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

            vm.notifications=[]; // 총 목록
            vm.notification = {
                id : ''
            }

            function getList(){
                Notification.query({}, onSuccess, onError);
            }
            getList();

            function onSuccess(data, headers) {
                $log.debug("notifications : ", data);
                vm.notifications = data;
                //$state.go("my-project.detail", {project : vm.project});
                //vm.page = pagingParams.page;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }

            function notificationReadChange(id){
                vm.notification.id = id;
                Notification.update(vm.notification, onReadSuccess, onReadError);
            }
            function onReadSuccess(result){
                getList();
            }
            function onReadError(){

            }


        }
