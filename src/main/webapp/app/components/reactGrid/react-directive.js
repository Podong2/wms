/*
 * Copyright (c) 2016. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 * Created by 와이즈스톤 on 2016-06-19.
 */

(function() {
    'use strict';

    var LIST = React.createClass({displayName: 'LIST',
        render: function() {

            var data = this.props.data;

            var rows = data.map(function(datum) {
                var clickHandler = function(ev){
                    console.log("Still in reactJs");
                    console.log(ev);
                }

                return (
                    React.DOM.tr( {onClick:clickHandler},
                        React.DOM.td(null, datum['0']),
                        React.DOM.td(null, datum['1']),
                        React.DOM.td(null, datum['2']),
                        React.DOM.td(null, datum['3']),
                        React.DOM.td(null, datum['4'])
                    )
                );
            });

            return (
                React.DOM.table(null,
                    rows
                )
            );
        }
    });

    angular
        .module('wmsApp')
        .directive('fastRepeat', fastRepeat)
fastRepeat.$inject=[];
            function fastRepeat(){
            return{
                restrict: 'E',
                scope:{
                    data: '=data'
                },
                link:function(scope, el, attrs){
                    scope.$watch('data', function(newValue, oldValue){
                        React.renderComponent(
                            LIST({data:newValue}),
                            el[0]);
                    })
                }
            }
        }
})();


