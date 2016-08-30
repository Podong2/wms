'use strict';

angular.module('wmsApp')
    .controller("userProfileCtrl", userProfileCtrl);
userProfileCtrl.$inject=['$scope', '$log', '$rootScope', '$state', '$stateParams', 'toastr', 'Principal', 'UserInfo'];
        function userProfileCtrl($scope, $log, $rootScope, $state, $stateParams, toastr, Principal, UserInfo) {
            var vm = this;
            vm.userInfo = Principal.getIdentity();
            var files = '';
            vm.userUpload = userUpload;
            $scope.uploadFile = function(event){
                files = event.target.files;
                $log.debug("files, ", files)
                userUpload();
            };

            vm.user = {
                id : vm.userInfo.id,
                name : vm.userInfo.name,
                phone : vm.userInfo.phone,
                email : vm.userInfo.email,
                login : vm.userInfo.login
            }

            function userUpload(){
                $log.debug("vm.user ;::::::", vm.user);
                UserInfo.upload({
                    method : "POST",
                    file : files[0],
                    //	data 속성으로 별도의 데이터 전송
                    fields : vm.user,
                    fileFormDataName : "file"
                }).then(function (response) {
                    toastr.success('유저 수정 완료', '유저 수정 완료');
                });
            }

        }
