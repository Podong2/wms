/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .factory('dataService', dataService);
dataService.$inject=['$log', '$rootScope'];
        function dataService($log, $rootScope) {
        return {
            summerNoteOptions : {	//	에디터창 옵션설정
                airMode : false,
                focus : false,
                toolbar : [],
            },
            getSummerNoteOptions : function (options, toolbarType) {
                //	옵션 사용시
                if (options == true) {
                    switch (toolbarType) {
                        case 'noPicture' :
                            this.summerNoteOptions.toolbar = [
                                ['style', ['style']],
                                ['font', ['bold', 'italic', 'underline', 'clear']],
                                ['fontname', ['fontname']],
                                ['fontsize', ['fontsize']],
                                ['color', ['color']],
                                ['para', ['ul', 'ol', 'paragraph']],
                                ['height', ['height']],
                                ['table', ['table']],
                                ['insert', ['link', 'hr']],
                                ['view', ['fullscreen', 'codeview']],
                            ];
                            break;
                        default :
                            this.summerNoteOptions.toolbar = [
                                ['style', ['style']],
                                ['font', ['bold', 'italic', 'underline', 'clear']],
                                ['fontname', ['fontname']],
                                ['fontsize', ['fontsize']],
                                ['color', ['color']],
                                ['para', ['ul', 'ol', 'paragraph']],
                                ['height', ['height']],
                                ['table', ['table']],
                                ['insert', ['link', 'hr', 'picture']],
                                ['view', ['fullscreen', 'codeview']],
                            ];
                            break;
                    }
                } else {
                    this.summerNoteOptions.toolbar = [];
                }

                return this.summerNoteOptions;
            }
        }
    }
