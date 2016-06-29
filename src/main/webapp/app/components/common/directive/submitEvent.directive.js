angular.module('wmsApp')
    .directive('enterSubmit', enterSubmit);
enterSubmit.$inject=['$compile', '$filter', '$log', '$sce'];
function enterSubmit($compile, $filter, $log, $sce) {

    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.enterSubmit);
                });

                event.preventDefault();
            }
        });
    };
}
