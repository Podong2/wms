/**
 * 페이지 스크롤 로딩 디렉티브
 */
angular.module('wmsApp')
    .directive('whenScrolled', whenScrolled);
whenScrolled.$inject=[];
    function whenScrolled() {
        return {
            restrict: 'A',
            scope : {
                loading : '=',
                whenScrolled : '&'
            },
            template: '',
            link: function (scope, tElement, tAttrs) {
                var raw = tElement[0];
                tElement.bind('scroll', function () {
                    if(!scope.loading){
                        if (raw.scrollTop != 0 && raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                            scope.loading = true;
                            scope.$apply(scope.whenScrolled);
                            scope.$apply(scope.loading);
                        }
                    }
                });
            }
        };
    }
