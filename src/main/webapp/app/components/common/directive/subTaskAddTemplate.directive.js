angular.module('wmsApp')
    .directive('subTaskAddTemplate', subTaskAddTemplate);
subTaskAddTemplate.$inject=['$timeout', '$compile'];
function subTaskAddTemplate($timeout, $compile) {
    return {
        restrict: 'A',
        controller : ['subTask', function (SubTask){

            function subTaskSave(){
                if(vm.task.name != '') SubTask.save(vm.subTask, onSaveSuccess, onSaveError);
            }
        }],
        link: function(scope, element, attr) {
            //$('body').click(function (e) {
            //    if ($('.projectPickerSection').addClass("on"), $('.projectValueSection').addClass("on")) {
            //        if (!$('#projectPickerSection').has(e.target).length) {
            //            $('.projectPickerSection').removeClass("on");
            //            $('.projectValueSection').removeClass("on");
            //        }
            //    }
            //});
            element.on('click', function(e) {
                //$timeout(function () {
                //    $(".project-focusing").focus();
                //}, 400);
                if (!$('.sub-task-area ').hasClass('.add-sub-task').length) {
                    //$('.sub-task-area').append('<div class="add-sub-task"><input type="text" class="taskAddInput" ng-model="vm.subTask.name" ng-enter="vm.subTaskSave()" ng-blur="vm.subTaskSave()" placeholder="Task"/></div>');
                    var template = '<div class="add-sub-task"><input type="text" class="taskAddInput" ng-model="vm.subTask.name" ng-enter="subTaskSave()" ng-blur="vm.subTaskSave()" placeholder="Task"/></div>';
                    var linkFn = $compile(template);
                    var content = linkFn(scope);
                    $('.sub-task-area').append(content);
                }

            });
        }
    }
}

