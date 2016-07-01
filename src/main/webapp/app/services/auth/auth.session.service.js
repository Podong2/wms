(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('AuthServerProvider', AuthServerProvider);

    AuthServerProvider.$inject = ['$http', '$localStorage' , 'JhiTrackerService', 'Principal'];

    function AuthServerProvider ($http, $localStorage , JhiTrackerService, Principal) {
        var service = {
            getToken: getToken,
            hasValidToken: hasValidToken,
            login: login,
            logout: logout
        };

        return service;

        function getToken () {
            var token = $localStorage.authenticationToken;
            return token;
        }

        function hasValidToken () {
            var token = this.getToken();
            return !!token;
        }

        function login (credentials) { // 로그인을 요청받아 서버로 보내기 전에 security에 맞는 파라메터 포멧으로 변경시켜준다.
            var data = 'j_username=' + encodeURIComponent(credentials.username) +
                '&j_password=' + encodeURIComponent(credentials.password) +
                '&remember-me=' + credentials.rememberMe + '&submit=Login';

            return $http.post('api/authentication', data, { // http 통신을 하여 최종적으로 서버에 로그인을 요청한다.
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (response) { // 로그인 성공 시 결과값을 받아서 auth service로 리턴해준다.
                return response;
            });
        }

        function logout () {
            JhiTrackerService.disconnect(); // websocket 연결 끊기


            // logout from the server
            $http.post('api/logout').success(function (response) { // 서버 사용자 연결 종료
                delete $localStorage.authenticationToken;
                Principal.logout(); // 전역 로그인 정보 초기화 및 인증 false 처리
                // to get a new csrf token call the api (csrf : Cross-site request forgery)
                $http.get('api/account');
                return response;
            });

        }
    }
})();
