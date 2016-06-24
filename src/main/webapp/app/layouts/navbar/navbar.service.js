(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('navbarService', navbarService);


    navbarService.$inject = ['$http', '$log', '$q'];

    function navbarService ($http, $log, $q) {
        var service = {
            getMenu: getMenu
        };

        return service;



        function getMenu() {
            var deferred = $q.defer();
            $http.get("/api/menus/top-menus").success(function (response) {
                $log.debug("menuList : ", response);
                deferred.resolve(response);
            });
            return deferred.promise;
        }
    }
})();
