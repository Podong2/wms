/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .factory('summaryService', summaryService);
summaryService.$inject=['$log'];
        function summaryService($log) {
        return {
            toggleChecked : function (state, datas) {
                angular.forEach(datas, function (data, key) {
                    $log.debug("해당 체크박스 readOnly 상태 : " , data.readOnly);
                    //	읽기 전용일 경우에는 체크박스를 변경하지 않는다.
                    if (data.readOnly != null) {

                        if (!data.readOnly) {
                            data.checked = state;
                        }
                    }
                    else {
                        data.checked = state;
                    }
                });
            },
            getConfig : function () {

                var summaryConfig = {
                    name : "",
                    value : "",
                    key : "",
                    subKey : "",
                    renderer : "",
                    htmlConverter : false,
                    setName : function (name) {
                        this.name = name;
                        return this;
                    },
                    setValue : function (value) {
                        this.value = value;
                        return this;
                    },
                    setKey : function (key) {
                        this.key = key;
                        return this;
                    },
                    setSubKey : function (subKey) {
                        this.subKey = subKey;
                        return this;
                    },
                    setRenderer : function (renderer) {
                        this.renderer = renderer;
                        return this;
                    },
                    setHtmlConverter : function (htmlConverter) {
                        this.htmlConverter = htmlConverter;
                        return this;
                    }
                };
                return summaryConfig;
            }
        };
    }
