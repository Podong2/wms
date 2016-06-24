(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('Auth', Auth);
    // service : 싱글톤의 특성을 가지고 있고 컨트롤러간 통신을 제어하거나, 리소스 접근 권한을 가진
    // 객체를 리턴해서 컨트롤러에서 이 객체로 CRUD 임무를 수행하는등의 방식으로 사용된다.
    // factory : 일반적으로 사용하는 서비스로서 비지니스 로직 또는 모듈 제공자로 사용한다.
    // 객체나 클로저를 반환한다.

    Auth.$inject = ['$rootScope', '$state', '$sessionStorage', '$q', '$translate', 'Principal', 'AuthServerProvider', 'Account', 'LoginService', 'Register', 'Activate', 'Password', 'PasswordResetInit', 'PasswordResetFinish', 'JhiTrackerService', '$http', '$log', 'UserPermission', 'PagePermission'];

    function Auth ($rootScope, $state, $sessionStorage, $q, $translate, Principal, AuthServerProvider, Account, LoginService, Register, Activate, Password, PasswordResetInit, PasswordResetFinish, JhiTrackerService, $http, $log, UserPermission, PagePermission) {
        var service = {
            activateAccount: activateAccount,
            authorize: authorize,
            changePassword: changePassword,
            createAccount: createAccount,
            getPreviousState: getPreviousState,
            login: login,
            logout: logout,
            resetPasswordFinish: resetPasswordFinish,
            resetPasswordInit: resetPasswordInit,
            resetPreviousState: resetPreviousState,
            storePreviousState: storePreviousState,
            connectedUserList: connectedUserList
        };

        return service;

        function activateAccount (key, callback) {
            var cb = callback || angular.noop;

            return Activate.get(key,
                function (response) {
                    return cb(response);
                },
                function (err) {
                    return cb(err);
                }.bind(this)).$promise;
        }

        function authorize (force) {
            var authReturn = Principal.identity(force).then(authThen);

            return authReturn;

            function authThen () {
                var isAuthenticated = Principal.isAuthenticated();

                // an authenticated user can't access to login and register pages
                if (isAuthenticated && $rootScope.toState.parent === 'account' && ($rootScope.toState.name === 'login' || $rootScope.toState.name === 'register')) {
                    $state.go('home');
                }

                // recover and clear previousState after external login redirect (e.g. oauth2)
                if (isAuthenticated && !$rootScope.fromState.name && getPreviousState()) {
                    var previousState = getPreviousState();
                    resetPreviousState();
                    $state.go(previousState.name, previousState.params);
                }

                if (!angular.isDefined($rootScope.authorities)) {
                    $rootScope.authorities = {};
                }

                if (Principal.isIdentityResolved() && Principal.isAuthenticated()) {
                    if ($rootScope.authorities[''] === undefined) {
                        //  전체 권한 업데이트
                        UserPermission.getUserPermission();

                    }
                }

                //  권한이 없을 경우 새로고침한 상태로 인식하여 서버에서 전체 권한을 요청한다.
                if (angular.isDefined($rootScope.authorities[""])) {
                    $log.debug("권한 정의 : " , $rootScope.authorities);
                    if ($rootScope.toState.data.authorities && $rootScope.toState.data.authorities.length > 0 && !Principal.hasAnyAuthority($rootScope.toState.data.authorities)) {
                        if (isAuthenticated) {
                            // user is signed in but not authorized for desired state
                            $log.error("페이지 거부 - 권한이 없음, 이전 화면으로 이동");
                            $state.go($state.current, {}, {reload: true});
                        }
                        else {
                            // user is not authenticated. stow the state they wanted before you
                            // send them to the login service, so you can return them when you're done
                            storePreviousState($rootScope.toState.name, $rootScope.toStateParams);

                            // now, send them to the signin state so they can log in
                            $state.go('accessdenied').then(function() {
                                LoginService.open();
                            });
                        }
                    }
                }


            }
        }

        function changePassword (newPassword, callback) {
            var cb = callback || angular.noop;

            return Password.save(newPassword, function () {
                return cb();
            }, function (err) {
                return cb(err);
            }).$promise;
        }

        function createAccount (account, callback) {
            var cb = callback || angular.noop;

            return Register.save(account,
                function () {
                    return cb(account);
                },
                function (err) {
                    this.logout();
                    return cb(err);
                }.bind(this)).$promise;
        }

        function login (credentials, callback) { // login controller에서 login요청을 받아서 수행한다
            var cb = callback || angular.noop;
            var deferred = $q.defer();

            AuthServerProvider.login(credentials)// AuthServerProvider 를 이용하여 login을 요청한다.
                .then(loginThen)// 로그인 결과값을 리턴받아서 loginThen function에 값을 전달한다.
                .catch(function (err) {
                    this.logout();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));

            function loginThen (data) {
                Principal.identity(true).then(function(account) {

                    if (account!== null) { // 로그인 후에 사용자의 선택된 언어로 변경된다.
                        $translate.use(account.langKey).then(function () {
                            $translate.refresh();
                        });
                    }
                    JhiTrackerService.sendActivity(); // 해당사용자의 활동상태를 websocket에 전달한다.
                    deferred.resolve(data);
                });
                return cb();
            }

            return deferred.promise;
        }


        function logout () {
            AuthServerProvider.logout(); // 로그아웃

            Principal.authenticate(null); // 인증실패
        }

        function resetPasswordFinish (keyAndPassword, callback) {
            var cb = callback || angular.noop;

            return PasswordResetFinish.save(keyAndPassword, function () {
                return cb();
            }, function (err) {
                return cb(err);
            }).$promise;
        }

        function resetPasswordInit (mail, callback) {
            var cb = callback || angular.noop;

            return PasswordResetInit.save(mail, function() {
                return cb();
            }, function (err) {
                return cb(err);
            }).$promise;
        }

        function updateAccount (account, callback) {
            var cb = callback || angular.noop;

            return Account.save(account,
                function () {
                    return cb(account);
                },
                function (err) {
                    return cb(err);
                }.bind(this)).$promise;
        }

        function getPreviousState() {
            var previousState = $sessionStorage.previousState;
            return previousState;
        }

        function resetPreviousState() {
            delete $sessionStorage.previousState;
        }

        function storePreviousState(previousStateName, previousStateParams) {
            var previousState = { "name": previousStateName, "params": previousStateParams };
            $sessionStorage.previousState = previousState;
        }

        // 현재 접속중인 사용자 목록
        function connectedUserList() {
            $http.get("/api/account/connected-principals").success(function (response) {
                //$log.debug("response : ", response)
                $rootScope.connectedUser = response;
                //$log.debug("$rootScope.connectedUser : ", $rootScope.connectedUser)
            });
        }
    }
})();
