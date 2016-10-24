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
            var editorElementBody = element.parents('.task-detail-area').next().find('.summernote');
            var summernoteElement = element.parents('.task-detail-area').next().find('.note-editable.panel-body');
            var editable = element.parents('.task-detail-area').next().find('[contenteditable]')
            element.on("click", function (event) {
                //editorElementBody.summernote('focus');
                var summer = summernoteElement;
                var duplicationYn = false;
                for(var i = 0; i < summer.find(".mentionUser").length; i++){
                    var mention = summer.find(".mentionUser")[i];
                    var id = mention.getAttribute('id');
                    if(id == scope.userId) duplicationYn = true;
                }

                    var el = editable[1];
                    var range = document.createRange();
                    var sel = window.getSelection();
                    var childLength = el.childNodes.length;
                    if (childLength > 0) {
                        var lastNode = el.childNodes[childLength - 1];
                        var lastNodeChildren = lastNode.childNodes.length;
                        range.setStart(lastNode, lastNodeChildren);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }

                    editorElementBody.summernote('pasteHTML', '<span class="mentionUser" id="'+ scope.userId +'">@'+ scope.userName +'</span>&nbsp;');



            });

        }
    }
}
