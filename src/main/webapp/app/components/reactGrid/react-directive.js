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

    var WmsDataComponent = React.createClass({
        displayName: 'LIST',
        render: function () {

            var data = this.props;
            data = [{"0": "1", "1": "1", "2": "1", "3": "1", "4": "1"}];

            var rows = data.map(function (datum) {
                var clickHandler = function (ev) {
                    console.log("Still in reactJs");
                    console.log(ev);
                }

                return (
                    //React.DOM.tr({onClick: clickHandler},
                    //React.DOM.td(null, datum['0']),
                    //React.DOM.td(null, datum['1']),
                    //React.DOM.td(null, datum['2']),
                    //React.DOM.td(null, datum['3']),
                    //React.DOM.td(null, datum['4']))
                    <tr onclick={clickHandler}>
                        <td>datum['0']</td>
                        <td>datum['1']</td>
                        <td>datum['2']</td>
                        <td>datum['3']</td>
                        <td>datum['4']</td>
                    </tr>
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
        .value('WmsDataComponent', WmsDataComponent);
})();

