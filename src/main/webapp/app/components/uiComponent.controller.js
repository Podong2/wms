/*
 * Copyright (c) 2016. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

(function() {
    'use strict';

    angular
        .module('wmsApp')
        .controller('UiComponentController', HomeController);

    HomeController.$inject = ['$scope', 'Principal', 'LoginService', '$state'];

    function HomeController ($scope, Principal, LoginService, $state) {
        var vm = this;

        //select box
        vm.selectValue = [
            {name: 'apple', key: 'c1: apple'},
            {name: 'orange', key: 'c2: orange'},
            {name: 'berry', key: 'c3: berry'}
        ];

        // multi select values
        vm.arrayCollection = [
            {name: 'Alice', class: 'Class A', icon: 'glyphicon-euro'},
            {name: 'Bob', class: 'Class B', icon: 'glyphicon-usd'},
            {name: 'Carl', class: 'Class A', icon: 'glyphicon-euro'},
            {name: 'Daniel', class: 'Class B', icon: 'glyphicon-usd'},
            {name: 'Emi', class: 'Class A', icon: 'glyphicon-euro'},
            {name: 'Flank', class: 'Class B', icon: 'glyphicon-gbp'},
            {name: 'George', class: 'Class C', icon: 'glyphicon-euro'},
            {name: 'Harry', class: 'Class C', icon: 'glyphicon-gbp'}
        ];

        // select checked value
        vm.selectedValue = [];
        // multi select checked values
        vm.multipleValue = [];

        // input check
        vm.inputCheck = "success";


    }
})();
