angular.module('wmsApp')
    .directive('editorMentionWrite', editorMentionWrite)
    .directive('taskEditorMentionWrite', taskEditorMentionWrite)
editorMentionWrite.$inject=['$compile', '$filter', '$log', '$sce', '$timeout'];
taskEditorMentionWrite.$inject=['$compile', '$filter', '$log', '$sce', '$timeout'];
function editorMentionWrite($compile, $filter, $log, $sce, $timeout) {

    return {
        restrict : "A",
        scope : {
            userName : '=userName',
            userId : '=userId'
        },
        link : function (scope, element, attrs) {
            var editorElementBody = element.parents('.smart-timeline').next().find('.note-editable.panel-body');
            //var summernoteElement = element.parents('.smart-timeline').next().find('#summernote');
            element.on("click", function (event) {
                if(editorElementBody.find('>p').html() == '<br>') {
                    editorElementBody.find('>p').prepend('<span class="mentionUser" id="'+ scope.userId +'">@'+ scope.userName +'</span>&nbsp;');
                    editorElementBody.focus()
                }
                else {
                    editorElementBody.append('<span class="mentionUser" id="'+ scope.userId +'">@'+ scope.userName +'</span>&nbsp;');
                    editorElementBody.focus()
                }
                var e = $.Event("keydown");
                e.which = 75;
                e.keyCode = 75;
                editorElementBody.trigger(e);
            });
        }
    }
}
function taskEditorMentionWrite($compile, $filter, $log, $sce, $timeout) {

    return {
        restrict : "A",
        scope : {
            userName : '=userName',
            userId : '=userId'
        },
        link : function (scope, element, attrs) {
            var editorElementBody = element.parents('.task-detail-area').next().find('.note-editable.panel-body');
            //var summernoteElement = element.parents('.smart-timeline').next().find('#summernote');
            element.on("click", function (event) {
                if(editorElementBody.find('>p').html() == '<br>') {
                    editorElementBody.find('>p').prepend('<span class="mentionUser" id="'+ scope.userId +'">@'+ scope.userName +'</span>&nbsp;');
                    editorElementBody.focus()
                }
                else {
                    editorElementBody.append('<span class="mentionUser" id="'+ scope.userId +'">@'+ scope.userName +'</span>&nbsp;');
                    editorElementBody.focus()
                }
                var e = $.Event("keydown");
                e.which = 75;
                e.keyCode = 75;
                editorElementBody.trigger(e);
            });
        }
    }
}
