(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('UserInfo', UserInfo);

    UserInfo.$inject = ['$upload', '$log'];

    function UserInfo ($upload, $log) {

        var service = {
            upload : upload
        };
        return service;
        function upload(parameter){
            parameter.url = "api/users/updateUser";
            $log.debug("parameter : ", parameter);
            return $upload.upload(parameter).then(function (response) {
                $log.debug("유저 수정 결과 : ", response);
                return response;
            });
        }

    }


})();
