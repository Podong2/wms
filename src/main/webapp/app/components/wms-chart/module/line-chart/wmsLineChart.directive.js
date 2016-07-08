/**
 * Created by 와이즈스톤 on 2016-07-08.
 */
(function(window, undefined) {'use strict';
    'use strict';

    angular.module('wms.line.chart',[])
        .directive('lineChart', lineChart);
    lineChart.$inject = []
    function lineChart() {

        return {
            restrict: 'E',
            scope: {
                data: '=',
                options: '='
            },
            templateUrl: 'app/components/wms-chart/module/line-chart/wmsLineChartTemplate.html'
        }
    }
})(window);
