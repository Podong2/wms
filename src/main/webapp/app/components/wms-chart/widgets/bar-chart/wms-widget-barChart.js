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



angular.module('wms.widget.barChart', ['adf.provider', 'nvd3', 'wms.bar.chart'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('barChart', {
        title: '',
        subject: 'barChart',
        description: 'widget.barChartDescription',
        templateUrl: 'app/components/wms-chart/widgets/bar-chart/widgetBarChartTemplate.html',
        edit: {
          templateUrl: '{widgetsPath}/chart/src/edit.html',
          controller: 'barChartEditCtrl'
        }
      });
  }]).controller('barChartEditCtrl', ["$scope", function($scope){

    $scope.config.barOptions = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 450,
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
            showControls: true, // 그래프의 표현 타입 (grouped, stacked)
            showValues: true,
            duration: 500,
            xAxis: {
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Values',
                tickFormat: function(d){
                    return d3.format(',.2f')(d);
                }
            }
        },
        title: {
        enable: true,
        text: '바차트'
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

    $scope.config.barData = [
        {
            "key": "Series1",
            "color": "#d62728",
            "values": [
                {
                    "label" : "Group A" ,
                    "value" : -1.8746444827653
                } ,
                {
                    "label" : "Group B" ,
                    "value" : -8.0961543492239
                } ,
                {
                    "label" : "Group C" ,
                    "value" : -0.57072943117674
                } ,
                {
                    "label" : "Group D" ,
                    "value" : -2.4174010336624
                } ,
                {
                    "label" : "Group E" ,
                    "value" : -0.72009071426284
                } ,
                {
                    "label" : "Group F" ,
                    "value" : -0.77154485523777
                } ,
                {
                    "label" : "Group G" ,
                    "value" : -0.90152097798131
                } ,
                {
                    "label" : "Group H" ,
                    "value" : -0.91445417330854
                } ,
                {
                    "label" : "Group I" ,
                    "value" : -0.055746319141851
                }
            ]
        },
        {
            "key": "Series2",
            "color": "#1f77b4",
            "values": [
                {
                    "label" : "Group A" ,
                    "value" : 25.307646510375
                } ,
                {
                    "label" : "Group B" ,
                    "value" : 16.756779544553
                } ,
                {
                    "label" : "Group C" ,
                    "value" : 18.451534877007
                } ,
                {
                    "label" : "Group D" ,
                    "value" : 8.6142352811805
                } ,
                {
                    "label" : "Group E" ,
                    "value" : 7.8082472075876
                } ,
                {
                    "label" : "Group F" ,
                    "value" : 5.259101026956
                } ,
                {
                    "label" : "Group G" ,
                    "value" : 0.30947953487127
                } ,
                {
                    "label" : "Group H" ,
                    "value" : 0
                } ,
                {
                    "label" : "Group I" ,
                    "value" : 0
                }
            ]
        }
    ];
  }]);

    angular.module("wms.widget.barChart").
    run(["$templateCache", function($templateCache) {
      $templateCache.put("{widgetsPath}/chart/src/edit.html","<form class=form-inline role=form><div>"+
          "<button type=button class=\"btn btn-primary\" ng-click=addLink()><i class=\"fa fa-plus\"></i> Add</button></form>");
    /*$templateCache.put("{widgetsPath}/chart/src/wedgetBarChartTemplate.html","<nvd3 options='barOptions' data='barData'></nvd3>");*/
    }]);
})(window);
