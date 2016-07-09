/*
 * Copyright (c) 2016. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

'use strict';

angular.module('wmsApp')
    .service('btnService', btnService)
    .directive('owlBtnFind', owlBtnFind)
    .directive('owlBtnInit', owlBtnInit)
    .directive('owlBtnNext', owlBtnNext)
    .directive('owlBtnBefore', owlBtnBefore)
    .directive('owlBtnDownload', owlBtnDownload)
    .directive('owlBtnRemove', owlBtnRemove)
    .directive('owlBtnAdd', owlBtnAdd)
    .directive('owlBtnDelete', owlBtnDelete)
    .directive('owlBtnStateChange', owlBtnStateChange)
    .directive('owlBtnList', owlBtnList)
    .directive('owlBtnDetail', owlBtnDetail)
    .directive('owlBtnSave', owlBtnSave)
    .directive('owlBtnCheck', owlBtnCheck)
    .directive('owlBtnSelect', owlBtnSelect)
    .directive('owlBtnPositionSave', owlBtnPositionSave)
    .directive('owlBtnUpdate', owlBtnUpdate)
    .directive('owlBtnDecision', owlBtnDecision)
    .directive('owlBtnCancel', owlBtnCancel)
    .directive('owlBtnEtcFunc', owlBtnEtcFunc)
    .directive('owlBtnLink', owlBtnLink)
    .directive('owlBtnSearch', owlBtnSearch)
    .directive('owlBtnBack', owlBtnBack);

    btnService.$inject = [];
    function btnService() {
        this.makeElement = makeElement;
        function makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n, reverse) {
            var btnSize = tAttrs['btnSize'];
            var btnType = tAttrs['btnType'];
            var btnI18n = tAttrs['btnI18n'];

            if (btnI18n != undefined) {
                i18n = btnI18n;
            }

            tElement.attr("name", btnName);
            if (btnSize != 'undefined') {
                btnIcon += " " + btnSize;
            }
            if (btnType != undefined && btnType == "tooltip") {
                tElement.css("border-width", "0px")
                    .css("background-color", "transparent")
                    .append("<i class='" + btnIcon + "' tooltip='{{\"" + i18n + "\" | translate}}'></i>");
            } else {
                if (reverse != undefined && reverse) {
                    tElement.addClass('cursor ' + btnClass)
                        .append("<span translate='" + i18n + "'></span>&nbsp;")
                        .append("<i class='" + btnIcon + "'></i>");
                } else {
                    tElement.addClass('cursor ' + btnClass)
                        .prepend("<span translate='" + i18n + "'></span>")
                        .prepend("<i class='" + btnIcon + "'></i>&nbsp;");
                }
            }
        }

        this.makeLink = makeLink;
        function makeLink(tElement, linkName, btnIcon, i18n) {
            tElement.attr("name", linkName);
            tElement.append("<i class='cursor " + btnIcon + "' uib-tooltip='{{\"" + i18n + "\" | translate}}'></i>");
        }
    }

    owlBtnFind.$inject=['btnService'];
    function owlBtnFind(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "find";
                var btnClass = "btn btn-default btn-sm btn-radius";
                var btnIcon = "fa fa-search txt_col02";
                var i18n = "entity.action.search";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnInit.$inject=['btnService'];
    function owlBtnInit(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "init";
                var btnClass = "btn btn-default btn-sm btn-radius";
                var btnIcon = "fa fa-refresh txt_col02";
                var i18n = "entity.action.init";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnNext.$inject=['btnService'];
    function owlBtnNext(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "next";
                var btnClass = "btn btn-sm btn-primary btn-radius";
                var btnIcon = "fa fa-caret-right";
                var i18n = "entity.action.next";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n, true);
            }
        };
    }
owlBtnBefore.$inject=['btnService'];
    function owlBtnBefore(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "before";
                var btnClass = "btn btn-default btn-sm btn-radius";
                var btnIcon = "fa fa-caret-left";
                var i18n = "entity.action.before";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnDownload.$inject=['btnService'];
    function owlBtnDownload(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "download";
                var btnClass = "btn btn-success btn-sm btn-radius";
                var btnIcon = "fa fa-download";
                var i18n = "entity.action.excel";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnRemove.$inject=['btnService'];
    function owlBtnRemove(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "remove";
                var btnClass = "btn btn-sm btn-danger btn-radius";
                var btnIcon = "fa fa-trash";
                var i18n = "entity.action.remove";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnAdd.$inject=['btnService'];
    function owlBtnAdd(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "add";
                var btnClass = "btn btn-primary btn-sm btn-radius";
                var btnIcon = "fa fa-plus";
                var i18n = "entity.action.add";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnDelete.$inject=['btnService'];
    function owlBtnDelete(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "delete";
                var btnClass = "btn btn-danger btn-sm btn-radius";
                var btnIcon = "fa fa-minus";
                var i18n = "entity.action.delete";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnStateChange.$inject=['btnService'];
    function owlBtnStateChange(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "stateChange";
                var btnClass = "btn btn-success btn-sm btn-radius";
                var btnIcon = "fa fa-check-square-o";
                var i18n = "entity.action.stateChange";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnList.$inject=['btnService'];
    function owlBtnList(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "list";
                var btnClass = "btn btn-primary btn-sm btn-radius";
                var btnIcon = "fa fa-list";
                var i18n = "entity.action.list";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnDetail.$inject=['btnService'];
    function owlBtnDetail(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "detail";
                var btnClass = "btn btn-primary btn-sm btn-radius";
                var btnIcon = "fa fa-th";
                var i18n = "entity.action.detail";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnSave.$inject=['btnService'];
    function owlBtnSave(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "save";
                var btnClass = "btn btn-success btn-sm btn-radius";
                var btnIcon = "fa fa-floppy-o";
                var i18n = "entity.action.save";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnCheck.$inject=['btnService'];
    function owlBtnCheck(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "check";
                var btnClass = "btn btn-primary btn-sm btn-radius";
                var btnIcon = "fa fa-check";
                var i18n = "entity.action.check";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnSelect.$inject=['btnService'];
    function owlBtnSelect(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "select";
                var btnClass = "btn btn-success btn-sm btn-radius";
                var btnIcon = "fa fa-check";
                var i18n = "entity.action.select";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnPositionSave.$inject=['btnService'];
    function owlBtnPositionSave(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "positionSave";
                var btnClass = "btn btn-primary btn-sm btn-radius";
                var btnIcon = "fa fa-flag";
                var i18n = "entity.action.positionSave";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnUpdate.$inject=['btnService'];
    function owlBtnUpdate(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "update";
                var btnClass = "btn btn-primary btn-sm btn-radius";
                var btnIcon = "fa fa-pencil-square-o";
                var i18n = "entity.action.edit";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }
owlBtnDecision.$inject=['btnService'];
    function owlBtnDecision(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "decision";
                var btnClass = "btn btn-primary btn-sm btn-radius";
                var btnIcon = "fa fa-credit-card";
                var i18n = "entity.action.decisionTitle";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }

owlBtnCancel.$inject=['btnService'];
    function owlBtnCancel(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "cancel";
                var btnClass = "btn btn-warning btn-sm btn-radius";
                var btnIcon = "fa fa-times";
                var i18n = "entity.action.cancel";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }

owlBtnEtcFunc.$inject=['btnService'];
     function owlBtnEtcFunc(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "etcFunc";
                var btnClass = "btn btn-info dropdown-toggle btn-sm btn-radius";
                var btnIcon = "fa fa-bolt";
                var i18n = "entity.action.functionAdd";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }

owlBtnSearch.$inject=['btnService'];
     function owlBtnSearch(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "etcFunc";
                var btnClass = "btn dropdown-toggle btn-sm btn-primary btn-radius";
                var btnIcon = "fa fa-search";
                var i18n = "entity.action.search";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }

owlBtnBack.$inject=['btnService'];
     function owlBtnBack(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var btnName = "etcFunc";
                var btnClass = "btn btn-default dropdown-toggle btn-sm btn-radius";
                var btnIcon = "glyphicon glyphicon-arrow-left";
                var i18n = "entity.action.back";

                btnService.makeElement(tElement, tAttrs, btnName, btnClass, btnIcon, i18n);
            }
        };
    }

        owlBtnLink.$inject=['btnService'];
    function owlBtnLink(btnService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                var linkName;
                var linkIcon;
                var i18n;

                var linkType = tAttrs['linkType'];

                if (linkType == "edit") {
                    linkName = "edit";
                    linkIcon = "fa fa-pencil-square-o fa-lg fontawesom";
                    i18n = "entity.action.edit";
                } else if (linkType == "config") {
                    linkName = "config";
                    linkIcon = "fa fa-cogs fa-lg fontawesom";
                    i18n = "entity.action.config";
                } else if (linkType == "rolePermission") {
                    linkName = "rolePermission";
                    linkIcon = "fa fa-lock fa-lg fontawesom";
                    i18n = "entity.action.permissionList";
                } else if (linkType == "roleUser") {
                    linkName = "roleUser";
                    linkIcon = "fa fa-user fa-lg fontawesom";
                    i18n = "entity.action.userLink";
                } else if (linkType == "history") {
                    linkName = "history";
                    linkIcon = "fa fa-history fa-lg fontawesom";
                    i18n = "entity.action.history";
                } else if (linkType == "fieldLink") {
                    linkName = "fieldLink";
                    linkIcon = "fa fa-link fa-lg fontawesom";
                    i18n = "entity.action.fieldLink";
                } else if (linkType == "version") {
                    linkName = "version";
                    linkIcon = "fa fa-code-fork fa-lg fontawesom";
                    i18n = "entity.action.changeVersion";
                } else if (linkType == "detail") {
                    linkName = "detail";
                    linkIcon = "fa fa-th fa-lg fontawesom";
                    i18n = "entity.action.detail";
                } else if (linkType == "compare") {
                    linkName = "compare";
                    linkIcon = "fa fa-compress fa-lg fontawesom";
                    i18n = "entity.action.compare";
                } else if (linkType == "revert") {
                    linkName = "revert";
                    linkIcon = "fa fa-mail-reply fa-lg fontawesom";
                    i18n = "entity.action.revert";
                }

                btnService.makeLink(tElement, linkName, linkIcon, i18n);
            }
        };
    }
;
