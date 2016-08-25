(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$state', 'Auth', 'Principal', 'ProfileService', 'LoginService', '$scope', '$rootScope', 'navbarService', '$log', 'permissionCheck', 'UnreadCount'];

    function NavbarController ($state, Auth, Principal, ProfileService, LoginService, $scope, $rootScope, navbarService, $log, permissionCheck, UnreadCount) {
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
            //LoginService.open();
            $state.go('login');
        }


        function logout() {
            collapseNavbar();
            Auth.logout();
            $state.go('login');
        }

        /* 알림 카운트 */
        vm.notificationCount = '';
        UnreadCount.get({}, successNotification, erorrNotification);
        function successNotification(result){
            vm.notificationCount = result.count;
        }
        function erorrNotification(){

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

        vm.menu = [
            {
                "id": 10002,
                "name": "Entities",
                "description": "23456",
                "area": "1",
                "position": 1,
                "status": "1",
                "projectYn": null,
                "systemYn": null,
                "mobileYn": null,
                "hrIncludeYn": null,
                "urlPath": "entities",
                "permissionUrl": "/entities",
                "displayYn": false,
                "parentId": null,
                "childMenus": [
                    {
                        "id": 10018,
                        "name": "Department",
                        "description": "Department 메뉴",
                        "area": "1",
                        "position": 1,
                        "status": "1",
                        "projectYn": false,
                        "systemYn": null,
                        "mobileYn": null,
                        "hrIncludeYn": null,
                        "urlPath": "department",
                        "permissionUrl": "/department",
                        "displayYn": false,
                        "parentId": 10002,
                        "childMenus": []
                    },
                    {
                        "id": 10022,
                        "name": "Company",
                        "description": "Company 메뉴",
                        "area": "1",
                        "position": 2,
                        "status": "1",
                        "projectYn": null,
                        "systemYn": null,
                        "mobileYn": null,
                        "hrIncludeYn": null,
                        "urlPath": "company",
                        "permissionUrl": "/company",
                        "displayYn": false,
                        "parentId": 10002,
                        "childMenus": []
                    },
                    {
                        "id": 10019,
                        "name": "Menu",
                        "description": "Menu",
                        "area": "1",
                        "position": 3,
                        "status": "1",
                        "projectYn": null,
                        "systemYn": null,
                        "mobileYn": null,
                        "hrIncludeYn": null,
                        "urlPath": "menu",
                        "permissionUrl": "/menu",
                        "displayYn": false,
                        "parentId": 10002,
                        "childMenus": []
                    },
                    {
                        "id": 10020,
                        "name": "Permission",
                        "description": "Permission 메뉴",
                        "area": "1",
                        "position": 4,
                        "status": "1",
                        "projectYn": null,
                        "systemYn": null,
                        "mobileYn": null,
                        "hrIncludeYn": null,
                        "urlPath": "permission",
                        "permissionUrl": "/permission",
                        "displayYn": false,
                        "parentId": 10002,
                        "childMenus": []
                    },
                    {
                        "id": 10021,
                        "name": "Permission Category",
                        "description": "Permission Category 메뉴",
                        "area": "1",
                        "position": 5,
                        "status": "1",
                        "projectYn": null,
                        "systemYn": null,
                        "mobileYn": null,
                        "hrIncludeYn": null,
                        "urlPath": "permission-category",
                        "permissionUrl": "/permissionCategory",
                        "displayYn": false,
                        "parentId": 10002,
                        "childMenus": []
                    },
                    {
                        "id": 10023,
                        "name": "Menu Permission",
                        "description": "Menu Permission 메뉴",
                        "area": "1",
                        "position": 6,
                        "status": "1",
                        "projectYn": null,
                        "systemYn": null,
                        "mobileYn": null,
                        "hrIncludeYn": null,
                        "urlPath": "menu-permission",
                        "permissionUrl": "/menuPermission",
                        "displayYn": false,
                        "parentId": 10002,
                        "childMenus": []
                    },
                    {
                        "id": 10024,
                        "name": "System Role",
                        "description": "System Role 메뉴",
                        "area": "1",
                        "position": 7,
                        "status": "1",
                        "projectYn": null,
                        "systemYn": null,
                        "mobileYn": null,
                        "hrIncludeYn": null,
                        "urlPath": "system-role",
                        "permissionUrl": "/systemRole",
                        "displayYn": false,
                        "parentId": 10002,
                        "childMenus": []
                    },
                    {
                        "id": 10025,
                        "name": "System Role Permission",
                        "description": "System Role Permission 메뉴",
                        "area": "1",
                        "position": 8,
                        "status": "1",
                        "projectYn": null,
                        "systemYn": null,
                        "mobileYn": null,
                        "hrIncludeYn": null,
                        "urlPath": "system-role-permission",
                        "permissionUrl": "/systemRolePermission",
                        "displayYn": false,
                        "parentId": 10002,
                        "childMenus": []
                    },
                    {
                        "id": 10026,
                        "name": "System Role User",
                        "description": "System Role User 메뉴",
                        "area": "1",
                        "position": 9,
                        "status": "1",
                        "projectYn": null,
                        "systemYn": null,
                        "mobileYn": null,
                        "hrIncludeYn": null,
                        "urlPath": "system-role-user",
                        "permissionUrl": "/systemRoleUser",
                        "displayYn": false,
                        "parentId": 10002,
                        "childMenus": []
                    },
                    {
                        "id": 10027,
                        "name": "Task",
                        "description": "Task 메뉴",
                        "area": "1",
                        "position": 10,
                        "status": "1",
                        "projectYn": null,
                        "systemYn": null,
                        "mobileYn": null,
                        "hrIncludeYn": null,
                        "urlPath": "task",
                        "permissionUrl": "/task",
                        "displayYn": false,
                        "parentId": 10002,
                        "childMenus": []
                    },
                    {
                        "id": 10028,
                        "name": "Code",
                        "description": "Code 메뉴",
                        "area": "1",
                        "position": 11,
                        "status": "1",
                        "projectYn": null,
                        "systemYn": null,
                        "mobileYn": null,
                        "hrIncludeYn": null,
                        "urlPath": "code",
                        "permissionUrl": "/code",
                        "displayYn": false,
                        "parentId": 10002,
                        "childMenus": []
                    },
                    {
                        "id": 10029,
                        "name": "Task Attached File",
                        "description": "Task Attached File 메뉴",
                        "area": "1",
                        "position": 12,
                        "status": "1",
                        "projectYn": null,
                        "systemYn": null,
                        "mobileYn": null,
                        "hrIncludeYn": null,
                        "urlPath": "task-attached-file",
                        "permissionUrl": "/taskAttachedFile",
                        "displayYn": false,
                        "parentId": 10002,
                        "childMenus": []
                    }
                ]
            }

        ]
        ;
        function getMenu(){
            if(Principal.isIdentityResolved()) { // 로그인 정보 있으면 요청
                navbarService.getMenu({}).then(function (result) {
                    $log.debug("menuList : ", result)
                    //vm.menu = result;
                }).catch(function (err) {
                    $log.debug("menuErr : ", err)
                });
            }
        }

        //$scope.watch("$rootScope.menuList", function(){
        //
        //});

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
