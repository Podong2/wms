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

    UiComponentController.$inject = ['$scope', 'Principal', 'ModalService', '$state', 'toastr', 'toastrConfig', '$filter', '$uibModal', '$log'];

    function UiComponentController ($scope, Principal, ModalService, $state, toastr, toastrConfig, modalService, $filter, $uibModal, $log) {
        var vm = this;

        vm.openToast = openToast;
        vm.isDisabledDate = isDisabledDate;
        vm.openCalendar = openCalendar;
        vm.getTimeStamp = getTimeStamp;
        vm.modalOpen = modalOpen;
        vm.open = open;
        vm.showStateArray = showStateArray;
        vm.tabDisplay = tabDisplay;


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
            name: '홍길동', // input
            "remember": true, // checkbox
            "status": 2,
            "stateArray": [2, 4],
            "dob": "1984-05-14T15:00:00.000Z"
        };
        // xeditble radio, select
        vm.statuses = [
            {id: 1, name: 'status1'},
            {id: 2, name: 'status2'},
            {id: 3, name: 'status3'},
            {id: 4, name: 'status4'}
        ];
        vm.statusId = '2'; // select box 기본값
        vm.opened = {};

        // ngGallery
        vm.images = [
            {thumb: 'content/images/hipster.png', img: 'content/images/hipster.png', description: 'Image 1'},
            {thumb: 'content/images/logo-jhipster.png', img: 'content/images/logo-jhipster.png', description: 'Image 2'},
            {thumb: 'content/images/hipster2x.png', img: 'content/images/hipster2x.png', description: 'Image 3'},
            {thumb: 'content/images/logo-jhipster.png', img: 'content/images/logo-jhipster.png', description: 'Image 4'}
        ];

        //  탭 메뉴 표시 여부 결정
        vm.tabArea = [
            { status: true },   // side nav
            { status: false },  // select box
            { status: false },  // Input box
            { status: false },  // alerts
            { status: false },  // Toast
            { status: false },  // pagination
            { status: false },  // tooltip
            { status: false },  // datePicker
            { status: false },  // Modal
            { status: false },  // xeditable
            { status: false },  // button
            { status: false },  // ngGallery
            { status: false }   // Tree
        ];


        //Tree values start ///////////////////////////////////////////////////////////////////////////
        vm.list = [
            {
                "id": 1,
                "title": "QSD팀",
                "items": [
                    {
                        "id": 11,
                        "title": "오지영 이사",
                        "items": [
                            {
                                "id": 111,
                                "title": "장원호 선임",
                                "items": []
                            },
                            {
                                "id": 111,
                                "title": "이정선 주임",
                                "items": []
                            },
                            {
                                "id": 111,
                                "title": "한성용 연구원",
                                "items": []
                            }
                        ]
                    }
                ]
            },
            {
                "id": 2,
                "title": "QA팀",
                "nodrop": true,
                "items": [
                    {
                        "id": 21,
                        "title": "홍길동 팀장",
                        "items": []
                    },
                    {
                        "id": 22,
                        "title": "김철수 주임",
                        "items": []
                    }
                ]
            }
        ]
        //Tree values end ///////////////////////////////////////////////////////////////////////////


        // date picker start //////////////////////////////////////////////////////////////////////////
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
        this.picker15 = {
            date: new Date(),
            datepickerOptions: {
                showWeeks: false,
                startingDay: 1,
                dateDisabled: function(data) {
                    return (data.mode === 'day' && (new Date().toDateString() == data.date.toDateString()));
                }
            }
        };

        this.pickerDirective = {
            id : 'pickerDirective',
            date: new Date(),
            option: {
                maskFormat: '9999-99-99',
                dateFormat: 'yyyy-MM-dd',
                showWeeks: false,
                startingDay: 1,
                minDate: new Date()
            }
        };
        this.pickerDirective1 = {
            id : 'pickerDirective',
            date: new Date(),
            option: {
                maskFormat: '9999-99-99',
                dateFormat: 'yyyy-MM-dd',
                showWeeks: false,
                startingDay: 1
            }
        };
        this.pickerDirective2 = {
            id : 'pickerDirective',
            date: new Date('2016-05-01'),
            option: {
                maskFormat: '9999-99-99',
                dateFormat: 'yyyy-MM-dd',
                showWeeks: false,
                startingDay: 1
            }
        };
        this.pickerDirective3 = {
            id : 'pickerDirective',
            date: new Date('2016-08-01'),
            option: {
                maskFormat: '9999-99-99',
                dateFormat: 'yyyy-MM-dd',
                showWeeks: false,
                startingDay: 1
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
        ///////////////////////////////////////////////////////////////////////// date picker end

        // date 포멧 변경
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

        // date 포멧 변경
        function datePickerFormat(n, digits) {
            var zero = '';
            n = n.toString();

            if (n.length < digits) {
                for (var i = 0; i < digits - n.length; i++)
                    zero += '0';
            }
            return zero + n;
        }


        // 달력 오픈 function ///////////////////////////////
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
        });////////////////////////////////////////////////////////

        // toast 제어 function
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
        // toast 설정 watch function
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

        // select box disabled 처리 function
        function isDisabledDate(currentDate, mode) {
            return mode === 'day' && (currentDate.getDay() === 0 || currentDate.getDay() === 6);
        };



        // modal open
        function modalOpen(){
            ModalService.open("title1", "content1", "alertModal.html");
        }

        // xeditable datePicker open
        function open($event, elementOpened) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.opened[elementOpened] = !vm.opened[elementOpened];
        };

        // xeditable select box value return
        vm.showStatus = function(value, name, id) {
            vm.selectArray = [];
            vm.selectArray = vm.statuses;
            var result = "";
            for (var count in vm.selectArray) {
                if (vm.selectArray[count].id == value) {
                    result = vm.selectArray[count].name;
                    break;
                }
            }
            return result;
        };

        // xeditable multi select box value return
        function showStateArray() {
            var selected = [];
            angular.forEach(vm.statuses, function(s) {
                if (vm.user.stateArray.indexOf(s.id) >= 0) {
                    selected.push(s.name);
                }
            });
            return selected.length ? selected.join(', ') : 'Not set';
        };

        //  탭메뉴 영역 표시 여부 지정
        function tabDisplay (number) {
            angular.forEach(vm.tabArea, function (tab, index) {
                if (number == index) {
                    tab.status = true;
                }
                else {
                    tab.status = false;
                }
            });
        }

        vm.state1 = { name: 'New' },
        vm.state2 = { name: 'In progress', areNewItemButtonsHidden: true },
        vm.state3 = { name: 'Done', isCollapsedByDefaultForGroups: true, areNewItemButtonsHidden: true };
        vm.states = [vm.state1, vm.state2, vm.state3];
        vm.resource1 = { name: 'Resource 1', imageUrl: 'Images/Resource1.png' },
        vm.resource2 = { name: 'Resource 2', imageUrl: 'Images/Resource2.png' };
        vm.assignableResources = [vm.resource1, vm.resource2];
        vm.group1 = { name: 'Story 1', state: vm.state2, assignedResource: vm.resource1 },
        vm.group2 = { name: 'Story 2', state: vm.state3, assignedResource: vm.resource2 };
        vm.groups = [vm.group1, vm.group2];
        vm.items = [
            { name: 'Task 1', group: vm.group1, state: vm.state1, assignedResource: vm.resource1 },
            { name: 'Task 2', group: vm.group1, state: vm.state2, assignedResource: vm.resource1 },
            { name: 'Bug 1', group: vm.group1, state: vm.state2, assignedResource: vm.resource1 },
            { name: 'Task 3', group: vm.group1, state: vm.state1, assignedResource: vm.resource2 },
            { name: 'Task 4', group: vm.group1, state: vm.state1, assignedResource: vm.resource1 },
            { name: 'Task 5', group: vm.group2, state: vm.state1, assignedResource: vm.resource2 },
            { name: 'Task 6', group: vm.group2, state: vm.state2, assignedResource: vm.resource2 },
            { name: 'Task 7', group: vm.group2, state: vm.state2, assignedResource: vm.resource1 },
            { name: 'Task 8', group: vm.group2, state: vm.state3, assignedResource: vm.resource2 }
        ];

