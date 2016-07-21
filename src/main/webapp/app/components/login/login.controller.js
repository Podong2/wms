(function() {
    'use strict';

    angular
        .module('wmsApp') // 모듈 선언
        .controller('LoginController', LoginController); // 컨트롤러 선언

    LoginController.$inject = ['$rootScope', '$state', '$timeout', 'Auth', '$log', 'toastr'];
    // $inject를 이용하여 의존성을 주입하여 객체들의 의존성을 최소화 시킨다.

    function LoginController ($rootScope, $state, $timeout, Auth, $log, toastr) {
        // Controller란 사용자가 접근한 url에 따라서 사용자에게 요청에 맞는 데이터를 scope에 주입하거나
        // model에 의뢰하여, view에 반영하여 사용자에게 알려준다.
        // 서버 에서 직접 뷰 로 접근하는 일종의 중간 통로로서 필요할 때마다 서버와 클라이언트
        // 통신으로 데이터를 변경한다.
        var vm = this;

        vm.authenticationError = false;
        vm.cancel = cancel;
        vm.credentials = {};
        vm.login = login;
        vm.password = null;
        vm.register = register;
        vm.rememberMe = true;
        vm.requestResetPassword = requestResetPassword;
        vm.username = null;

        $timeout(function (){angular.element('#username').focus();});

        function cancel () {
            vm.credentials = {
                username: null,
                password: null,
                rememberMe: true
            };
            vm.authenticationError = false;
            //$uibModalInstance.dismiss('cancel');
        }

        function login (event) { // 사용자가 html에서 로그인시 login function이 호출된다.
            vm.authenticationError = false;
            event.preventDefault();
            Auth.login({ // Auth service를 이용하여 로그인을 수행한다.
                username: vm.username,
                password: vm.password,
                rememberMe: vm.rememberMe
            }).then(function () { //
                vm.authenticationError = false; // 인증오류값을 false로 변경
                //$uibModalInstance.close(); // 오픈된 modal들을 모두 닫는다.
                if ($state.current.name === 'register' || $state.current.name === 'activate' ||
                    $state.current.name === 'finishReset' || $state.current.name === 'requestReset') {
                    $state.go('home'); // 해당 조건에 맞을 시 home으로 이동한다.
                }

                $rootScope.$broadcast('authenticationSuccess'); // 인증성공

                // previousState was set in the authExpiredInterceptor before being redirected to login modal.
                // since login is succesful, go to stored previousState and clear previousState
                if (Auth.getPreviousState()) {
                    // 로그인 성공 이후에 이전의 상태를 저장하고 이전상태를 clear 한다.
                    var previousState = Auth.getPreviousState();
                    Auth.resetPreviousState();
                    $state.go(previousState.name, previousState.params);
                }
                toastr.success('로그인을 성공 하였습니다.', 'WMS System Message');
                $state.go('component');
            }).catch(function (err) {
                $log.debug("err : ", err.data.message);
                vm.authenticationError = true;
                vm.authenticationErrorMessage = err.data.message;
                toastr.error('로그인을 실패 하였습니다.', 'WMS System Message');
            });
        }

        function register () {
            //$uibModalInstance.dismiss('cancel');
            $state.go('register');
        }

        function requestResetPassword () {
            //$uibModalInstance.dismiss('cancel');
            $state.go('requestReset');
        }
    }
})();
