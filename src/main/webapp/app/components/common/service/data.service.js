/**
 * Created by Jeong on 2016-03-21.
 */
'use strict';

angular.module('wmsApp')
    .factory('dataService', dataService);
dataService.$inject=['$log', '$rootScope', 'findUser', '$q'];
        function dataService($log, $rootScope, findUser, $q) {
        return {
            summerNoteOptions : {	//	에디터창 옵션설정
                airMode : false,
                focus : false,
                toolbar : [],
                template: {
                    path: 'app/components/wms-angular-summernote/plugin/template', // path to your template folder
                    list: [ // list of your template (without the .html extension)
                        'template1'
                    ]
                },
                hint: {
                    match: /([a-zA-Z가-힣0-9].*[@])|([@].*[a-zA-Z가-힣0-9])/,
                    search: function (keyword, callback) {

                        var mentions = [];
                        findUser.findByName(keyword).then(function(result){
                            angular.forEach(result, function(val){
                                mentions.push(val);
                            });
                            callback($.grep(mentions, function (item) {
                                return item.name.indexOf(keyword) == 0;
                            }));
                        }); //user search

                    },
                    content: function (item, id) { // summernote mention text template
                        return '<span class="mentionUser" id="'+id+'">@' + item + '</span>&nbsp;';
                    },
                    template: function(item) { // summernote mention select list template
                        return '[<strong>' + item.name + '</strong>] ' + item.id;
                    }
                }
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
                                ['edit',['undo','redo']],
                                ['headline', ['style']],
                                ['style', ['bold', 'italic', 'underline', 'clear']],
                                ['fontface', ['fontname']],
                                ['textsize', ['fontsize']],
                                ['fontclr', ['color']],
                                ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                                ['height', ['height']],
                                ['table', ['table']],
                                ['insert', ['link','picture','video','hr']],
                                ['view', ['fullscreen', 'codeview']],
                                ['help', ['help']],
                                ['insert', ['template']]
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
