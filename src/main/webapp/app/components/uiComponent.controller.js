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

    UiComponentController.$inject = ['$scope', 'Principal', 'ModalService', '$state', 'toastr', 'summaryService', 'toastrConfig', 'FIndCode', '$log', 'findUser', '$q', 'tableService', 'moment', '$filter', 'dataService', '$sce'];

    function UiComponentController ($scope, Principal, ModalService, $state, toastr, summaryService, toastrConfig, FIndCode, $log, findUser, $q, tableService, moment, $filter, dataService, $sce) {
        var vm = this;

        vm.openToast = openToast;
        vm.isDisabledDate = isDisabledDate;
        vm.openCalendar = openCalendar;
        vm.getTimeStamp = getTimeStamp;
        vm.modalOpen = modalOpen;
        vm.open = open;
        vm.showStateArray = showStateArray;
        vm.tabDisplay = tabDisplay;
        vm.submitConfig = submitConfig;
        vm.renderHtml = renderHtml;
        vm.autoValueInit = autoValueInit;

        //	설명 html 형식으로 표현
        function renderHtml (data) {
            return $sce.trustAsHtml(data);
        }

        $scope.tags = [];
        $scope.loadData = function(name) {
            $log.debug("name - : ", name);
            var deferred = $q.defer();
            findUser.findByName(name).then(function(result){
                deferred.resolve(result);
                $log.debug("userList : ", result);
            }); //user search
            return deferred.promise;
        };

        // auto-complate : 다중사용자 모드 변경시 tags 값 초기화
        vm.autoType = false;
        function autoValueInit(){
            $scope.tags =[];
        }


        vm.textValue = "";
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
            progressBar: true,
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
            { status: false },   // side nav
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
            { status: false },   // Tree
            { status: false },   // layout
            { status: false },   // submit
            { status: false },  // auto-complete
            { status: false },  // dashboard
            { status: false },  // table
            { status: false },  // chart
            { status: false },  // calendar
            { status: false },  // gantt
            { status: true },  // kanban
            { status: false }  // summernote
        ];


        //Tree values start ///////////////////////////////////////////////////////////////////////////

        $scope.wmsTreeData = [{
            "id": 1,
            "parentId": null,
            "name": "가가가가가가가가",
            "description": "설명설명설명설명설명설명1",
            "icon": "glyphicon glyphicon-align-justify"
        },
        {
            "id": 2,
            "parentId": 1,
            "name": "다다다다다다다다",
            "description": "설명설명설명설명설명설명222222",
            "icon": "glyphicon glyphicon-tag"
        },
        {
            "id": 3,
            "parentId": 2,
            "name": "나나나나나나나나",
            "description": "설명설명설명설명설명설명3333"
        },
        {
            "id": 201,
            "parentId": null,
            "name": "라라라라라라라라",
            "description": "설명설명설명설명설명설명4444444",
            "icon": "glyphicon glyphicon-cog"
        },
        {
            "id": 301,
            "parentId": null,
            "name": "마마마마마마마마",
            "description": "설명설명설명설명설명설명556615566655555",
            "icon": "glyphicon glyphicon-align-justify"
        }];
        $scope.wmsTreeData2 = [{
            "id": 1,
            "parentId": null,
            "name": "가가가가가가가가",
            "description": "설명설명설명설명설명설명1",
            "icon": "glyphicon glyphicon-align-justify"
        },
        {
            "id": 2,
            "parentId": 1,
            "name": "다다다다다다다다",
            "description": "설명설명설명설명설명설명222222",
            "icon": "glyphicon glyphicon-tag"
        },
        {
            "id": 3,
            "parentId": 2,
            "name": "나나나나나나나나",
            "description": "설명설명설명설명설명설명3333"
        },
        {
            "id": 201,
            "parentId": null,
            "name": "라라라라라라라라",
            "description": "설명설명설명설명설명설명4444444",
            "icon": "glyphicon glyphicon-cog"
        },
        {
            "id": 301,
            "parentId": null,
            "name": "마마마마마마마마",
            "description": "설명설명설명설명설명설명556615566655555",
            "icon": "glyphicon glyphicon-align-justify"
        }];

        $scope.wmsTreeColumnDefinitions = [
            {
                field:         'description',
                titleClass:    'text-center',
                displayName:   '설명'
            },
            {
                titleStyle:    {
                    'width': '80px'
                },
                titleClass:    'text-center',
                cellClass:     'v-middle text-center',
                displayName:   ' ',
                cellTemplate:  '<button ng-click="tree.remove_node(node)" class="btn btn-default btn-sm">삭제</button>'
            }];

        $scope.treeScope;

        vm.nodeForm = {name : "", description : ""};

        $scope.addNode = function() {

            var node = {
                "name": vm.nodeForm.name,
                "description": vm.nodeForm.description
            };

            node.id = $scope.wmsTreeData2.length;

            $scope.treeScope.addNode(node);

            vm.nodeForm.name = "";
            vm.nodeForm.description = "";
        };
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
        this.pickerDirective = {
            id : 'pickerDirective',
            date: new Date(),
            option: {
                maskFormat: '9999-99-99',
                dateFormat: 'yyyy-MM-dd',
                showWeeks: false,
                startingDay: 1,
                minDate: new Date()
            },
            linkedPicker : {
                model : this.pickerDirective3,
                type : 'maxDate'
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
        };
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

        // select box disabled 처리 function
        function isDisabledDate(currentDate, mode) {
            return mode === 'day' && (currentDate.getDay() === 0 || currentDate.getDay() === 6);
        }

        // modal open
        function modalOpen(){
            ModalService.open("title1", "content1", "alertModal.html");
        }

        // xeditable datePicker open
        function open($event, elementOpened) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.opened[elementOpened] = !vm.opened[elementOpened];
        }

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
        }

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
        //$scope.findNodes = function () {
        //};


        /*--------------------- layout - grid system data --------------------*/
        $scope.tempConfigs= [];
        $scope.summaryConfigs = [];

        // 테스트 데이타
        $scope.responseData = {
            data : [{
                assigneeName : "Administrator",
                dueDate : "2016-07-04",
                name : "bootstrap grid system",
                severityName : "높음",
                createName : "한성용",
                watcherName : "관찰자",
                statusName : "상태값"
            }]
        };

        $scope.columnDatas = [
            {
                key : "name",
                language : "이름",
                renderer : "randerer",
                rendererType : "text"
            },
            {
                key : "dueDate",
                language : "날짜",
                renderer : "randerer",
                rendererType : "date"
            },
            {
                key : "severityName",
                language : "중요도",
                renderer : "randerer",
                rendererType : "select"
            },
            {
                key : "createName",
                language : "생성자",
                renderer : "randerer",
                rendererType : "userPicker"
            },
            {
                key : "watcherName",
                language : "관찰자",
                renderer : "randerer",
                rendererType : "userPicker"
            },
            {
                key : "statusName",
                language : "상태",
                renderer : "",
                rendererType : ""
            }
        ];
        /*--------------------- layout - grid system data --------------------*/

        /*--------------------- layout - grid system end --------------------*/


        // submit 시 프로그래스 바 테스트
        function submitConfig(){
            FIndCode.findByCodeType("severity").then(function(result){ vm.code = result; }); // 중요도 요청
            FIndCode.findByCodeType("severity").then(function(result){ vm.code = result; }); // 중요도 요청
            FIndCode.findByCodeType("severity").then(function(result){ vm.code = result; }); // 중요도 요청
            FIndCode.findByCodeType("severity").then(function(result){ vm.code = result; }); // 중요도 요청
            FIndCode.findByCodeType("severity").then(function(result){ vm.code = result; }); // 중요도 요청
            FIndCode.findByCodeType("severity").then(function(result){ vm.code = result; }); // 중요도 요청
            FIndCode.findByCodeType("severity").then(function(result){ vm.code = result; }); // 중요도 요청
            FIndCode.findByCodeType("severity").then(function(result){ vm.code = result; }); // 중요도 요청
        }
        /*----------------------table - smart table--------------------------*/

        vm.wmsTableData = [];

        // for (var i=0; i<50; i++) {
        //     vm.wmsTableData.push({
        //         name:"name-"+i,
        //         field1:"field1-"+i,
        //         field2:"field2-"+i,
        //         field3:"field3-"+i
        //     });
        // }

        $scope.loadWmsTableData = function() {

            vm.wmsTableData.length = 0;

            for (var i=0; i<50; i++) {
                vm.wmsTableData.push({
                    name:"name-"+i,
                    field1: '6546456',
                    field2: '12312311',
                    field1_color: '#'+Math.floor(Math.random()*16777215).toString(16),
                    icon: 'glyphicon glyphicon-heart'
                });
            }

            // vm.wmsTableData = _tableData;
        };

        $scope.updateCallback = function(row) {
            $log.debug("row updated : ", row);
        };

        vm.tableConfigs = [];
        vm.tableConfigs.push(tableService.getConfig("", "checked")
            .setHWidth("width-30-p")
            .setDAlign("text-center")
            .setHAlign("text-center")
            .setDType("check"));
        vm.tableConfigs.push(tableService.getConfig("제목", "name")
            .setDType("renderer")
            .setDRenderer("field_edit"));

        /**
         *
         .setDType(uiConstant.common.RENDERER)
         .setDRenderer(uiConstant.renderType.PROJECT_ROLE_DETAIL)
         */

        vm.tableConfigs.push(tableService.getConfig("필드1", "field1")
            .setHWidth("width-200-p")
            .setDAlign("text-center")
            .setDColor('field1_color')
            .setDIcon('icon'));
        vm.tableConfigs.push(tableService.getConfig("필드2", "field2")
            .setHWidth("width-80-p")
            .setDAlign("text-center")
            .setDType("number"));


        /*---------------------------Calendar------------------------------------------- */

        vm.holidays = ['01-01', '03-01', '05-05', '05-14', '06-06', '10-03', '10-09', '08-15', '12-25'];

        vm.events = [
            {
                title: '이벤트1',
                type: 'warning',
                startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
                endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
                draggable: true,
                resizable: true
            }, {
                title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">이벤트2</span>, <i>html</i> 타이틀',
                type: 'info',
                startsAt: moment().subtract(1, 'day').toDate(),
                endsAt: moment().add(5, 'days').toDate(),
                draggable: true,
                resizable: true
            }, {
                title: '매월 반복 이벤트',
                type: 'special',
                startsAt: moment().startOf('day').add(7, 'hours').toDate(),
                endsAt: moment().startOf('day').add(19, 'hours').toDate(),
                recursOn: 'month',
                draggable: true,
                resizable: true
            }
        ];

        vm.addSchedule = function() {
            $log.debug("addSchedule");

            vm.events.push({
                title: '사용자 추가 이벤트',
                type: 'error',
                startsAt: moment().startOf('day').add(7, 'hours').toDate(),
                endsAt: moment().startOf('day').add(19, 'hours').toDate(),
                recursOn: 'month',
                draggable: true,
                resizable: true
            });
        };

        vm.eventClicked = function(event) {
            $log.debug('eventClicked : ', event);
        };

        vm.eventEdited = function(event) {
            $log.debug('eventEdited : ', event);
        };

        vm.eventDeleted = function(event) {
            $log.debug('eventDeleted : ', event);

            var index = vm.events.indexOf(event);
            vm.events.splice(index, 1);
        };

        vm.eventTimesChanged = function(event) {
            $log.debug('eventTimesChanged : ', event);
        };





        /*----------------------------------------------------------------- chart data ---------------------------------------------------------------------*/

        $scope.columnOptions = {
            chart: {
                type: 'discreteBarChart', // 차트 타입
                height: 450, // 차트의 높이 지정
                margin : { // 차트 노출영역의 margin값 지정
                    top: 20,
                    right: 40,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.label;}, // x축 data key 지정
                y: function(d){return d.value;}, // y축 data key 지정
                showValues: true, // 그래프 바에 value 표시 유무
                showLegend : false, // 범례 표시 유무
                valueFormat: function(d){
                    return d3.format(',.4f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: '날짜', // x축 title
                    staggerLabels: true, // x축 데이터 표시 방법(데이터간의 높이 위치 변경)
                    rotateLabels : 30 // x축 텍스트 회전
                },
                yAxis: {
                    axisLabel: '수치', // y축 타이틀
                    axisLabelDistance: -10
                }
            },
            title: { // 타이틀 영역
                enable: true,
                text: '컬럼차트'
            },
            subtitle: { // 서브타이틀 역역
                enable: true,
                text: '타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };
        $scope.pieOptions = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true, //그래프 내에 표시될 텍스트 노출 유무
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true, // 그래프 내 텍스트 회전 옵션
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            },
            title: {
                enable: true,
                text: '파이차트'
            },
            subtitle: {
                enable: true,
                text: '타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

        $scope.lineOptions = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true, // 그래프에 마우스 오버 시 표시될 가이드라인 노출 유무
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)'
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: '라인차트'
            },
            subtitle: {
                enable: true,
                text: '타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<h4>설명 영역 설명 영역<h4/>  <h5>설명 영역 설명 영역 설명 영역 설명 영역 설명 영역<h5/><sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

        $scope.barOptions = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: 450,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
                showControls: true, // 그래프의 표현 타입 (grouped, stacked)
                showValues: true,
                duration: 500,
                xAxis: {
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Values',
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    }
                }
            },
            title: {
                enable: true,
                text: '바차트'
            },
            subtitle: {
                enable: true,
                text: '타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳 타이틀 설명하는곳',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

        /////////////// data

        $scope.columnData = [
            {
                key: "Cumulative Return", //
                values: [
                    { "label" : "2015/11/12" , "value" : -29.765957771107 },
                    { "label" : "2015/11/13" , "value" : 0 },
                    { "label" : "2015/11/14" , "value" : 32.807804682612 },
                    { "label" : "2015/11/15" , "value" : 196.45946739256 },
                    { "label" : "2015/11/16" , "value" : 0.19434030906893 },
                    { "label" : "2015/11/17" , "value" : -98.079782601442 },
                    { "label" : "2015/11/18" , "value" : -13.925743130903 },
                    { "label" : "2015/11/19" , "value" : -5.1387322875705 },
                    { "label" : "2015/11/20" , "value" : -11.1387322875705 },
                    { "label" : "2015/11/21" , "value" :11.1387322875705 },
                    { "label" : "2015/11/22" , "value" : 14.1387322875705 },
                    { "label" : "2015/11/23" , "value" : -15.1387322875705 },
                    { "label" : "2015/11/24" , "value" : -5.1387322875705 }
                ]
            }
        ];

        $scope.pieData = [
            {
                key: "One",
                y: 5
            },
            {
                key: "Two",
                y: 2
            },
            {
                key: "Three",
                y: 9
            },
            {
                key: "Four",
                y: 7
            },
            {
                key: "Five",
                y: 4
            },
            {
                key: "Six",
                y: 3
            },
            {
                key: "Seven",
                y: .5
            }
        ];

        $scope.lineData = sinAndCos();

        /*Random Data Generator */
        function sinAndCos() {
            var sin = [],sin2 = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
                cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
            }

            //Line chart data should be sent as an array of series objects.
            return [
                {
                    values: sin,      //values - represents the array of {x,y} data points
                    key: 'Sine Wave', //key  - the name of the series.
                    color: '#ff7f0e'  //color - optional: choose your own line color.
                },
                {
                    values: cos,
                    key: 'Cosine Wave',
                    color: '#2ca02c'
                },
                {
                    values: sin2,
                    key: 'Another sine wave',
                    color: '#7777ff',
                    area: true      //area - true 세팅 시 0을 중심으로 y축으로 색을 채워준다.
                }
            ];
        }

        $scope.barData = [
            {
                "key": "Series1",
                "color": "#d62728",
                "values": [
                    {
                        "label" : "Group A" ,
                        "value" : -1.8746444827653
                    } ,
                    {
                        "label" : "Group B" ,
                        "value" : -8.0961543492239
                    } ,
                    {
                        "label" : "Group C" ,
                        "value" : -0.57072943117674
                    } ,
                    {
                        "label" : "Group D" ,
                        "value" : -2.4174010336624
                    } ,
                    {
                        "label" : "Group E" ,
                        "value" : -0.72009071426284
                    } ,
                    {
                        "label" : "Group F" ,
                        "value" : -0.77154485523777
                    } ,
                    {
                        "label" : "Group G" ,
                        "value" : -0.90152097798131
                    } ,
                    {
                        "label" : "Group H" ,
                        "value" : -0.91445417330854
                    } ,
                    {
                        "label" : "Group I" ,
                        "value" : -0.055746319141851
                    }
                ]
            },
            {
                "key": "Series2",
                "color": "#1f77b4",
                "values": [
                    {
                        "label" : "Group A" ,
                        "value" : 25.307646510375
                    } ,
                    {
                        "label" : "Group B" ,
                        "value" : 16.756779544553
                    } ,
                    {
                        "label" : "Group C" ,
                        "value" : 18.451534877007
                    } ,
                    {
                        "label" : "Group D" ,
                        "value" : 8.6142352811805
                    } ,
                    {
                        "label" : "Group E" ,
                        "value" : 7.8082472075876
                    } ,
                    {
                        "label" : "Group F" ,
                        "value" : 5.259101026956
                    } ,
                    {
                        "label" : "Group G" ,
                        "value" : 0.30947953487127
                    } ,
                    {
                        "label" : "Group H" ,
                        "value" : 0
                    } ,
                    {
                        "label" : "Group I" ,
                        "value" : 0
                    }
                ]
            }
        ];


        /*----------------------------------------------------------------- chart data end ---------------------------------------------------------------------*/
        /*----------------------------------------------------------------- kanban data start ---------------------------------------------------------------------*/
        $scope.kanbanList = [
            {
                label: "상태1",
                allowedStatus: ['status1'],
                tasks: [
                    {name: "태스크1", assignee: "담당자2", status: "status1"},
                    {name: "태스크2", assignee: "담당자1", status: "status1"},
                    {name: "태스크3", assignee: "담당자3", status: "status1"}
                ]
            },
            {
                label: "상태2",
                allowedStatus: ['status1', 'status3'],
                tasks: [
                    {name: "태스크4", assignee: "담당자3", status: "status2"},
                    {name: "태스크5", assignee: "담당자3", status: "status2"},
                    {name: "태스크6", assignee: "담당자1", status: "status2"}
                ]
            },
            {
                label: "상태3",
                allowedStatus: ['status2', 'status3'],
                tasks: [
                    {name: "태스크7", assignee: "담당자1", status: "status3"},
                    {name: "태스크8", assignee: "담당자2", status: "status3"},
                    {name: "태스크9", assignee: "담당자2", status: "status3"},
                    {name: "태스크10", assignee: "담당자1", status: "status3"},
                    {name: "태스크11", assignee: "담당자3", status: "status3"}
                ]
            }
        ];

        $scope.kanbanScope;

        $scope.addKanbanTask = function() {
            $scope.kanbanScope.addKanbanCards(1, {name:"태스크 임시 외부", assignee: "담당자3", status:"status2"});
        };
    }
})();
