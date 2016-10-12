angular.module('wmsApp')
    .directive('toggleEvent', toggleEvent)
    .directive('sectionToggle', sectionToggle)
    .directive('datePickerEditToggle', datePickerEditToggle)
    .directive('userPickerEditToggle', userPickerEditToggle)
    .directive('projectPickerEditToggle', projectPickerEditToggle)
    .directive('projectPickerAddToggle', projectPickerAddToggle)
    .directive('projectAddToggle', projectAddToggle)
    .directive('userPickerBtnToggle', userPickerBtnToggle)
    .directive('watcherPickerBtnToggle', watcherPickerBtnToggle)
    .directive('watcherInfoBtnToggle', watcherInfoBtnToggle)
    .directive('memberInfoBtnToggle', memberInfoBtnToggle)
    .directive('relatedTaskPickerBtnToggle', relatedTaskPickerBtnToggle)
    .directive('subTaskUserInfoBtnToggle', subTaskUserInfoBtnToggle)
    .directive('commonPopupToggle', commonPopupToggle)
    .directive('commonUserInfoBtnToggle', commonUserInfoBtnToggle)
    .directive('gnbTaskHistoryToggle', gnbTaskHistoryToggle);
toggleEvent.$inject=['$compile', '$filter', '$log', '$sce', '$timeout'];
sectionToggle.$inject=['$timeout', '$rootScope'];
datePickerEditToggle.$inject=['$timeout'];
userPickerEditToggle.$inject=['$timeout'];
projectPickerEditToggle.$inject=['$timeout', '$rootScope'];
projectPickerAddToggle.$inject=['$timeout', '$rootScope'];
projectAddToggle.$inject=['$timeout', '$rootScope'];
userPickerBtnToggle.$inject=['$timeout'];
watcherPickerBtnToggle.$inject=['$rootScope', '$timeout'];
watcherInfoBtnToggle.$inject=['$rootScope', '$timeout'];
memberInfoBtnToggle.$inject=['$rootScope', '$timeout'];
relatedTaskPickerBtnToggle.$inject=['$rootScope', '$timeout'];
subTaskUserInfoBtnToggle.$inject=['$rootScope', '$timeout'];
commonPopupToggle.$inject=['$rootScope', '$timeout'];
commonUserInfoBtnToggle.$inject=['$rootScope', '$timeout'];
gnbTaskHistoryToggle.$inject=['$timeout'];
function toggleEvent($compile, $filter, $log, $sce, $timeout) {

    return {
        restrict : "A",
        link : function (scope, element, attrs) {
            var toggleStatus = true;
            element.on("click", function (event) {
                var _this = this;
                if(toggleStatus){
                    event.target.parentElement.classList.add("on");
                    toggleStatus = false;
                }else {
                    event.target.parentElement.classList.remove("on");
                    toggleStatus = true;
                }
                $timeout(function () {
                    _this.nextElementSibling.nextElementSibling.focus()
                }, 400);

            });
        }
    }
}
function sectionToggle($timeout, $rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $element = element;
            element.on('click', function(_this) {
                $("body").bind("click", function(e){
                    if ($($element).addClass("on"), $($element.parents('#editingSection').find('.editingSection')).addClass("on")) {
                        if (!$($element.parents('#editingSection')).has(e.target).length) {
                            if($(".note-toolbar").has(e.target).length){

                            }else{
                                $('.editingSection').removeClass("on");
                                $('.elementSection').removeClass("on");
                                $rootScope.$broadcast("editingUpload")
                            }

                        }
                    }
                });
                $timeout(function () {
                    $(".focusing").focus();
                }, 400);
            });
        }
    }
}
function datePickerEditToggle($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            element.on('click', function(_this) {
                $('body').bind('click',function (e) {
                    if ($('.datePickerSection').addClass("on"), $('.dateValueSection').addClass("on")) {
                        if (!$('#datePickerSection').has(e.target).length) {
                            $('.datePickerSection').removeClass("on");
                            $('.dateValueSection').removeClass("on");
                        }
                    }
                });
                $timeout(function () {
                    $(".date-focusing").focus();
                }, 400);
            });
        }
    }
}
/**
 * 사용자 검색 팝업 토글
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function userPickerEditToggle($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var openYn = false;
            var elementTarget = '';
            $('body').click(function (e) {
                if(elementTarget != ''){
                    if (!$(elementTarget).has(e.target).length) {
                        $('.userPickerSection').removeClass("on");
                        $('.userValueSection').removeClass("on");
                        elementTarget = '';
                    }
                }
            });
            element.on('click', function(_this) {
                openYn = true;
                elementTarget = _this.target.parentElement.parentElement;
                $('.userPickerSection').removeClass("on");
                $(_this.target.nextElementSibling).addClass("on");
                $(_this.target.parentElement.nextElementSibling).addClass("on");
                $timeout(function () {
                    $(".user-focusing").focus();
                }, 400);
            });
        }
    }
}
/**
 * 작업 등록화면 프로젝트 모달 토글
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function projectPickerAddToggle($timeout, $rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var openYn = true;
            var $element = element.parents('label').next();
            $('body').click(function (e) {
                if ($($element).addClass("on"), $($element).find('.projectValueAddSection').addClass("on")) {
                    if (!$($element).parents('#projectPickerAddSection').has(e.target).length) {
                        $('.projectPickerAddSection').removeClass("on");
                        $('.projectValueAddSection').removeClass("on");
                    }
                }

            });
            $rootScope.$on('projectPickerAddClose', function(event, args){
                $timeout(function () {
                    $('.projectPickerAddSection').removeClass("on");
                    $('.projectValueAddSection').removeClass("on");
                }, 100);
            });
            element.on('click', function(_this) {
                $timeout(function () {
                    $(".project-focusing").focus();
                }, 400);
            });
        }
    }
}
/**
 * 작업 상세 화면 프로젝트 모달 토글
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function projectPickerEditToggle($timeout, $rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $element = element.parents('label').next();
            $('body').click(function (e) {
                if ($($element).addClass("on"), $($element).find('.projectValueSection').addClass("on")) {
                    if (!$($element).parents('#projectPickerSection').has(e.target).length) {
                        $('.projectPickerSection').removeClass("on");
                        $('.projectValueSection').removeClass("on");
                    }
                }
            });
            $rootScope.$on('projectEditClose', function(){
                $timeout(function () {
                    $('.projectPickerSection').removeClass("on");
                    $('.projectValueSection').removeClass("on");
                }, 100);
            });
            element.on('click', function(_this) {
                $timeout(function () {
                    $(".project-focusing").focus();
                }, 400);
            });
        }
    }
}
/**
 * 좌측메뉴 프로젝트 등록 모달 토글
 * @param $timeout
 * @param $rootScope
 * @returns {{restrict: string, link: link}}
 */
