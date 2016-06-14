(function() {
    'use strict';

    angular
        .module('wmsApp')
        .directive('showValidation', showValidation);
    // 디렉티브 명 선언, 실제 태그에서는 "show-validation" 이라는 이름으로 선언된다.

    function showValidation () {
        var directive = {
            restrict: 'A', // 디렉티브를 어떤 속성으로 사용할지 결정한다. A는 attribute 속성
            require: 'form',//
            link: linkFunc // scope에 대한 $watch를 설정하고 디렉티브에 listener를 등록하여 양방향 바인딩을 구현하여 윈하는 결과값을 얻을 수 있다.
        };

        return directive; // 최종결과를 return 한다.

        function linkFunc (scope, element) {
            element.find('.form-group').each(function() {
                var $formGroup = angular.element(this); // 입력 form 그룹을 찾아 $formGroup에 담는다.
                var $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');
                // formGroup에서 input type, textarea type, select type element들을 찾아 $inputs에 담는다.

                if ($inputs.length > 0) { // element 유무 체크
                    $inputs.each(function() {
                        var $input = angular.element(this); // 각각의 element들을 따로 처리한다.
                        scope.$watch(function() { // $watch를 이용하여 해당 element의 변화를감지하여 동작한다.
                            return $input.hasClass('ng-invalid') && $input.hasClass('ng-dirty');
                            // 해당 클레스를 가지고 있는지 체크하여 가지고있는 element들만 return
                        }, function(isInvalid) { // 에러 노출
                            $formGroup.toggleClass('has-error', isInvalid);
                        });
                    });
                }
            });
        }
    }
})();
