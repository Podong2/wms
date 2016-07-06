/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .factory('makeTableService', makeTableService);
makeTableService.$inject=['$log', '$sce', 'summaryService'];

function makeTableService($log, $sce, summaryService) {
    return {
        detailSingleTable : function (datas){

            var tempConfigs = [];
            var summaryConfigs = [];

            for(var i in datas){
                tempConfigs.push(summaryService.getConfig()
                    .setName(datas[i].language)
                    .setKey(datas[i].key));

                summaryConfigs.push(tempConfigs);
                tempConfigs = [];
            }

            return summaryConfigs;
        },
        detailMultiTable : function (datas){

            var tempConfigs = [];
            var summaryConfigs = [];

            for(var i=0; i < datas.length; i ++){
                tempConfigs.push(summaryService.getConfig()
                    .setName(datas[i].language)
                    .setKey(datas[i].key));
                i ++;
                tempConfigs.push(summaryService.getConfig()
                    .setName(datas[i].language)
                    .setKey(datas[i].key));

                summaryConfigs.push(tempConfigs);
                tempConfigs = [];
            }

            return summaryConfigs;
        }
    };
}
