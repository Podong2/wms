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
                elementValue : '=elementValue',
                elementAdd : '&',
                elementFind : '&'
            },
            replace: false,
            link: function (scope, element, attrs) {
                var $element = $(element);
                var $curr = '';
                $curr = $(element).parent().next().find(".start-arrow" );
                var $currElement = '';
                $curr.css( "background", "#E1F2FF" );

                $rootScope.$on("initArrows", function(){
                    $log.debug($element)
                    var ele = $element;
                    $timeout(function(){
                        $log.debug(ele)
                        ele.parent().next().find( ".arrow-event-li" ).css( "background", "" );
                        ele.parent().next().find( ".arrow-event-li" ).removeClass( "active" );
                        $curr.parents(".watcher-search-list-area").css('scrollTop', 0);
                        $curr.parents(".watcher-search-list-area").animate({ scrollTop: 0 }, 0);
                        $curr = ele.parent().next().find(".start-arrow" );
                        $currElement = '';
                        $curr.css( "background", "#E1F2FF" );
                        $curr.addClass( "active" );
                    }, 100)
                });

                var watcherName = '';
                scope.$watch('elementValue', function(value){
                    if(value){
                        if(watcherName != value) {
                            watcherName = value;
                            scope.elementFind()(value).then(function(result){
                                $timeout(function(){
                                    $log.debug(result)
                                    var ele = $element;
                                    $curr = ele.parent().next().find(".start-arrow" );
                                    $currElement = ele.parent().next().find(".start-arrow" );
                                    $( ".arrow-event-li" ).css( "background", "" );
                                    $( ".arrow-event-li" ).removeClass( "active" );
                                    $curr.css( "background", "#E1F2FF" );
                                    $currElement.css( "background", "#E1F2FF" );
                                }, 100)
                            });
                        }

                    }
                });


                element.on("keydown keypress", function (event) {

                    if (event.keyCode === 40) { //아래
                        $currElement = $curr.next();
                        if($currElement.length != 0){
                            $curr = $currElement;
                            $( ".arrow-event-li" ).css( "background", "" );
                            $( ".arrow-event-li" ).removeClass( "active" );
                            $curr.css( "background", "#E1F2FF" );
                            $curr.addClass( "active" );
                            var top = $curr.offset().top - $curr.parents(".watcher-search-list-area").offset().top + $curr.parents(".watcher-search-list-area").scrollTop();
                            if(top > 140){
                                $log.debug($curr.offset().top - $curr.parents(".watcher-search-list-area").offset().top + $curr.parents(".watcher-search-list-area").scrollTop())
                                $curr.parents(".watcher-search-list-area").css('scrollTop', $curr.offset().top - $curr.parents(".watcher-search-list-area").offset().top + $curr.parents(".watcher-search-list-area").scrollTop());
                                $curr.parents(".watcher-search-list-area").animate({ scrollTop: $curr.offset().top - $curr.parents(".watcher-search-list-area").offset().top + $curr.parents(".watcher-search-list-area").scrollTop() }, 0);
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
                            $curr.css( "background", "#E1F2FF" );
                            $curr.addClass( "active" );
                            $log.debug($curr.offset().top - $curr.parents(".watcher-search-list-area").offset().top + $curr.parents(".watcher-search-list-area").scrollTop())
                            $curr.parents(".watcher-search-list-area").css('scrollTop', $curr.offset().top - $curr.parents(".watcher-search-list-area").offset().top + $curr.parents(".watcher-search-list-area").scrollTop());
                            $curr.parents(".watcher-search-list-area").animate({ scrollTop: $curr.offset().top - $curr.parents(".watcher-search-list-area").offset().top + $curr.parents(".watcher-search-list-area").scrollTop() }, 0);
                            event.preventDefault();
                        }
                    } else if (event.keyCode === 13) { //enter
                        var elementValues = {
                            id : ''
                        }
                        var active = $curr[0];
                        elementValues.id = active.getAttribute('value');
                        scope.elementAdd()(elementValues)
                        scope.$apply()
                        event.preventDefault();
                    }else if(event.keyCode !== undefined && event.keyCode !== null && event.keyCode !== 40 && event.keyCode !== 13 && event.keyCode !== 38){
                        //var ele = $element;
                        //$curr = ele.parent().next().find(".start-arrow" );
                        //$currElement = ele.parent().next().find(".start-arrow" );
                        //$( ".arrow-event-li" ).css( "background", "" );
                        //$( ".arrow-event-li" ).removeClass( "active" );
                        //$curr.css( "background", "#E1F2FF" );
                        //$currElement.css( "background", "#E1F2FF" );
                    }
                    //else if (event.keyCode === 13) {
                    //    my_tree_grid.remove_node();
                    //    event.preventDefault();
                    //} else if (event.keyCode === 37) {
                    //    var node = my_tree_grid.get_selected_node();
                    //    my_tree_grid.collapse_node(node);
                    //    event.preventDefault();
                    //} else if (event.keyCode === 39) {
                    //    var node = my_tree_grid.get_selected_node();
                    //    my_tree_grid.expand_node(node);
                    //    event.preventDefault();
                    //}
                });
            }
        }
    }
})();
