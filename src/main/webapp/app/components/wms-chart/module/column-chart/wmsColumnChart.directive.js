/**
 * Created by 와이즈스톤 on 2016-07-08.
 */
(function(window, undefined) {'use strict';
    'use strict';

    angular.module('wms.column.chart',[])
        .directive('columnChart', columnChart);
    columnChart.$inject = []
    function columnChart() {

        return {
            restrict: 'E',
            scope: {
                data: '=',
                options: '='
            },
            templateUrl: 'app/components/wms-chart/module/column-chart/wmsColumnChartTemplate.html'
        }
    }
})(window);
