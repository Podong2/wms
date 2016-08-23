/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("projectFunctionsCtrl", projectFunctionsCtrl);
projectFunctionsCtrl.$inject=['$state', '$stateParams', '$log'];
        function projectFunctionsCtrl($state, $stateParams, $log) {
            var vm = this;
            $log.debug("function $stateParams : ", $stateParams)
            vm.projectId = $stateParams.id;

            vm.stateInfo = $state.current.name;
            vm.state = $state.get(vm.stateInfo);


        }
