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



angular.module('wms.widget.columnChart', ['adf.provider', 'nvd3', 'wms.column.chart'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('columnChart', {
        title: 'columnChart',
        description: 'Displays a columnChart',
        templateUrl: 'app/components/wms-chart/widgets/column-chart/widgetColumnChartTemplate.html',
        edit: {
          templateUrl: '{widgetsPath}/chart/src/edit.html',
          controller: 'columnChartEditCtrl'
        }
      });
  }]).controller('columnChartEditCtrl', ["$scope", function($scope){

    $scope.config.columnOptions = {
        chart: {
            type: 'discreteBarChart', // 차트 타입
            height: 450, // 차트의 높이 지정
            margin : { // 차트 노출영역의 margin값 지정
                top: 20,
                right: 40,
                bottom: 50,
                left: 55
            },
            x: function(d){return d.label;}, // x축 data key 지정
            y: function(d){return d.value;}, // y축 data key 지정
            showValues: true, // 그래프 바에 value 표시 유무
            showLegend : false, // 범례 표시 유무
            valueFormat: function(d){
                return d3.format(',.4f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: '날짜', // x축 title
                staggerLabels: true, // x축 데이터 표시 방법(데이터간의 높이 위치 변경)
                rotateLabels : 30 // x축 텍스트 회전
            },
            yAxis: {
                axisLabel: '수치', // y축 타이틀
                axisLabelDistance: -10
            }
        },
        title: { // 타이틀 영역
            enable: true,
            text: '컬럼차트'
        },
        subtitle: { // 서브타이틀 역역
            enable: true,
            text: '타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳',
            css: {
                'text-align': 'center',
                'margin': '10px 13px 0px 7px'
            }
        }
    };

    $scope.config.columnData = [
        {
            key: "Cumulative Return", //
            values: [
                { "label" : "2015/11/12" , "value" : -29.765957771107 },
                { "label" : "2015/11/13" , "value" : 0 },
                { "label" : "2015/11/14" , "value" : 32.807804682612 },
                { "label" : "2015/11/15" , "value" : 196.45946739256 },
                { "label" : "2015/11/16" , "value" : 0.19434030906893 },
                { "label" : "2015/11/17" , "value" : -98.079782601442 },
                { "label" : "2015/11/18" , "value" : -13.925743130903 },
                { "label" : "2015/11/19" , "value" : -5.1387322875705 },
                { "label" : "2015/11/20" , "value" : -11.1387322875705 },
                { "label" : "2015/11/21" , "value" :11.1387322875705 },
                { "label" : "2015/11/22" , "value" : 14.1387322875705 },
                { "label" : "2015/11/23" , "value" : -15.1387322875705 },
                { "label" : "2015/11/24" , "value" : -5.1387322875705 }
            ]
        }
    ];
  }]);

    angular.module("wms.widget.columnChart").
    run(["$templateCache", function($templateCache) {
      $templateCache.put("{widgetsPath}/chart/src/edit.html","<form class=form-inline role=form><div>"+
          "<button type=button class=\"btn btn-primary\" ng-click=addLink()><i class=\"fa fa-plus\"></i> Add</button></form>");
    /*$templateCache.put("{widgetsPath}/chart/src/wedgetBarChartTemplate.html","<nvd3 options='barOptions' data='barData'></nvd3>");*/
    }]);
})(window);
