(function(window, undefined) {'use strict';
/* *
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */



angular.module('adf.widget.linklist', ['adf.provider'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('linklist', {
        title: '',
        subject: 'Links',
        description: 'widget.linkDescription',
        templateUrl: '{widgetsPath}/linklist/src/view.html',
        edit: {
          templateUrl: '{widgetsPath}/linklist/src/edit.html',
          controller: 'linklistEditCtrl'
        }
      });
  }]).controller('linklistEditCtrl', ["$scope", function($scope){

    function getLinks(){
      if (!$scope.config.links){
        $scope.config.links = [];
      }
      return $scope.config.links;
    }

    $scope.addLink = function(){
      getLinks().push({});
    };

    $scope.removeLink = function(index){
      getLinks().splice(index, 1);
    };
  }]);

angular.module("adf.widget.linklist").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/linklist/src/edit.html","<form class=form-inline role=form><div><label translate='widget.linkName'>Links</label></div><div class=padding-bottom ng-repeat=\"link in config.links\"><div class=form-group><label class=sr-only for=title-{{$index}}>Title</label> <input type=text id=title-{{$index}} class=form-control placeholder='{{\"entity.action.title\" | translate}}' ng-model=link.title required></div><div class=form-group><label class=sr-only for=href-{{$index}}>URL</label> <input type=url id=href-{{$index}} class=form-control placeholder=http://example.com ng-model=link.href required></div><button type=button owl-btn-delete ng-click=removeLink($index)></button></div><button type=button owl-btn-add ng-click=addLink()></button></form>");
$templateCache.put("{widgetsPath}/linklist/src/view.html","<div class=linklist><ul><li ng-repeat=\"link in config.links | orderBy:\'title\'\"><a target=_blank ng-href={{link.href}}>{{link.title}}</a></li></ul></div>");}]);})(window);