function projectAddToggle($timeout, $rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            $('body').click(function (e) {
                if ($('.projectAddSection').addClass("on"), $('.projectAddValueSection').addClass("on")) {
                    if (!$('#projectAddSection').has(e.target).length) {
                        $('.projectAddSection').removeClass("on");
                        $('.projectAddValueSection').removeClass("on");
                    }
                }
            });
            $rootScope.$on('projectAddClose', function(){
                $timeout(function () {
                    $('.projectAddSection').removeClass("on");
                    $('.projectAddValueSection').removeClass("on");
                }, 200);
            });
            element.on('click', function(_this) {
                $timeout(function () {
                    $(".project-focusing").focus();
                }, 400);
            });
        }
    }
}
/**
 * 헤더 작업 히스토리 모달 토글
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function gnbTaskHistoryToggle($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            $('body').click(function (e) {
                if ($('.taskHistorySection').addClass("on"), $('.taskHistoryBtnSection').addClass("on")) {
                    if (!$('#taskHistorySection').has(e.target).length) {
                        $('.taskHistorySection').removeClass("on");
                        $('.taskHistoryBtnSection').removeClass("on");
                    }
                }
            });
            element.on('click', function(_this) {
                $timeout(function () {
                    $(".project-focusing").focus();
                }, 400);
            });
        }
    }
}
/**
 * user picker +버튼 보임 안보임 처리
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function userPickerBtnToggle($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $elements = element;
            $('body').click(function (e) {
                if (!$($elements).has(e.target).length) {
                    $($elements).find('.user-picker-plus-btn').removeClass("on");
                    $($elements).find('.user-picker-input-area').removeClass("on");
                }
            });
            element.on('click', function(_this) {
                $($elements).find('.user-picker-plus-btn').addClass("on");
                $($elements).find('.user-picker-input-area').addClass("on");
            });
        }
    }
}
/**
 * 참조자 팝업 토글
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function watcherPickerBtnToggle($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $elements = element.next();
            var closeYn = false;
            element.on('click', function(_this) {
                $($elements).addClass("on");
                $timeout(function () {
                    $(".watcher-input").focus();
                }, 400);
            });
            $rootScope.$on('watcherPopupClose', function(){
                $($elements).removeClass("on");
            })
            $('body').click(function (e) {
                var closeYnElement = e.target.getAttribute("class");
                if (!$($elements.parent()).has(e.target).length || closeYn) {
                    if(closeYnElement != null && closeYnElement.indexOf("close") == -1){
                        $timeout(function () {
                            $($elements).removeClass("on");
                            closeYn = false;
                        }, 100);
                    }
                }
            });

        }
    }
}
/**
 * 참조자 정보 팝업 토글
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function watcherInfoBtnToggle($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $elements = element.parents('.watcher-list-area').children('.watcher-picker-info');
            var closeYn = false;
            element.on('click', function(_this) {
                //$($elements).addClass("on");
            });
            $rootScope.$on('profileClose', function(){
                $timeout(function(){
                    $($elements).removeClass("on");
                }, 100);
            })
            $('body').click(function (e) {
                if(closeYn){
                    $($elements).removeClass("on");
                    closeYn = false;
                }else{
                    if ($($elements).has(e.target).length) {
                        $elements.addClass("on");
                    }else{
                        var closeYnElement = e.target.getAttribute("class");
                        $timeout(function () {
                            if (!$('.watcher-item').has(e.target).length) {
                                $($elements).removeClass("on");
                                closeYn = false;
                            }else if(closeYnElement != null && closeYnElement.indexOf("close") > -1){
                                $($elements).removeClass("on");
                            }else{
                                $elements.addClass("on");
                            }
                        }, 100);

                    }
                }

            });

        }
    }
}

/**
 * 참조작업 팝업 토글
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function relatedTaskPickerBtnToggle($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $elements = element.next();
            element.on('click', function(_this) {
                $($elements).addClass("on");

                $timeout(function () {
                    $(".related-task-input").focus();
                }, 400);
            });
            $rootScope.$on('relatedTaskPopupClose', function(){
                $timeout(function () {
                    $($elements).removeClass("on");
                }, 100);
            })
            $('body').click(function (e) {
                if (!$($elements.parent()).has(e.target).length) {
                    if(e.target.getAttribute('class') == null){
                        $($elements).removeClass("on");
                    }else if(e.target.getAttribute('class') == 'remove-button' || e.target.getAttribute('class').indexOf('suggestion-item') > -1 || e.target.getAttribute('class').split(' ').indexOf('remove-button') > -1){
                        //$($elements).addClass("on");
                    }else{
                        $($elements).removeClass("on");
                    }

                }
            });

        }
    }
}

/**
 * 하위작업 담당자 정보 팝업 토글
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function subTaskUserInfoBtnToggle($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $elements = element;
            element.on('click', function(_this) {
                $($elements).parents('li').find('.watcher-picker-info').addClass("on");
            });
            $rootScope.$on('profileClose', function(){
                $timeout(function(){
                    $($elements).parents('li').find('.watcher-picker-info').removeClass("on");
                }, 10);
            });
            $('body').click(function (e) {
                if ($($elements).parents('li').find('.watcher-picker-info').has(e.target).length) {
                    $elements.parents('li').find('.watcher-picker-info').addClass("on");
                }else{
                    var closeYnElement = e.target.getAttribute("class");
                    $timeout(function () {
                        if (!$elements.parents('li').has(e.target).length) {
                            $($elements).parents('li').find('.watcher-picker-info').removeClass("on");
                        }else if(closeYnElement != null && closeYnElement.indexOf("close") > -1){
                            $($elements).parents('li').find('.watcher-picker-info').removeClass("on");
                        }else{
                            $elements.parents('li').find('.watcher-picker-info').addClass("on");
                        }
                    }, 10);

                }
            });

        }
    }
}

/**
 * 참조자 정보 팝업 토글
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function memberInfoBtnToggle($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $elements = element.parents('.member-list-items').children('.watcher-picker-info');
            element.on('click', function(_this) {
                $timeout(function(){
                    $($elements).addClass("on");
                }, 100);
            });
            $rootScope.$on('profileClose', function(){
                $timeout(function(){
                    $($elements).removeClass("on");
                }, 100);
            });
            $('body').click(function (e) {
                if ($($elements).has(e.target).length) {
                    $elements.addClass("on");
                }else{
                    $timeout(function () {
                        if (!$('.watcher-item').has(e.target).length) {
                            $($elements).removeClass("on");
                        }
                    }, 100);

                }
            });

        }
    }
}

/**
 * 공통 사용자 정보 팝업 토글
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function commonUserInfoBtnToggle($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $elements = element;
            element.on('click', function(_this) {
                $($elements).parent('li').find('.common-picker-info').addClass("on");
            });
            $rootScope.$on('profileClose', function(){
                $timeout(function(){
                    $($elements).parent('li').find('.common-picker-info').removeClass("on");
                }, 10);
            });
            $('body').click(function (e) {
                var closeYnElement = e.target.getAttribute("class");
                $timeout(function () {
                    if (!$elements.parent('li').has(e.target).length) {
                        $($elements).parent('li').find('.common-picker-info').removeClass("on");
                    }else if(closeYnElement != null && closeYnElement.indexOf("close") > -1){
                        $($elements).parent('li').find('.common-picker-info').removeClass("on");
                    }else{
                        //$elements.parents('li').find('.watcher-picker-info').addClass("on");
                    }
                }, 10);
            });

        }
    }
}

/**
 * 공통 팝업 토글
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function commonPopupToggle($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $element = element;
            element.on('click', function() {
                $($element.next()).addClass("on");
            });
            $rootScope.$on('commonPopupClose', function(){
                $timeout(function(){
                    $($element.next()).removeClass("on");
                }, 100);
            })
            $('body').click(function (e) {
                if (!$($element.parent()).has(e.target).length) {
                    $($element.next()).removeClass("on");
                }else{
                    //$($element.next()).addClass("on");
                }
            });

        }
    }
}
