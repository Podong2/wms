/**
 * Created by 와이즈스톤 on 2016-07-08.
 */
(function(window, undefined) {'use strict';
    'use strict';

    angular.module('wms.bar.chart',[])
        .directive('barChart', barChart);
    barChart.$inject = []
    function barChart() {

        return {
            restrict: 'E',
            scope: {
                data: '=',
                options: '='
            },
            templateUrl: 'app/components/wms-chart/module/bar-chart/wmsBarChartTemplate.html'
        }
    }
})(window);
