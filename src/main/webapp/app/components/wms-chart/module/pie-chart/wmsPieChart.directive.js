/**
 * Created by 와이즈스톤 on 2016-07-08.
 */
(function(window, undefined) {'use strict';
    'use strict';

    angular.module('wms.pie.chart',[])
        .directive('pieChart', pieChart);
    pieChart.$inject = []
    function pieChart() {

        return {
            restrict: 'E',
            scope: {
                data: '=',
                options: '='
            },
            templateUrl: 'app/components/wms-chart/module/pie-chart/wmsPieChartTemplate.html'
        }
    }
})(window);
