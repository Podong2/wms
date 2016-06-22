(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('Principal', Principal);

    Principal.$inject = ['$q', 'Account', 'JhiTrackerService', '$log'];

    function Principal ($q, Account, JhiTrackerService, $log) {
        var _identity,
            _authenticated = false;

        var service = {
            authenticate: authenticate,
            hasAnyAuthority: hasAnyAuthority,
            hasAuthority: hasAuthority,
            identity: identity,
            isAuthenticated: isAuthenticated,
            isIdentityResolved: isIdentityResolved,
            getIdentity : getIdentity
        };

        return service;

        function authenticate (identity) {
            _identity = identity;
            _authenticated = identity !== null;
        }

        function hasAnyAuthority (authorities) {
            if (!_authenticated || !_identity || !_identity.authorities) {
                return false;
            }

            for (var i = 0; i < authorities.length; i++) {
                if (_identity.authorities.indexOf(authorities[i]) !== -1) {
                    return true;
                }
            }

            return false;
        }

        function hasAuthority (authority) {
            if (!_authenticated) {
                return $q.when(false);
            }

            return this.identity().then(function(_id) {
                return _id.authorities && _id.authorities.indexOf(authority) !== -1;
            }, function(){
                return false;
            });
        }

        function identity (force) {
            var deferred = $q.defer();

            if (force === true) {
                _identity = undefined;
            }

            // check and see if we have retrieved the identity data from the server.
            // if we have, reuse it by immediately resolving
            // 서버로부터 참조한 검색값을 확인한다.
            // 참조한 값이 있는경우 즉시 해결하여 재사용한다.
            if (angular.isDefined(_identity)) {
                deferred.resolve(_identity); // 재사용값을 promise에 담아 전달해준다.

                return deferred.promise;
            }

            // retrieve the identity data from the server, update the identity object, and then resolve.
            // 서버에서 사용자를 조회하여 사용자 정보를 primise로 업데이트한다.
            Account.get().$promise
                .then(getAccountThen)
                .catch(getAccountCatch);

            return deferred.promise;

            function getAccountThen (account) { // 사용자 정보를 받아서
                _identity = account.data; // _identity에 사용자 정보 주입
                $log.debug("_identity : ", _identity);
                _authenticated = true; // 인증 true
                deferred.resolve(_identity); // 값을 promise 에 전달
                JhiTrackerService.connect(); // 접속중인 url 정보의 websocket으로 연결한다.
            }

            function getAccountCatch () {
                _identity = null;
                _authenticated = false;
                deferred.resolve(_identity);
            }
        }

        function isAuthenticated () {
            return _authenticated;
        }

        function isIdentityResolved () {
            return angular.isDefined(_identity);
        }
        function getIdentity () {
            return _identity;
        }
    }
})();
