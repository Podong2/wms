/**
 * Created by whjang on 2016-07-05.
 */
(function() {
    'use strict';

    angular.module('wmsApp')
        .directive('wmsElementArrowKeysMove', wmsElementArrowKeysMove);

    wmsElementArrowKeysMove.$inject = ['$log', '$timeout'];

    function wmsElementArrowKeysMove($log, $timeout) {

        return {
            restrict: 'A',
            scope : {
                inputValue : '=inputValue',
                elementAdd : '&'
            },
            replace: false,
            link: function (scope, element, attrs) {
                var $curr = $( ".start-arrow" );
                var $currElement = '';
                $curr.css( "background", "#f99" );
                element.on("keydown keypress", function (event) {

                        if (event.keyCode === 40) { //아래
                            $currElement = $curr.next();
                            if($currElement.length != 0){
                                $curr = $currElement;
                                $( ".arrow-event-li" ).css( "background", "" );
                                $( ".arrow-event-li" ).removeClass( "active" );
                                $curr.css( "background", "#f99" );
                                $curr.addClass( "active" );
                                var top = $curr.offset().top - $('.watcher-search-list-area').offset().top + $('.watcher-search-list-area').scrollTop();
                                if(top > 140){
                                    $log.debug($curr.offset().top - $('.watcher-search-list-area').offset().top + $('.watcher-search-list-area').scrollTop())
                                    $('.watcher-search-list-area').css('scrollTop', $curr.offset().top - $('.watcher-search-list-area').offset().top + $('.watcher-search-list-area').scrollTop());
                                    $('.watcher-search-list-area').animate({ scrollTop: $curr.offset().top - $('.watcher-search-list-area').offset().top + $('.watcher-search-list-area').scrollTop() }, 0);
                                }
                                event.preventDefault();
                            }
                            event.preventDefault();
                        } else if (event.keyCode === 38) { // 위
                            $currElement = $curr.prev();
                            if($currElement.length != 0){
                                $curr = $currElement;
                                $( ".arrow-event-li" ).css( "background", "" );
                                $( ".arrow-event-li" ).removeClass( "active" );
                                $curr.css( "background", "#f99" );
                                $curr.addClass( "active" );
                                $log.debug($curr.offset().top - $('.watcher-search-list-area').offset().top + $('.watcher-search-list-area').scrollTop())
                                $('.watcher-search-list-area').css('scrollTop', $curr.offset().top - $('.watcher-search-list-area').offset().top + $('.watcher-search-list-area').scrollTop());
                                $('.watcher-search-list-area').animate({ scrollTop: $curr.offset().top - $('.watcher-search-list-area').offset().top + $('.watcher-search-list-area').scrollTop() }, 0);
                                event.preventDefault();
                            }
                        } else if (event.keyCode === 13) {
                            var elementValues = {
                                id : ''
                            }
                            elementValues.id = $('.arrow-event-li.active').data('id');
                            scope.elementAdd()(elementValues);
                            event.preventDefault();
                        }else{
                            $timeout(function(){
                                $curr = $( ".start-arrow" );
                                $currElement = $( ".start-arrow" );
                                $curr.css( "background", "#f99" );
                                $currElement.css( "background", "#f99" );
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
