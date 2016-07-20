(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('RegisterController', RegisterController);


    RegisterController.$inject = ['$translate', '$timeout', 'Auth', 'LoginService', 'Department', 'Company', '$state', 'toastr'];

    function RegisterController ($translate, $timeout, Auth, LoginService, Department, Company, $state, toastr) {
        var vm = this;

        vm.doNotMatch = null;
        vm.error = null;
        vm.errorUserExists = null;
        vm.login = LoginService.open;
        vm.register = register;
        vm.registerAccount = {};
        vm.success = null;
        vm.departments = Department.query();
        vm.companies = Company.query();

        $timeout(function (){angular.element('#login').focus();});

        function register () {
            if (vm.registerAccount.password !== vm.confirmPassword) {
                vm.doNotMatch = 'ERROR';
            } else {
                vm.registerAccount.langKey = $translate.use();
                vm.doNotMatch = null;
                vm.error = null;
                vm.errorUserExists = null;
                vm.errorEmailExists = null;

                Auth.createAccount(vm.registerAccount).then(function () {
                    vm.success = 'OK';
                    toastr.success('가입을 성공 하였습니다. 로그인하여 이용하세요.', 'WMS System Message');
                    $state.go('login');
                }).catch(function (response) {
                    vm.success = null;
                    if (response.status === 400 && response.data === 'login already in use') {
                        vm.errorUserExists = 'ERROR';
                        toastr.error('가입을 실패 하였습니다.', 'WMS System Message');
                    } else if (response.status === 400 && response.data === 'e-mail address already in use') {
                        vm.errorEmailExists = 'ERROR';
                        toastr.error('가입을 실패 하였습니다.', 'WMS System Message');
                    } else {
                        vm.error = 'ERROR';
                        toastr.error('가입을 실패 하였습니다.', 'WMS System Message');
                    }
                });
            }
        }
    }
})();
