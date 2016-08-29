/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("dashboardCtrl", dashboardCtrl);
dashboardCtrl.$inject=['$scope', '$log', '$rootScope', '$state', '$stateParams', 'dashboardViewInfo', 'MyDashboard'];
        function dashboardCtrl($scope, $log, $rootScope, $state, $stateParams, dashboardViewInfo, MyDashboard) {
            var vm = this;
            vm.dashboardViewInfo = dashboardViewInfo;

            $log.debug("vm.dashboardViewInfo : ", vm.dashboardViewInfo);

            vm.setDashboardViewInfo = setDashboardViewInfo;
            vm.model= {};
            vm.collapsible= true;
            vm.maximizable= true;
            vm.categories= false;
            vm.editable= (function () {
                //if (dataService.getUser().id == dashboardViewInfo.registerId) {
                //    return true;
                //}
                return false;
            })();

            vm.formData = {
                id: $stateParams.id,
                name: "",
                dashboardModel: "",
                useYn: true,
                systemYn: false
            };

            $scope.$on('adfDashboardChanged', function (event, name, model) {
                var data = JSON.stringify(model);
                vm.formData.name = model.title;
                vm.formData.dashboardModel = data;
                $log.debug("vm.formData : ", vm.formData)

                MyDashboard.update(vm.formData, success, erorr);
                function success(result){
                    $log.debug(result);
                }
                function erorr(){

                }
            });

            function setDashboardViewInfo() {
                if (vm.dashboardViewInfo.dashboardModel != null && vm.dashboardViewInfo.dashboardModel != "") {
                    vm.model = JSON.parse(vm.dashboardViewInfo.dashboardModel);
                }
                else {
                    vm.model = {
                        title: vm.dashboardViewInfo.name,
                        structure: "6-6",
                        rows: [{"columns": [{"styleClass": "col-md-12", "widgets": []}]}]
                    };
                }

                vm.model.loginYn = vm.dashboardViewInfo.loginYn;
                vm.formData.id = vm.dashboardViewInfo.id;
                vm.formData.useYn = vm.dashboardViewInfo.useYn;
                vm.formData.systemYn = vm.dashboardViewInfo.systemYn;
            }

            vm.setDashboardViewInfo(vm.dashboardViewInfo);
        }
