(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('DateUtils', DateUtils);

    DateUtils.$inject = ['$filter', '$log'];

    function DateUtils ($filter, $log) {

        var service = {
            convertDateTimeFromServer : convertDateTimeFromServer,
            convertLocalDateFromServer : convertLocalDateFromServer,
            convertLocalDateToServer : convertLocalDateToServer,
            dateformat : dateformat,
            toDate : toDate,
            datePickerFormat : datePickerFormat,
            getTomorrow : getTomorrow,
            getAfterWeek : getAfterWeek,
            getMonthDays : getMonthDays
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
            if(date != '' && date != undefined){
                var yyyyMMdd = String(date);
                var sYear = yyyyMMdd.substring(0,4);
                var sMonth = yyyyMMdd.substring(5,7);
                var sDate = yyyyMMdd.substring(8,10);
                var sHours = yyyyMMdd.substring(11,13);
                var sMinutes = yyyyMMdd.substring(14,16);
                return new Date(Number(sYear), Number(sMonth)-1, Number(sDate), Number(sHours), Number(sMinutes));
            }
            return '';
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

        function getTomorrow(){
            var tomorrow = new Date(Date.parse(new Date) + 1 * 1000 * 60 * 60 * 24).format("yyyy-MM-dd");
            var dates = {
                startDate : new Date().format("yyyy-MM-dd"),
                endDate : tomorrow
            }
            return dates;
        }

        function getAfterWeek(){
            var weekDay = new Date(new Date(Date.parse(new Date) + 7 * 1000 * 60 * 60 * 24).format("yyyy-MM-dd")).getDay();

            if(weekDay == 0) weekDay = 7;
            var dates = {
                startDate : new Date(Date.parse(new Date) + (7 - weekDay + 1) * 1000 * 60 * 60 * 24).format("yyyy-MM-dd"),
                endDate : new Date(Date.parse(new Date) + (7 - weekDay + 7) * 1000 * 60 * 60 * 24).format("yyyy-MM-dd")
            }
            return dates;
        }

        function getMonthDays(){
            var tomorrow = new Date(Date.parse(new Date) + 30 * 1000 * 60 * 60 * 24).format("yyyy-MM-dd");
            var dates = {
                startDate : new Date().format("yyyy-MM-dd"),
                endDate : tomorrow
            }
            return dates;
        }

    }


    Date.prototype.format = function(f) {
        if (!this.valueOf()) return " ";

        var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
        var d = this;

        return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
            switch ($1) {
                case "yyyy": return d.getFullYear();
                case "yy": return (d.getFullYear() % 1000).zf(2);
                case "MM": return (d.getMonth() + 1).zf(2);
                case "dd": return d.getDate().zf(2);
                case "E": return weekName[d.getDay()];
                case "HH": return d.getHours().zf(2);
                case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
                case "mm": return d.getMinutes().zf(2);
                case "ss": return d.getSeconds().zf(2);
                case "a/p": return d.getHours() < 12 ? "오전" : "오후";
                default: return $1;
            }
        });
    };

    String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
    String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
    Number.prototype.zf = function(len){return this.toString().zf(len);};
})();

