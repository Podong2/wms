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
    //var ReactBsTable  = require('react-bootstrap-table');
    var BootstrapTable = window.BootstrapTable;
    var TableHeaderColumn = window.TableHeaderColumn;

// products will be presented by ReactBsTable
    var getData = [
        {
            id: 1,
            name: "Product1",
            price: 120,
            getData : function(){
                return [
                    {
                        id: 2,
                        name: "Product2",
                        price: 80
                    },{
                        id: 3,
                        name: "Product3",
                        price: 207
                    },{
                        id: 4,
                        name: "Product4",
                        price: 100
                    },{
                        id: 5,
                        name: "Product5",
                        price: 150
                    },{
                        id: 6,
                        name: "Product1",
                        price: 160
                    }
                ]
            }
        },{
            id: 2,
            name: "Product2",
            price: 80
        },{
            id: 3,
            name: "Product3",
            price: 207
        },{
            id: 4,
            name: "Product4",
            price: 100
        },{
            id: 5,
            name: "Product5",
            price: 150
        },{
            id: 6,
            name: "Product1",
            price: 160
        }
    ];
    var WmsDataComponent = React.createClass({
        render :  function(){
            return (
                <BootstrapTable data={getData} striped={true} hover={true}>
                    <TableHeaderColumn isKey={true} dataField="id">Product ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="name">Product Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="price">Product Price</TableHeaderColumn>
                </BootstrapTable>,
                    document.getElementById("basic")
                )
         }

    });


    //var WmsDataComponent = React.createClass({
    //
    //
    //    //displayName: 'LIST',
    //    render: function () {
    //
    //        var data = this.props;
    //        data = [{"0": "1", "1": "2", "2": "3", "3": "4", "4": "5"}];
    //        var data = [
    //            {
    //                id: 1,
    //                name: "Product1",
    //                price: 120
    //            },{
    //                id: 2,
    //                name: "Product2",
    //                price: 80
    //            },{
    //                id: 3,
    //                name: "Product3",
    //                price: 207
    //            },{
    //                id: 4,
    //                name: "Product4",
    //                price: 100
    //            },{
    //                id: 5,
    //                name: "Product5",
    //                price: 150
    //            },{
    //                id: 6,
    //                name: "Product1",
    //                price: 160
    //            }
    //        ];
    //
    //            //return (
    //            //    //<tr onclick={clickHandler}>
    //            //    //    <td>{datum[0]}</td>
    //            //    //    <td>{datum[1]}</td>
    //            //    //    <td>{datum[2]}</td>
    //            //    //    <td>{datum[3]}</td>
    //            //    //    <td>{datum[4]}</td>
    //            //    //</tr>
    //            //
    //            //);
    //
    //        return (
    //            <BootstrapTable data={data} striped={true} hover={true}>
    //                <TableHeaderColumn isKey={true} dataField="id">Product ID</TableHeaderColumn>
    //                <TableHeaderColumn dataField="name">Product Name</TableHeaderColumn>
    //                <TableHeaderColumn dataField="price">Product Price</TableHeaderColumn>
    //            </BootstrapTable>
    //            React.DOM.table(null,
    //                rows
    //            )
    //        );
    //    }
    //});

    angular
        .module('wmsApp')
        .value('WmsDataComponent', WmsDataComponent);
})();

