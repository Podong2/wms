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
        .controller('UiComponentController', UiComponentController);

    UiComponentController.$inject = ['$scope', 'Principal', 'LoginService', '$state', 'toastr', 'toastrConfig', '$filter', '$uibModal'];

    function UiComponentController ($scope, Principal, LoginService, $state, toastr, toastrConfig, modalService, $filter, $uibModal) {
        var vm = this;

        vm.openToast = openToast;
        vm.isDisabledDate = isDisabledDate;
        vm.openCalendar = openCalendar;
        vm.getTimeStamp = getTimeStamp;
        vm.modalOpen = modalOpen;

        function modalOpen(){
            LoginService.open("title1", "content1", "alertModal.html");
        }

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
        vm.errorMsg = "오류오류오류";

        vm.testDate = "";

        // toastr option
        vm.options = {
            autoDismiss: false,
            position: 'toast-top-right',
            type: 'success',
            timeout: '5000',
            extendedTimeout: '1000',
            html: false,
            closeButton: false,
            tapToDismiss: true,
            progressBar: false,
            closeHtml: '<button>&times;</button>',
            newestOnTop: true,
            maxOpened: 0,
            preventDuplicates: false,
            preventOpenDuplicates: false
        };

        //xeditble
        vm.user = {
            name: 'awesome user'
        };

        // date picker
        this.picker1 = {
            date: new Date(),
            datepickerOptions: {
                showWeeks: false,
                startingDay: 1,
                dateDisabled: function(data) {
                    return (data.mode === 'day' && (new Date().toDateString() == data.date.toDateString()));
                }
            }
        };

        // time picker
        this.picker2 = {
            date: new Date('2015-03-01T12:30:00Z'),
            timepickerOptions: {
                readonlyInput: false,
                showMeridian: false
            }
        };

        // date and time picker
        this.picker3 = {
            date: new Date()
        };

        // min date picker
        this.picker4 = {
            date: new Date(),
            datepickerOptions: {
                maxDate: null
            }
        };

        // max date picker
        this.picker5 = {
            date: new Date(),
            datepickerOptions: {
                minDate: null
            }
        };

        // set date for max picker, 10 days in future
        this.picker5.date.setDate(this.picker5.date.getDate() + 10);

        // global config picker
        this.picker6 = {
            date: new Date()
        };

        // dropdown up picker
        this.picker7 = {
            date: new Date()
        };

        // view mode picker
        this.picker8 = {
            date: new Date(),
            datepickerOptions: {
                mode: 'year',
                minMode: 'year',
                maxMode: 'year'
            }
        };

        // dropdown up picker
        this.picker9 = {
            date: null
        };

        // min time picker
        this.picker10 = {
            date: new Date('2016-03-01T09:00:00Z'),
            timepickerOptions: {
                max: null
            }
        };

        // max time picker
        this.picker11 = {
            date: new Date('2016-03-01T10:00:00Z'),
            timepickerOptions: {
                min: null
            }
        };

        // button bar
        this.picker12 = {
            date: new Date(),
            buttonBar: {
                show: true,
                now: {
                    show: true,
                    text: 'Now!'
                },
                today: {
                    show: true,
                    text: 'Today!'
                },
                clear: {
                    show: false,
                    text: 'Wipe'
                },
                date: {
                    show: true,
                    text: 'Date'
                },
                time: {
                    show: true,
                    text: 'Time'
                },
                close: {
                    show: true,
                    text: 'Shut'
                }
            }
        };

        // when closed picker
        this.picker13 = {
            date: new Date(),
            closed: function(args) {
                vm.closedArgs = args;
            }
        };

        // saveAs - ISO
        this.picker14 = {
            date: new Date().toISOString()
        }

        function getTimeStamp() {
            var d = vm.picker1.date;
            var formatDate =
                datePickerFormat(d.getFullYear(), 4) + '-' +
                datePickerFormat(d.getMonth() + 1, 2) + '-' +
                datePickerFormat(d.getDate(), 2) + ' ' +

                datePickerFormat(d.getHours(), 2) + ':' +
                datePickerFormat(d.getMinutes(), 2) + ':' +
                datePickerFormat(d.getSeconds(), 2);
            alert(formatDate);
            return formatDate;
        }

        function datePickerFormat(n, digits) {
            var zero = '';
            n = n.toString();

            if (n.length < digits) {
                for (var i = 0; i < digits - n.length; i++)
                    zero += '0';
            }
            return zero + n;
        }



        function openCalendar(e, picker) {
            vm[picker].open = true;
        };

        // watch min and max dates to calculate difference
        var unwatchMinMaxValues = $scope.$watch(function() {
            return [vm.picker4, vm.picker5, vm.picker10, vm.picker11];
        }, function() {
            // min max dates
            vm.picker4.datepickerOptions.maxDate = vm.picker5.date;
            vm.picker5.datepickerOptions.minDate = vm.picker4.date;

            if (vm.picker4.date && vm.picker5.date) {
                var diff = vm.picker4.date.getTime() - vm.picker5.date.getTime();
                vm.dayRange = Math.round(Math.abs(diff/(1000*60*60*24)))
            } else {
                vm.dayRange = 'n/a';
            }

            // min max times
            vm.picker10.timepickerOptions.max = vm.picker11.date;
            vm.picker11.timepickerOptions.min = vm.picker10.date;
        }, true);


        // destroy watcher
        $scope.$on('$destroy', function() {
            unwatchMinMaxValues();
        });

        vm.openedToasts = [];
        function openToast(){
            toastr.info('What a nice apple button', 'Button spree', {
                closeButton: true,
                closeHtml: "<a ng-click='test()'>이벤트 버튼</a>"
            });
            toastrConfig.timeOut = 3000;
            toastrConfig.positionClass = 'toast-bottom-right';
            toastr.success('Hello world!', 'Toastr fun!');
            toastr.error('Your credentials are gone', 'Error');
            toastr.warning('Your computer is about to explode!', 'Warning');


        }

        $scope.$watchCollection('vm.options', function(newValue) {
            //toastrConfig.autoDismiss = newValue.autoDismiss;
            //toastrConfig.allowHtml = newValue.html;
            //toastrConfig.extendedTimeOut = parseInt(newValue.extendedTimeout, 10);
            toastrConfig.positionClass = newValue.position;
            toastrConfig.timeOut = parseInt(newValue.timeout, 10);
            //toastrConfig.closeButton = newValue.closeButton;
            //toastrConfig.tapToDismiss = newValue.tapToDismiss;
            //toastrConfig.progressBar = newValue.progressBar;
            //toastrConfig.closeHtml = newValue.closeHtml;
            //toastrConfig.newestOnTop = newValue.newestOnTop;
            //toastrConfig.maxOpened = newValue.maxOpened;
            //toastrConfig.preventDuplicates = newValue.preventDuplicates;
            //toastrConfig.preventOpenDuplicates = newValue.preventOpenDuplicates;
            //if (newValue.customTemplate) {
            //    toastrConfig.templates.toast = 'custom';
            //} else {
            //    toastrConfig.templates.toast = 'directives/toast/toast.html';
            //}
        });

        // Disable weekend selection
        function isDisabledDate(currentDate, mode) {
            return mode === 'day' && (currentDate.getDay() === 0 || currentDate.getDay() === 6);
        };

    }
})();
