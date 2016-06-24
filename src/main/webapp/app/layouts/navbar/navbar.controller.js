(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$state', 'Auth', 'Principal', 'ProfileService', 'LoginService', '$scope', '$rootScope', 'navbarService', '$log', 'permissionCheck'];

    function NavbarController ($state, Auth, Principal, ProfileService, LoginService, $scope, $rootScope, navbarService, $log, permissionCheck) {
        var vm = this;
        //$log.debug("NavbarController 탔다");
        vm.isNavbarCollapsed = true;
        $scope.permissionCheck = permissionCheck;
        vm.isAuthenticated = Principal.isAuthenticated;

        //$log.debug(!$scope.permissionCheck.check("/menu"));

        ProfileService.getProfileInfo().then(function(response) {
            vm.inProduction = response.inProduction;
            vm.swaggerDisabled = response.swaggerDisabled;
        });

        vm.login = login;
        vm.logout = logout;
        vm.toggleNavbar = toggleNavbar;
        vm.collapseNavbar = collapseNavbar;
        vm.$state = $state;
        vm.getMenu = getMenu;

        function login() {
            collapseNavbar();
            LoginService.open();
        }

        function logout() {
            collapseNavbar();
            Auth.logout();
            $state.go('home');
        }

        function toggleNavbar() {
            vm.isNavbarCollapsed = !vm.isNavbarCollapsed;
        }

        function collapseNavbar() {
            vm.isNavbarCollapsed = true;
        }

        $scope.$watch("$rootScope.connectedUser", function (){
            vm.connectedUser  = $rootScope.connectedUser;
        })

        vm.menu = [];
        function getMenu(){
            navbarService.getMenu({
            }).then(function (result) {
                $log.debug("menuList : ", result)
                vm.menu = result;
            }).catch(function (err) {
                $log.debug("menuErr : ", err)
            });
        }

        vm.getMenu();

        //vm.menu = [
        //    {
        //        name: "tet1",
        //        url: "test/test",
        //        child : [
        //            {
        //                name: "tet1-1",
        //                url: "test/test"
        //            },
        //            {
        //                name: "tet1-2",
        //                url: "test/test"
        //            },
        //            {
        //                name: "tet1-3",
        //                url: "test/test"
        //            },
        //        ]
        //    },
        //    {
        //        name : "tet2",
        //        url : "test/test"
        //    },
        //    {
        //        name : "tet3",
        //        url : "test/test"
        //    },
        //    {
        //        name : "tet4",
        //        url : "test/test"
        //    }
        //];
    }
})();
