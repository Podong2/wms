angular.module('wmsApp')
    .directive('wmsScrollFocus', wmsScrollFocus)
    .directive('wmsModalScrollFocus', wmsModalScrollFocus);
wmsScrollFocus.$inject=['$rootScope', '$timeout'];
wmsModalScrollFocus.$inject=['$rootScope', '$timeout'];

function wmsModalScrollFocus($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $element = element;
            element.on('click', function(e) {
                $timeout(function(){
                    $('.modal-body').css('scrollTop', $(".file-area-ul").offset().top - 100);
                    $('.modal-body').animate({ scrollTop: $(".file-area-ul").offset().top - 100 }, 100);
                    //window.scrollTo(0, $(".file-area-ul").offset().top);
                }, 100)

            });
        }
    }
}

function wmsScrollFocus($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $element = element;
            element.on('click', function(e) {
                $timeout(function(){
                    $('.task-detail-area').css('scrollTop', $(".file-area-ul").offset().top - 100);
                    $('.task-detail-area').animate({ scrollTop: $(".file-area-ul").offset().top - 100 }, 100);
                    //window.scrollTo(0, $(".file-area-ul").offset().top);
                }, 100)

            });
        }
    }
}
