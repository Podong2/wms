/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .factory('tableService', tableService);
tableService.$inject=['$log', '$sce'];

function tableService($log, $sce) {
    return {
        checkedClear : function () {
            $(".table").find("input[type=checkbox]").each(function () {
                $(this).attr("checked", false);
            });
        },
        toggleChecked : function (state, datas) {
            angular.forEach(datas, function (data, key) {
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
        getConfig : function(hName, dAttr) {
            hName = (typeof hName !== undefined) ? hName : "";
            if (typeof dAttr !== undefined) {
                //$log.debug("테이블 헤더 속성 : ", dAttr);
            }

            var tableConfig = {
                hName      : "",            /* 헤더명                     */
                hWidth     : "",            /* 컬럼 사이즈                */
                hAlign     : "text-center", /* 헤더 정렬     */
                dType      : "none",        /* 태그 타입                  */
                dAlign     : "text-left",   /* 정렬          */
                dHtmlConverter : false,	               /* HMTL태그 컨버터 */
                visible    : "",                       /* 칼럼 표시 css   */

                hChecked   : false,         /* 전체 선택여부              */
                hDrag      : true,			/* 헤더 드래그 가능 여부      */
                hMedia     : "all",         /* 부트스트랩 미디어 타입     */
                hSort      : true,          /* 로우 정렬                  */
                dAttr      : "",            /* 속성명                     */
                dLink      : "none",        /* 링크                       */
                dLinkLabel : "",            /* 링크에 표시할 라벨         */
                dLinkParam : [],            /* 링크에 사용되는 파라메터   */
                dLinkType  : "none",        /* 링크 타입 (화면전환, 팝업) */
                dLinkStyle : "button-u",    /* 링크 표현 방법             */
                dRenderer  : "none",        /* 렌더링 방법 (필터)         */
                dRendererCallback  : null,        /* 렌더링 방법 (필터)         */
                dRotation  : "",            /* 로테이션                   */
                dRendererCss : "",          /* 랜더러로 그린 요소에 대한 css정의 */
                dClass     : "",            /* css속성                    */
                isData     : true,          /* 데이터 컬럼 여부           */
                dController : "",
                dFnBroadCast : "",

                dDateFormat : null,
                setHName : function (hName) {
                    this.hName = hName;
                    return this;
                },
                setHWidth : function (hWidth) {
                    this.hWidth = hWidth;
                    return this;
                },
                setHChecked : function (hChecked) {
                    this.hChecked = hChecked;
                    return this;
                },
                setHDrag : function (hDrag) {
                    this.hDrag = hDrag;
                    return this;
                },
                setHAlign : function (hAlign) {
                    this.hAlign = hAlign;
                    return this;
                },
                setHMedia : function (hMedia) {
                    this.hMedia = hMedia;
                    return this;
                },
                setHSort : function (hSort) {
                    this.hSort = hSort;
                    return this;
                },
                setDAttr  : function (dAttr) {
                    this.dAttr = dAttr;
                    return this;
                },
                setDAlign : function (dAlign) {
                    this.dAlign = dAlign;
                    return this;
                },
                setDType  : function (dType) {
                    this.dType = dType;
                    return this;
                },
                setDLink  : function (dLink) {
                    this.dLink = dLink;
                    return this;
                },
                setDLinkLabel  : function (dLinkLabel) {
                    this.dLinkLabel = dLinkLabel;
                    return this;
                },
                setDLinkParam : function (dLinkParam) {
                    this.dLinkParam = dLinkParam;
                    return this;
                },
                setDLinkType : function (dLinkType) {
                    this.dLinkType = dLinkType;
                    return this;
                },
                setDLinkStyle : function (dLinkStyle) {
                    this.dLinkStyle = dLinkStyle;
                    return this;
                },
                setDRenderer : function (dRenderer) {
                    this.dRenderer = dRenderer;
                    return this;
                },
                setDRendererCallBack : function (dRendererCallback) {
                    this.dRendererCallback = dRendererCallback;
                    return this;
                },
                setDClass : function (dClass) {
                    this.dClass = dClass;
                    return this;
                },
                setDRendererCss : function (dRendererCss) {
                    this.dRendererCss = dRendererCss;
                    return this;
                },
                setIsData : function (isData) {
                    this.isData = isData;
                    return this;
                },
                setDController : function (dController) {
                    this.dController = dController;
                    return this;
                },
                setDFnBroadCast : function (dFnBroadCast) {
                    this.dFnBroadCast = dFnBroadCast;
                    return this;
                },
                setDHtmlConverter : function (dHtmlConverter) {
                    this.dHtmlConverter = dHtmlConverter;
                    return this;
                },
                setDDateFormat : function (dDateFormat) {
                    this.dDateFormat = dDateFormat;
                    return this;
                },
                setVisible : function (visible) {
                    this.visible = visible;
                    return this;
                }
            };

            tableConfig.hName = hName;
            tableConfig.dAttr = dAttr;

            return tableConfig;
        },
        convertHtml : function (data) {
            return $sce.trustAsHtml(data);
        },
        getDateFormat : function (formatType, date) {
            if (formatType == "" || formatType == null) {
                formatType = "01";
            }
            Date.prototype.format = function(f) {
                if (!this.valueOf()) return " ";
                var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
                var d = this;

                return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
                    switch ($1) {
                        case "yyyy": return d.getFullYear();
                        case "yy": return (d.getFullYear() % 1000).zf(2);
                        case "MM": return (d.getMonth() + 1).zf(2);
                        case "dd": return d.getDate().zf(2);
                        case "E": return weekName[d.getDay()];
                        case "HH": return d.getHours().zf(2);
                        case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
                        case "mm": return d.getMinutes().zf(2);
                        case "ss": return d.getSeconds().zf(2);
                        case "a/p": return d.getHours() < 12 ? "오전" : "오후";
                        default: return $1;
                    }
                });
            };

            String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
            String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
            Number.prototype.zf = function(len){return this.toString().zf(len);};

            var dateFormat = "";
            var dynamicTime = false;
            var today = new Date().format("yyyy-MM-dd");
            var compareDate = new Date(date).format("yyyy-MM-dd");

            if (today == compareDate) {
                dynamicTime = true;
            }

            switch(formatType) {
                case "01":  //  날짜
                    dateFormat = "yyyy-MM-dd";
                    break;
                case "02":  //  날짜 + 시간
                    dateFormat = "yyyy-MM-dd HH:mm";
                    break;
                case"03":  //  유동적 표시
                    if (dynamicTime) {
                        dateFormat = "HH:mm";
                    }
                    else {
                        dateFormat = "yyyy-MM-dd HH:mm";
                    }

                    break;
            }

            return dateFormat;
        }
    };
}
