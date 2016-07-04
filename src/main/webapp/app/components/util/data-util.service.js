(function() {
    'use strict';

    angular
        .module('wmsApp')
        .factory('DataUtils', DataUtils);

    DataUtils.$inject = ['$window'];

    function DataUtils ($window) {

        var service = {
            abbreviate: abbreviate,
            byteSize: byteSize,
            openFile: openFile,
            toBase64: toBase64,
            objectEquals: objectEquals
        };

        return service;

        function abbreviate (text) {
            if (!angular.isString(text)) {
                return '';
            }
            if (text.length < 30) {
                return text;
            }
            return text ? (text.substring(0, 15) + '...' + text.slice(-10)) : '';
        }

        function byteSize (base64String) {
            if (!angular.isString(base64String)) {
                return '';
            }

            function endsWith(suffix, str) {
                return str.indexOf(suffix, str.length - suffix.length) !== -1;
            }

            function paddingSize(base64String) {
                if (endsWith('==', base64String)) {
                    return 2;
                }
                if (endsWith('=', base64String)) {
                    return 1;
                }
                return 0;
            }

            function size(base64String) {
                return base64String.length / 4 * 3 - paddingSize(base64String);
            }

            function formatAsBytes(size) {
                return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' bytes';
            }

            return formatAsBytes(size(base64String));
        }

        function openFile (type, data) {
            $window.open('data:' + type + ';base64,' + data, '_blank', 'height=300,width=400');
        }

        function toBase64 (file, cb) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function (e) {
                var base64Data = e.target.result.substr(e.target.result.indexOf('base64,') + 'base64,'.length);
                cb(base64Data);
            };
        }

        function objectEquals(x, y) {
                if (x === y) return true;
                // if both x and y are null or undefined and exactly the same

                if (!(x instanceof Object) || !(y instanceof Object)) return false;
                // if they are not strictly equal, they both need to be Objects

                if (x.constructor !== y.constructor) return false;
                // they must have the exact same prototype chain, the closest we can do is
                // test there constructor.

                for (var p in x) {
                    if (!x.hasOwnProperty(p)) continue;
                    // other properties were tested using x.constructor === y.constructor

                    if (!y.hasOwnProperty(p)) return false;
                    // allows to compare x[ p ] and y[ p ] when set to undefined

                    if (x[p] === y[p]) continue;
                    // if they have the same strict value or identity then they are equal

                    if (typeof(x[p]) !== "object") return false;
                    // Numbers, Strings, Functions, Booleans must be strictly equal

                    if (!Object.equals(x[p], y[p])) return false;
                    // Objects and Arrays must be tested recursively
                }

                for (p in y) {
                    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
                    // allows x[ p ] to be set to undefined
                }

                return true;
        }
    }
})();