// Bind data to the user interface.
        vm.states = vm.states;
        vm.groups = vm.groups;
        vm.items = vm.items;
        vm.assignableResources = vm.assignableResources;
        vm.initializeNewItem = initializeNewItem;
        vm.deleteItem = deleteItem;
        vm.onItemStateChanged = onItemStateChanged;
        vm.onItemGroupChanged = onItemGroupChanged;
        vm.moveItemToNextIteration = moveItemToNextIteration;
            // Initialize a newly created item before adding it to the user interface.
        function initializeNewItem(item) {
            item.assignedResource = resource1;
            console.log('A new item was created.');
        };
        // Allow item deletion by clicking a button in the user interface.
        function deleteItem(item) {
            items.splice(items.indexOf(item), 1);
            console.log('Item ' + item.name + ' was deleted.');
        };
        // Handle changes.
        function onItemStateChanged(item, state) {
            console.log('State of ' + item.name + ' was changed to: ' + state.name);
        };
        function onItemGroupChanged(item, group) {
            console.log('Group of ' + item.name + ' was changed to: ' + group.name);
        };
        // Move items to the next iteration.
        vm.nextIteration = vm.nextIteration;
        function moveItemToNextIteration(type, index) {
            if (type === DlhSoft.Controls.KanbanBoard.types.group) {
                // Move an entire group (story) and all its items.
                var group = vm.groups[index];
                for (var i = 0; i < items.length; i++) {
                    var item = vm.items[i];
                    if (item.group === group) {
                        vm.items.splice(i--, 1);
                        nextIteration.items.push(item);
                    }
                }
                vm.groups.splice(index, 1);
                if (nextIteration.groups.indexOf(group) < 0)
                    nextIteration.groups.push(group);
                console.log('Group ' + group.name + ' and its items were moved to next iteration.');
            }
            else {
                // Move a single item, and copy the group (story) if needed.
                var item = vm.items[index];
                vm.items.splice(index, 1);
                nextIteration.items.push(item);
                var group = item.group;
                if (nextIteration.groups.indexOf(group) < 0)
                    nextIteration.groups.push(group);
                console.log('Item ' + item.name + ' was moved to next iteration.');
            }
        };


        // Tree - 트리 노드 삭제 버튼 이벤트
        vm.remove = function (scope) {
            scope.remove();
        };
        // Tree - 트리 노드 접기 버튼 이벤트
        vm.toggle = function (scope) {
            scope.toggle();
        };
        //$scope.moveLastToTheBeginning = function () {
        //    var a = $scope.data.pop();
        //    $scope.data.splice(0, 0, a);
        //};
        // Tree - 트리 노드 추가 버튼 이벤트
        vm.newSubItem = function (scope) {
            var nodeData = scope.$modelValue;
            nodeData.items.push({
                id: nodeData.id * 10 + nodeData.items.length,
                title: nodeData.title + '.' + (nodeData.items.length + 1),
                nodes: []
            });
        };
        // Tree - filter
        $scope.findNodes = function () {

        };
    }
})();
