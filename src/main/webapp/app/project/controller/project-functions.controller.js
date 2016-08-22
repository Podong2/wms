/**
 * Created by Jeong on 2016-03-16.
 */
'use strict';

angular.module('wmsApp')
    .controller("projectFunctionsCtrl", projectFunctionsCtrl);
projectFunctionsCtrl.$inject=['$state'];
        function projectFunctionsCtrl($state) {
            var vm = this;

            vm.stateInfo = $state.current.name;
            vm.state = $state.get(vm.stateInfo);


        }
