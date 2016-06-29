/**
 * Created by Jeong on 2016-03-21.
 */
"use strict";

angular.module('wmsApp')
    .filter("textLineLimit", function () {
        return function (data, count) {
            var result = "";
            if (data.length > 50) {
                result = data.substring(0, 50);
                result += "...";
            }
            else {
                result = data;
            }

            return result;
        }
    });
