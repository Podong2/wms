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
    .directive('relatedTaskPickerBtnToggle', relatedTaskPickerBtnToggle)
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
relatedTaskPickerBtnToggle.$inject=['$rootScope', '$timeout'];
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
            element.on('click', function(_this) {
                $("body").bind("click", function(e){
                    if ($('.editingSection').addClass("on"), $('.elementSection').addClass("on")) {
                        if (!$('#editingSection').has(e.target).length) {
                            $('.editingSection').removeClass("on");
                            $('.elementSection').removeClass("on");
                            $rootScope.$broadcast("editingUpload")
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
            $('body').click(function (e) {
                if(openYn){
                    if ($('.projectPickerAddSection').addClass("on"), $('.projectValueAddSection').addClass("on")) {
                        if (!$('#projectPickerAddSection').has(e.target).length) {
                            $('.projectPickerAddSection').removeClass("on");
                            $('.projectValueAddSection').removeClass("on");
                            openYn = true;
                        }
                    }
                }else openYn = true;

            });
            $rootScope.$on('projectPickerAddClose', function(event, args){
                openYn = args;
                $('.projectPickerAddSection').removeClass("on");
                $('.projectValueAddSection').removeClass("on");
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
            $('body').click(function (e) {
                if ($('.projectPickerSection').addClass("on"), $('.projectValueSection').addClass("on")) {
                    if (!$('#projectPickerSection').has(e.target).length) {
                        $('.projectPickerSection').removeClass("on");
                        $('.projectValueSection').removeClass("on");
                    }
                }
            });
            $rootScope.$on('projectEditClose', function(){
                $('.projectPickerSection').removeClass("on");
                $('.projectValueSection').removeClass("on");
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
                $('.projectAddSection').removeClass("on");
                $('.projectAddValueSection').removeClass("on");
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
            });
            $rootScope.$on('watcherPopupClose', function(){
                closeYn = true;
            })
            $('body').click(function (e) {
                if (!$($elements.parent()).has(e.target).length || closeYn) {
                    $timeout(function () {
                        $($elements).removeClass("on");
                        closeYn = false;
                    }, 100);
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
            var $elements = element.parents('td').children('.watcher-picker-info');
            var closeYn = false;
            element.on('click', function(_this) {
                //$($elements).addClass("on");
            });
            //$rootScope.$on('watcherPopupClose', function(){
            //    closeYn = true;
            //    $($elements).removeClass("on");
            //})
            $('body').click(function (e) {
                if(closeYn){
                    $($elements).removeClass("on");
                    closeYn = false;
                }else{
                    if ($($elements).has(e.target).length) {
                        $elements.addClass("on");
                    }else{
                        $timeout(function () {
                            if (!$('.watcher-item').has(e.target).length) {
                                $($elements).removeClass("on");
                                closeYn = false;
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
 * 참조자 팝업 토글
 * @param $timeout
 * @returns {{restrict: string, link: link}}
 */
function relatedTaskPickerBtnToggle($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var $elements = element.next();
            var closeYn = false;
            element.on('click', function(_this) {
                $($elements).addClass("on");
            });
            $rootScope.$on('relatedTaskPopupClose', function(){
                closeYn = true;
                $($elements).removeClass("on");
            })
            $('body').click(function (e) {
                if (!$($elements.parent()).has(e.target).length || closeYn) {
                    $timeout(function () {
                        //$($elements).removeClass("on");
                        closeYn = false;
                    }, 100);
                }
            });

        }
    }
}
