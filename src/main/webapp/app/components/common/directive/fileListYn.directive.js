angular.module('wmsApp')
    .directive('fileListYn', fileListYn)
fileListYn.$inject=['$timeout', '$rootScope'];
/**
 * 좌측메뉴 프로젝트 등록 모달 토글
 * @param $timeout
 * @param $rootScope
 * @returns {{restrict: string, link: link}}
 */
function fileListYn($timeout, $rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            //$('body').click(function (e) {
            //    if ($('.projectAddSection').addClass("on"), $('.projectAddValueSection').addClass("on")) {
            //        if (!$('#projectAddSection').has(e.target).length) {
            //            $('.projectAddSection').removeClass("on");
            //            $('.projectAddValueSection').removeClass("on");
            //        }
            //    }
            //});
            //$rootScope.$on('projectAddClose', function(){
            //    $('.projectAddSection').removeClass("on");
            //    $('.projectAddValueSection').removeClass("on");
            //});
            element.on('click', function(_this) {
                    $(".file-input").toggleClass('on')
            });
        }
    }
}
