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
                scope.$curr = $(element).parent().next().find(".start-arrow" );
                scope.$currElement = '';
                scope.$curr.css( "background", "#f99" );

                $rootScope.$on("initArrows", function(){
                    $( ".arrow-event-li" ).css( "background", "" );
                    $( ".arrow-event-li" ).removeClass( "active" );
                    scope.$curr.parents(".watcher-search-list-area").css('scrollTop', 0);
                    scope.$curr.parents(".watcher-search-list-area").animate({ scrollTop: 0 }, 0);
                    scope.$curr = $( ".start-arrow" );
                    scope.$currElement = '';
                    scope.$curr.css( "background", "#f99" );
                    scope.$curr.addClass( "active" );
                });


                element.on("keydown keypress", function (event) {

                    if (event.keyCode === 40) { //아래
                        scope.$currElement = scope.$curr.next();
                        if(scope.$currElement.length != 0){
                            scope.$curr = scope.$currElement;
                            $( ".arrow-event-li" ).css( "background", "" );
                            $( ".arrow-event-li" ).removeClass( "active" );
                            scope.$curr.css( "background", "#f99" );
                            scope.$curr.addClass( "active" );
                            var top = scope.$curr.offset().top - scope.$curr.parents(".watcher-search-list-area").offset().top + scope.$curr.parents(".watcher-search-list-area").scrollTop();
                            if(top > 140){
                                $log.debug(scope.$curr.offset().top - scope.$curr.parents(".watcher-search-list-area").offset().top + scope.$curr.parents(".watcher-search-list-area").scrollTop())
                                scope.$curr.parents(".watcher-search-list-area").css('scrollTop', scope.$curr.offset().top - scope.$curr.parents(".watcher-search-list-area").offset().top + scope.$curr.parents(".watcher-search-list-area").scrollTop());
                                scope.$curr.parents(".watcher-search-list-area").animate({ scrollTop: scope.$curr.offset().top - scope.$curr.parents(".watcher-search-list-area").offset().top + scope.$curr.parents(".watcher-search-list-area").scrollTop() }, 0);
                            }
                            event.preventDefault();
                        }
                        event.preventDefault();
                    } else if (event.keyCode === 38) { // 위
                        scope.$currElement = scope.$curr.prev();
                        if(scope.$currElement.length != 0){
                            scope.$curr = scope.$currElement;
                            $( ".arrow-event-li" ).css( "background", "" );
                            $( ".arrow-event-li" ).removeClass( "active" );
                            scope.$curr.css( "background", "#f99" );
                            scope.$curr.addClass( "active" );
                            $log.debug(scope.$curr.offset().top - scope.$curr.parents(".watcher-search-list-area").offset().top + scope.$curr.parents(".watcher-search-list-area").scrollTop())
                            scope.$curr.parents(".watcher-search-list-area").css('scrollTop', scope.$curr.offset().top - scope.$curr.parents(".watcher-search-list-area").offset().top + scope.$curr.parents(".watcher-search-list-area").scrollTop());
                            scope.$curr.parents(".watcher-search-list-area").animate({ scrollTop: scope.$curr.offset().top - scope.$curr.parents(".watcher-search-list-area").offset().top + scope.$curr.parents(".watcher-search-list-area").scrollTop() }, 0);
                            event.preventDefault();
                        }
                    } else if (event.keyCode === 13) {
                        scope.elementValues = {
                            id : ''
                        }
                        var active = scope.$curr[0];
                        scope.elementValues.id = active.getAttribute('value');
                        scope.elementAdd()(scope.elementValues);
                        scope.$apply()
                        event.preventDefault();
                    }else{
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
