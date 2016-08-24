/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("notificationListCtrl", notificationListCtrl);
notificationListCtrl.$inject=['$scope', 'Code', '$log', 'AlertService', '$rootScope', '$state', '$stateParams', 'toastr', 'Notification'];
        function notificationListCtrl($scope, Code, $log, AlertService, $rootScope, $state, $stateParams, toastr, Notification) {
            var vm = this;
            //vm.showDetail = showDetail;

            vm.notifications=[]; // 총 목록

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



        }
