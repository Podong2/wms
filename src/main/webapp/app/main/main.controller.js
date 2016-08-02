(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('MainController', MainController);

    MainController.$inject = ['$state', 'Auth', 'Principal', 'ProfileService', 'LoginService', '$scope', '$rootScope', 'navbarService', '$log', 'permissionCheck', '$http', 'ModalService'];

    function MainController ($state, Auth, Principal, ProfileService, LoginService, $scope, $rootScope, navbarService, $log, permissionCheck, $http, ModalService) {
        var vm = this;
        $scope.taskAddModalOpen = taskAddModalOpen;
        $log.debug("MainController 탔다");
        vm.connectedUsers= [];

        // 현재 접속중인 사용자 목록
        function connectedUserList() {
            if(Principal.isIdentityResolved()) { // 로그인 정보 있으면 요청
                $http.get("/api/account/connected-principals").success(function (response) {
                    //$log.debug("response : ", response)
                    vm.connectedUsers = response;
                    //$log.debug("$rootScope.connectedUser : ", $rootScope.connectedUser)
                });
            }
        }

        $scope.fixedPageFooter = false;


        // modal open
        function taskAddModalOpen(){
            var editModalConfig = {
                size : "lg",
                url : "taskAdd.html",
                ctrl : "taskEditCtrl"
            };

            ModalService.openModal(editModalConfig);
            //ModalService.open("title1", "content1", "taskAdd.html", 'TaskDialogController');
        }

        connectedUserList();
    }
})();
