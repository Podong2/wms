(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('DateUtils', DateUtils);

    DateUtils.$inject = ['$filter'];

    function DateUtils ($filter) {

        var service = {
            convertDateTimeFromServer : convertDateTimeFromServer,
            convertLocalDateFromServer : convertLocalDateFromServer,
            convertLocalDateToServer : convertLocalDateToServer,
            dateformat : dateformat,
            toDate : toDate,
            datePickerFormat : datePickerFormat
        };

        return service;

        function convertDateTimeFromServer (date) {
            if (date) {
                return new Date(date);
            } else {
                return null;
            }
        }

        function convertLocalDateFromServer (date) {
            if (date) {
                var dateString = date.split('-');
                return new Date(dateString[0], dateString[1] - 1, dateString[2]);
            }
            return null;
        }

        function convertLocalDateToServer (date) {
            if (date) {
                return $filter('date')(date, 'yyyy-MM-dd');
            } else {
                return null;
            }
        }

        function dateformat () {
            return 'yyyy-MM-dd';
        }

        function toDate(date) {
            var yyyyMMdd = String(date);
            var sYear = yyyyMMdd.substring(0,4);
            var sMonth = yyyyMMdd.substring(5,7);
            var sDate = yyyyMMdd.substring(8,10);
            return new Date(Number(sYear), Number(sMonth)-1, Number(sDate));
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

    }

})();
