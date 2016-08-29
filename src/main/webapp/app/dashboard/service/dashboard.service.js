(function() {
    'use strict';
    angular
        .module('wmsApp')
        .factory('Dashboard', Dashboard)
        .factory('DashboardMyTask', DashboardMyTask)
        .factory('MyDashboard', MyDashboard);

    Dashboard.$inject = ['$resource'];
    DashboardMyTask.$inject = ['$resource'];
    MyDashboard.$inject = ['$resource'];
    //MyDashboard.$inject = ['$q', '$http', '$log'];

    function Dashboard ($resource) {
        var resourceUrl =  'api/dashboards/findUserDashboard';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }

    function MyDashboard ($resource) {
        var resourceUrl =  'api/dashboards';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }

    function DashboardMyTask ($resource) {
        var resourceUrl =  'api/dashboards/widget/findMyTasks';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }

    //function MyDashboard($q, $http, $log){
    //    var service = {
    //        put : put
    //    }
    //    return service;
    //
    //    function put(info){
    //        var deferred = $q.defer();
    //        $http.put( 'api/dashboards', {}, info).then(function (result) {
    //            $log.debug("대시보드 수정 : ", result);
    //            deferred.resolve(result);
    //        });
    //        return deferred.promise;
    //    }
    //}
    //


})();
