angular.module('wmsApp')
    .directive('toggleEvent', toggleEvent)
    .directive('sectionToggle', sectionToggle);
toggleEvent.$inject=['$compile', '$filter', '$log', '$sce'];
sectionToggle.$inject=['$timeout', '$rootScope'];
function toggleEvent($compile, $filter, $log, $sce) {

    return {
        restrict : "A",
        link : function (scope, element, attrs) {
            var toggleStatus = true;
            element.on("click", function (event) {
                if(toggleStatus){
                    event.target.parentElement.classList.add("on");
                    toggleStatus = false;
                }else {
                    event.target.parentElement.classList.remove("on");
                    toggleStatus = true;
                }

            });
        }
    }
}
function sectionToggle($timeout, $rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            $('body').click(function (e) {
                if ($('.editingSection').addClass("on"), $('.elementSection').addClass("on")) {
                    if (!$('#editingSection').has(e.target).length) {
                        $('.editingSection').removeClass("on");
                        $('.elementSection').removeClass("on");
                        $rootScope.$broadcast("editingUpload")
                    }
                }
            });
            element.on('click', function(_this) {
                $timeout(function () {
                    $(".focusing").focus();
                }, 400);
            });
        }
    }
}

