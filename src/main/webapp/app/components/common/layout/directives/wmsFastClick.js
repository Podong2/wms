/**
 *
 * Description: Directive utilizes FastClick library.
 *
 *
 * FastClick is a simple, easy-to-use library for eliminating the
 * 300ms delay between a physical tap and the firing of a click event on mobile browsers.
 * FastClick doesn't attach any listeners on desktop browsers.
 * @link: https://github.com/ftlabs/fastclick
 *
 * On mobile devices 'needsclick' class is attached to <tElement>
 *
 */


'use strict';

angular.module('wmsApp')
    .directive('wmsFastClick', wmsFastClick)
    .service('wmsFC', wmsFC);
wmsFastClick.$inject=['wmsFC'];
wmsFC.$inject=[];

function wmsFastClick(wmsFC) {
    return {
        restrict: 'A',
        compile: function (tElement, tAttributes) {
            tElement.removeAttr('wms-Fast-Click data-wms-Fast-Click');

            wmsFC.attach(tElement);

            if(!wmsFC.notNeeded())
                tElement.addClass('needsclick')
        }
    }
}


function wmsFC(){
    return {
        FastClick : function(layer, options){
            var oldOnClick;

            options = options || {};

            /**
             * Whether a click is currently being tracked.
             *
             * @type boolean
             */
            this.trackingClick = false;


            /**
             * Timestamp for when click tracking started.
             *
             * @type number
             */
            this.trackingClickStart = 0;


            /**
             * The element being tracked for a click.
             *
             * @type EventTarget
             */
            this.targetElement = null;


            /**
             * X-coordinate of touch start event.
             *
             * @type number
             */
            this.touchStartX = 0;


            /**
             * Y-coordinate of touch start event.
             *
             * @type number
             */
            this.touchStartY = 0;


            /**
             * ID of the last touch, retrieved from Touch.identifier.
             *
             * @type number
             */
            this.lastTouchIdentifier = 0;


            /**
             * Touchmove boundary, beyond which a click will be cancelled.
             *
             * @type number
             */
            this.touchBoundary = options.touchBoundary || 10;


            /**
             * The FastClick layer.
             *
             * @type Element
             */
            this.layer = layer;

            /**
             * The minimum time between tap(touchstart and touchend) events
             *
             * @type number
             */
            this.tapDelay = options.tapDelay || 200;

            /**
             * The maximum time for a tap
             *
             * @type number
             */
            this.tapTimeout = options.tapTimeout || 700;

            if (this.notNeeded(layer)) {
                return;
            }

            // Some old versions of Android don't have Function.prototype.bind
            function bind(method, context) {
                return function () {
                    return method.apply(context, arguments);
                };
            }


            var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
            var context = this;
            for (var i = 0, l = methods.length; i < l; i++) {
                context[methods[i]] = bind(context[methods[i]], context);
            }

            // Set up event handlers as required
            if (deviceIsAndroid) {
                layer.addEventListener('mouseover', this.onMouse, true);
                layer.addEventListener('mousedown', this.onMouse, true);
                layer.addEventListener('mouseup', this.onMouse, true);
            }

            layer.addEventListener('click', this.onClick, true);
            layer.addEventListener('touchstart', this.onTouchStart, false);
            layer.addEventListener('touchmove', this.onTouchMove, false);
            layer.addEventListener('touchend', this.onTouchEnd, false);
            layer.addEventListener('touchcancel', this.onTouchCancel, false);

            // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
            // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
            // layer when they are cancelled.
            if (!Event.prototype.stopImmediatePropagation) {
                layer.removeEventListener = function (type, callback, capture) {
                    var rmv = Node.prototype.removeEventListener;
                    if (type === 'click') {
                        rmv.call(layer, type, callback.hijacked || callback, capture);
                    } else {
                        rmv.call(layer, type, callback, capture);
                    }
                };

                layer.addEventListener = function (type, callback, capture) {
                    var adv = Node.prototype.addEventListener;
                    if (type === 'click') {
                        adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
                                if (!event.propagationStopped) {
                                    callback(event);
                                }
                            }), capture);
                    } else {
                        adv.call(layer, type, callback, capture);
                    }
                };
            }

            // If a handler is already declared in the element's onclick attribute, it will be fired before
            // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
            // adding it as listener.
            if (typeof layer.onclick === 'function') {

                // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
                // - the old one won't work if passed to addEventListener directly.
                oldOnClick = layer.onclick;
                layer.addEventListener('click', function (event) {
                    oldOnClick(event);
                }, false);
                layer.onclick = null;
            }
        },
        notNeeded : function(layer){
            var metaViewport;
            var chromeVersion;
            var blackberryVersion;
            var firefoxVersion;

            // Devices that don't support touch don't need FastClick
            if (typeof window.ontouchstart === 'undefined') {
                return true;
            }

            // Chrome version - zero for other browsers
            chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

            if (chromeVersion) {

                if (deviceIsAndroid) {
                    metaViewport = document.querySelector('meta[name=viewport]');

                    if (metaViewport) {
                        // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
                        if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                            return true;
                        }
                        // Chrome 32 and above with width=device-width or less don't need FastClick
                        if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                            return true;
                        }
                    }

                    // Chrome desktop doesn't need FastClick (issue #15)
                } else {
                    return true;
                }
            }

            if (deviceIsBlackBerry10) {
                blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

                // BlackBerry 10.3+ does not require Fastclick library.
                // https://github.com/ftlabs/fastclick/issues/251
                if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                    metaViewport = document.querySelector('meta[name=viewport]');

                    if (metaViewport) {
                        // user-scalable=no eliminates click delay.
                        if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                            return true;
                        }
                        // width=device-width (or less than device-width) eliminates click delay.
                        if (document.documentElement.scrollWidth <= window.outerWidth) {
                            return true;
                        }
                    }
                }
            }

            // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
            if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
                return true;
            }

            // Firefox version - zero for other browsers
            firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

            if (firefoxVersion >= 27) {
                // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

                metaViewport = document.querySelector('meta[name=viewport]');
                if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                    return true;
                }
            }

            // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
            // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
            if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
                return true;
            }

            return false;
        },
        attach : function (layer, options) {
        return this.FastClick(layer, options);
        }

    }

}
