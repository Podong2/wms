(function(window, undefined) {'use strict';
/* *
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */



angular.module('wms.widget.pieChart', ['adf.provider', 'nvd3', 'wms.pie.chart'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('pieChart', {
        title: '',
          subject: 'pieChart',
        description: 'widget.pieChartDescription',
        templateUrl: 'app/components/wms-chart/widgets/pie-chart/widgetPieChartTemplate.html',
        edit: {
          templateUrl: '{widgetsPath}/chart/src/edit.html',
          controller: 'pieChartEditCtrl'
        }
      });
  }]).controller('pieChartEditCtrl', ["$scope", function($scope){

    $scope.config.pieOptions = {
        chart: {
            type: 'pieChart',
            height: 500,
            x: function(d){return d.key;},
            y: function(d){return d.y;},
            showLabels: true, //그래프 내에 표시될 텍스트 노출 유무
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true, // 그래프 내 텍스트 회전 옵션
            legend: {
                margin: {
                    top: 5,
                    right: 35,
                    bottom: 5,
                    left: 0
                }
            }
        },
        title: {
            enable: true,
            text: '파이차트'
        },
        subtitle: {
            enable: true,
            text: '타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳',
            css: {
                'text-align': 'center',
                'margin': '10px 13px 0px 7px'
            }
        }
    };

    $scope.config.pieData = [
        {
            key: "One",
            y: 5
        },
        {
            key: "Two",
            y: 2
        },
        {
            key: "Three",
            y: 9
        },
        {
            key: "Four",
            y: 7
        },
        {
            key: "Five",
            y: 4
        },
        {
            key: "Six",
            y: 3
        },
        {
            key: "Seven",
            y: .5
        }
    ];
  }]);

    angular.module("wms.widget.pieChart").
    run(["$templateCache", function($templateCache) {
      $templateCache.put("{widgetsPath}/chart/src/edit.html","<form class=form-inline role=form><div>"+
          "<button type=button class=\"btn btn-primary\" ng-click=addLink()><i class=\"fa fa-plus\"></i> Add</button></form>");
    /*$templateCache.put("{widgetsPath}/chart/src/wedgetBarChartTemplate.html","<nvd3 options='barOptions' data='barData'></nvd3>");*/
    }]);
})(window);
