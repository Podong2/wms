angular.module('wmsApp')
    .directive('toggleEvent', toggleEvent);
toggleEvent.$inject=['$compile', '$filter', '$log', '$sce'];
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
