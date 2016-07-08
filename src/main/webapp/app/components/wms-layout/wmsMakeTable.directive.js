(function() {
    'use strict';

    angular.module('wmsApp')
        .directive('wmsMakeTable', wmsMakeTable);

    wmsMakeTable.$inject = ['$log', 'summaryService'];

    function wmsMakeTable($log, summaryService) {

        return {
            restrict: 'E',
            scope: {
                responseData: '=',
                columnDatas : '=',
                type : '@'
            },
            templateUrl: 'app/components/wms-layout/detailBody.html',
            controller: ['$scope', function ($scope) {

                $scope.tempConfigs= [];
                $scope.summaryConfigs = [];

            }],
            link: function (scope, element, attrs) {

                var tempConfigs = [];
                var summaryConfigs = [];

                if(scope.type == 'single'){

                    for(var i in scope.columnDatas){
                        tempConfigs.push(summaryService.getConfig()
                            .setName(scope.columnDatas[i].language)
                            .setKey(scope.columnDatas[i].key));

                        summaryConfigs.push(tempConfigs);
                        tempConfigs = [];
                    }

                    scope.summaryConfigs = summaryConfigs;
                }else{

                    for(var i=0; i < scope.columnDatas.length; i ++){
                        tempConfigs.push(summaryService.getConfig()
                            .setName(scope.columnDatas[i].language)
                            .setKey(scope.columnDatas[i].key));
                        i ++;
                        tempConfigs.push(summaryService.getConfig()
                            .setName(scope.columnDatas[i].language)
                            .setKey(scope.columnDatas[i].key));

                        summaryConfigs.push(tempConfigs);
                        tempConfigs = [];
                    }
                    scope.summaryConfigs = summaryConfigs;
                }
            }
        }
    }
})();
