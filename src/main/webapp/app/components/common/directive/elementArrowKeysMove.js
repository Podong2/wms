/**
 * Created by whjang on 2016-07-05.
 */
(function() {
    'use strict';

    angular.module('wmsApp')
        .directive('wmsElementArrowKeysMove', wmsElementArrowKeysMove);

    wmsElementArrowKeysMove.$inject = ['$log', '$timeout', '$rootScope'];

    function wmsElementArrowKeysMove($log, $timeout, $rootScope) {

        return {
            restrict: 'A',
            scope : {
                inputValue : '=inputValue',
                elementAdd : '&'
            },
            replace: false,
            link: function (scope, element, attrs) {
                scope.$curr = $( ".start-arrow" );
                scope.$currElement = '';
                scope.$curr.css( "background", "#f99" );

                $rootScope.$on("initArrows", function(){
                    var watcherSearchListArea = $('.watcher-search-list-area');
                    var arrowEventLi =$( ".arrow-event-li" );

                    arrowEventLi.css( "background", "" );
                    arrowEventLi.removeClass( "active" );
                    watcherSearchListArea.css('scrollTop', 0);
                    watcherSearchListArea.animate({ scrollTop: 0 }, 0);
                    scope.$curr = $( ".start-arrow" );
                    scope.$currElement = '';
                    scope.$curr.css( "background", "#f99" );
                    scope.$curr.addClass( "active" );
                });

                element.on("keydown keypress", function (event) { // 키 이벤트 체크
                    var watcherSearchListArea = $('.watcher-search-list-area');
                    var arrowEventLi =$( ".arrow-event-li" );

                    if (event.keyCode === 40) { //아래
                        scope.$currElement = scope.$curr.next(); //다음 태그 가져오기
                        if(scope.$currElement.length != 0){
                            scope.$curr = scope.$currElement; //가져온 다음태그 주입
                            arrowEventLi.css( "background", "" );
                            arrowEventLi.removeClass( "active" );
                            scope.$curr.css( "background", "#f99" );
                            scope.$curr.addClass( "active" );
                            var top = scope.$curr.offset().top - watcherSearchListArea.offset().top + watcherSearchListArea.scrollTop(); // 높이 체크
                            if(top > 140){ // 높이가 140이상일때 스크롤 이벤트 수행
                                $log.debug(scope.$curr.offset().top - watcherSearchListArea.offset().top + watcherSearchListArea.scrollTop())
                                watcherSearchListArea.css('scrollTop', scope.$curr.offset().top - watcherSearchListArea.offset().top + watcherSearchListArea.scrollTop());
                                watcherSearchListArea.animate({ scrollTop: scope.$curr.offset().top - watcherSearchListArea.offset().top + watcherSearchListArea.scrollTop() }, 0);
                            }
                            event.preventDefault();
                        }
                        event.preventDefault();
                    } else if (event.keyCode === 38) { // 위
                        scope.$currElement = scope.$curr.prev();
                        if(scope.$currElement.length != 0){
                            scope.$curr = scope.$currElement;
                            arrowEventLi.css( "background", "" );
                            arrowEventLi.removeClass( "active" );
                            scope.$curr.css( "background", "#f99" );
                            scope.$curr.addClass( "active" );
                            $log.debug(scope.$curr.offset().top - watcherSearchListArea.offset().top + watcherSearchListArea.scrollTop())
                            watcherSearchListArea.css('scrollTop', scope.$curr.offset().top - watcherSearchListArea.offset().top + watcherSearchListArea.scrollTop());
                            watcherSearchListArea.animate({ scrollTop: scope.$curr.offset().top - watcherSearchListArea.offset().top + watcherSearchListArea.scrollTop() }, 0);
                            event.preventDefault();
                        }
                    } else if (event.keyCode === 13) { //enter
                        scope.elementValues = {
                            id : ''
                        }
                        var active = scope.$curr[0];
                        scope.elementValues.id = active.getAttribute('value');
                        scope.elementAdd()(scope.elementValues);
                        scope.$apply()
                        event.preventDefault();
                    }else{ //초기 로딩
                        $timeout(function(){
                            scope.$curr = $( ".start-arrow" );
                            scope.$currElement = $( ".start-arrow" );
                            scope.$curr.css( "background", "#f99" );
                            scope.$currElement.css( "background", "#f99" );
                        }, 300);
                    }
                    //else if (event.keyCode === 13) {
                    //    scope.my_tree_grid.remove_node();
                    //    event.preventDefault();
                    //} else if (event.keyCode === 37) {
                    //    var node = scope.my_tree_grid.get_selected_node();
                    //    scope.my_tree_grid.collapse_node(node);
                    //    event.preventDefault();
                    //} else if (event.keyCode === 39) {
                    //    var node = scope.my_tree_grid.get_selected_node();
                    //    scope.my_tree_grid.expand_node(node);
                    //    event.preventDefault();
                    //}
                });
            }
        }
    }
})();
