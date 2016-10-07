angular.module('wmsApp')
    .directive('wmsScrollFocus', wmsScrollFocus);
wmsScrollFocus.$inject=['$rootScope', '$timeout'];
/**
 * 공통 팝업 토글
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function wmsScrollFocus($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $element = element;
            element.on('click', function(e) {
                $timeout(function(){
                    $('.modal-body').css('scrollTop', $(".file-area-ul").offset().top);
                    $('.modal-body').animate({ scrollTop: $(".file-area-ul").offset().top }, 100);
                    //window.scrollTo(0, $(".file-area-ul").offset().top);
                }, 100)

            });
        }
    }
}
