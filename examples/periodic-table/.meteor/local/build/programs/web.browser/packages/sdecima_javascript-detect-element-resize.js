//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/sdecima:javascript-detect-element-resize/detect-element-resize.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
* Detect Element Resize                                                                                               // 2
*                                                                                                                     // 3
* https://github.com/sdecima/javascript-detect-element-resize                                                         // 4
* Sebastian Decima                                                                                                    // 5
*                                                                                                                     // 6
* version: 0.5.3                                                                                                      // 7
**/                                                                                                                   // 8
                                                                                                                      // 9
(function () {                                                                                                        // 10
	var attachEvent = document.attachEvent,                                                                              // 11
		stylesCreated = false;                                                                                              // 12
	                                                                                                                     // 13
	if (!attachEvent) {                                                                                                  // 14
		var requestFrame = (function(){                                                                                     // 15
			var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || // 16
								function(fn){ return window.setTimeout(fn, 20); };                                                            // 17
			return function(fn){ return raf(fn); };                                                                            // 18
		})();                                                                                                               // 19
		                                                                                                                    // 20
		var cancelFrame = (function(){                                                                                      // 21
			var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || // 22
								   window.clearTimeout;                                                                                       // 23
		  return function(id){ return cancel(id); };                                                                        // 24
		})();                                                                                                               // 25
                                                                                                                      // 26
		function resetTriggers(element){                                                                                    // 27
			var triggers = element.__resizeTriggers__,                                                                         // 28
				expand = triggers.firstElementChild,                                                                              // 29
				contract = triggers.lastElementChild,                                                                             // 30
				expandChild = expand.firstElementChild;                                                                           // 31
			contract.scrollLeft = contract.scrollWidth;                                                                        // 32
			contract.scrollTop = contract.scrollHeight;                                                                        // 33
			expandChild.style.width = expand.offsetWidth + 1 + 'px';                                                           // 34
			expandChild.style.height = expand.offsetHeight + 1 + 'px';                                                         // 35
			expand.scrollLeft = expand.scrollWidth;                                                                            // 36
			expand.scrollTop = expand.scrollHeight;                                                                            // 37
		};                                                                                                                  // 38
                                                                                                                      // 39
		function checkTriggers(element){                                                                                    // 40
			return element.offsetWidth != element.__resizeLast__.width ||                                                      // 41
						 element.offsetHeight != element.__resizeLast__.height;                                                         // 42
		}                                                                                                                   // 43
		                                                                                                                    // 44
		function scrollListener(e){                                                                                         // 45
			var element = this;                                                                                                // 46
			resetTriggers(this);                                                                                               // 47
			if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);                                                           // 48
			this.__resizeRAF__ = requestFrame(function(){                                                                      // 49
				if (checkTriggers(element)) {                                                                                     // 50
					element.__resizeLast__.width = element.offsetWidth;                                                              // 51
					element.__resizeLast__.height = element.offsetHeight;                                                            // 52
					element.__resizeListeners__.forEach(function(fn){                                                                // 53
						fn.call(element, e);                                                                                            // 54
					});                                                                                                              // 55
				}                                                                                                                 // 56
			});                                                                                                                // 57
		};                                                                                                                  // 58
		                                                                                                                    // 59
		/* Detect CSS Animations support to detect element display/re-attach */                                             // 60
		var animation = false,                                                                                              // 61
			animationstring = 'animation',                                                                                     // 62
			keyframeprefix = '',                                                                                               // 63
			animationstartevent = 'animationstart',                                                                            // 64
			domPrefixes = 'Webkit Moz O ms'.split(' '),                                                                        // 65
			startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),                   // 66
			pfx  = '';                                                                                                         // 67
		{                                                                                                                   // 68
			var elm = document.createElement('fakeelement');                                                                   // 69
			if( elm.style.animationName !== undefined ) { animation = true; }                                                  // 70
			                                                                                                                   // 71
			if( animation === false ) {                                                                                        // 72
				for( var i = 0; i < domPrefixes.length; i++ ) {                                                                   // 73
					if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {                                              // 74
						pfx = domPrefixes[ i ];                                                                                         // 75
						animationstring = pfx + 'Animation';                                                                            // 76
						keyframeprefix = '-' + pfx.toLowerCase() + '-';                                                                 // 77
						animationstartevent = startEvents[ i ];                                                                         // 78
						animation = true;                                                                                               // 79
						break;                                                                                                          // 80
					}                                                                                                                // 81
				}                                                                                                                 // 82
			}                                                                                                                  // 83
		}                                                                                                                   // 84
		                                                                                                                    // 85
		var animationName = 'resizeanim';                                                                                   // 86
		var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
		var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';                                     // 88
	}                                                                                                                    // 89
	                                                                                                                     // 90
	function createStyles() {                                                                                            // 91
		if (!stylesCreated) {                                                                                               // 92
			//opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360                   // 93
			var css = (animationKeyframes ? animationKeyframes : '') +                                                         // 94
					'.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' +          // 95
					'.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
				head = document.head || document.getElementsByTagName('head')[0],                                                 // 97
				style = document.createElement('style');                                                                          // 98
			                                                                                                                   // 99
			style.type = 'text/css';                                                                                           // 100
			if (style.styleSheet) {                                                                                            // 101
				style.styleSheet.cssText = css;                                                                                   // 102
			} else {                                                                                                           // 103
				style.appendChild(document.createTextNode(css));                                                                  // 104
			}                                                                                                                  // 105
                                                                                                                      // 106
			head.appendChild(style);                                                                                           // 107
			stylesCreated = true;                                                                                              // 108
		}                                                                                                                   // 109
	}                                                                                                                    // 110
	                                                                                                                     // 111
	window.addResizeListener = function(element, fn){                                                                    // 112
		if (attachEvent) element.attachEvent('onresize', fn);                                                               // 113
		else {                                                                                                              // 114
			if (!element.__resizeTriggers__) {                                                                                 // 115
				if (getComputedStyle(element).position == 'static') element.style.position = 'relative';                          // 116
				createStyles();                                                                                                   // 117
				element.__resizeLast__ = {};                                                                                      // 118
				element.__resizeListeners__ = [];                                                                                 // 119
				(element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';                       // 120
				element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +                          // 121
																						'<div class="contract-trigger"></div>';                                                         // 122
				element.appendChild(element.__resizeTriggers__);                                                                  // 123
				resetTriggers(element);                                                                                           // 124
				element.addEventListener('scroll', scrollListener, true);                                                         // 125
				                                                                                                                  // 126
				/* Listen for a css animation to detect element display/re-attach */                                              // 127
				animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function(e) {             // 128
					if(e.animationName == animationName)                                                                             // 129
						resetTriggers(element);                                                                                         // 130
				});                                                                                                               // 131
			}                                                                                                                  // 132
			element.__resizeListeners__.push(fn);                                                                              // 133
		}                                                                                                                   // 134
	};                                                                                                                   // 135
	                                                                                                                     // 136
	window.removeResizeListener = function(element, fn){                                                                 // 137
		if (attachEvent) element.detachEvent('onresize', fn);                                                               // 138
		else {                                                                                                              // 139
			element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);                                    // 140
			if (!element.__resizeListeners__.length) {                                                                         // 141
					element.removeEventListener('scroll', scrollListener);                                                           // 142
					element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);                                   // 143
			}                                                                                                                  // 144
		}                                                                                                                   // 145
	}                                                                                                                    // 146
})();                                                                                                                 // 147
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/sdecima:javascript-detect-element-resize/jquery.resize.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
* Detect Element Resize Plugin for jQuery                                                                             // 2
*                                                                                                                     // 3
* https://github.com/sdecima/javascript-detect-element-resize                                                         // 4
* Sebastian Decima                                                                                                    // 5
*                                                                                                                     // 6
* version: 0.5.3                                                                                                      // 7
**/                                                                                                                   // 8
                                                                                                                      // 9
(function ( $ ) {                                                                                                     // 10
	var attachEvent = document.attachEvent,                                                                              // 11
		stylesCreated = false;                                                                                              // 12
	                                                                                                                     // 13
	var jQuery_resize = $.fn.resize;                                                                                     // 14
	                                                                                                                     // 15
	$.fn.resize = function(callback) {                                                                                   // 16
		return this.each(function() {                                                                                       // 17
			if(this == window)                                                                                                 // 18
				jQuery_resize.call(jQuery(this), callback);                                                                       // 19
			else                                                                                                               // 20
				addResizeListener(this, callback);                                                                                // 21
		});                                                                                                                 // 22
	}                                                                                                                    // 23
                                                                                                                      // 24
	$.fn.removeResize = function(callback) {                                                                             // 25
		return this.each(function() {                                                                                       // 26
			removeResizeListener(this, callback);                                                                              // 27
		});                                                                                                                 // 28
	}                                                                                                                    // 29
	                                                                                                                     // 30
	if (!attachEvent) {                                                                                                  // 31
		var requestFrame = (function(){                                                                                     // 32
			var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || // 33
								function(fn){ return window.setTimeout(fn, 20); };                                                            // 34
			return function(fn){ return raf(fn); };                                                                            // 35
		})();                                                                                                               // 36
		                                                                                                                    // 37
		var cancelFrame = (function(){                                                                                      // 38
			var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || // 39
								   window.clearTimeout;                                                                                       // 40
		  return function(id){ return cancel(id); };                                                                        // 41
		})();                                                                                                               // 42
                                                                                                                      // 43
		function resetTriggers(element){                                                                                    // 44
			var triggers = element.__resizeTriggers__,                                                                         // 45
				expand = triggers.firstElementChild,                                                                              // 46
				contract = triggers.lastElementChild,                                                                             // 47
				expandChild = expand.firstElementChild;                                                                           // 48
			contract.scrollLeft = contract.scrollWidth;                                                                        // 49
			contract.scrollTop = contract.scrollHeight;                                                                        // 50
			expandChild.style.width = expand.offsetWidth + 1 + 'px';                                                           // 51
			expandChild.style.height = expand.offsetHeight + 1 + 'px';                                                         // 52
			expand.scrollLeft = expand.scrollWidth;                                                                            // 53
			expand.scrollTop = expand.scrollHeight;                                                                            // 54
		};                                                                                                                  // 55
                                                                                                                      // 56
		function checkTriggers(element){                                                                                    // 57
			return element.offsetWidth != element.__resizeLast__.width ||                                                      // 58
						 element.offsetHeight != element.__resizeLast__.height;                                                         // 59
		}                                                                                                                   // 60
		                                                                                                                    // 61
		function scrollListener(e){                                                                                         // 62
			var element = this;                                                                                                // 63
			resetTriggers(this);                                                                                               // 64
			if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);                                                           // 65
			this.__resizeRAF__ = requestFrame(function(){                                                                      // 66
				if (checkTriggers(element)) {                                                                                     // 67
					element.__resizeLast__.width = element.offsetWidth;                                                              // 68
					element.__resizeLast__.height = element.offsetHeight;                                                            // 69
					element.__resizeListeners__.forEach(function(fn){                                                                // 70
						fn.call(element, e);                                                                                            // 71
					});                                                                                                              // 72
				}                                                                                                                 // 73
			});                                                                                                                // 74
		};                                                                                                                  // 75
		                                                                                                                    // 76
		/* Detect CSS Animations support to detect element display/re-attach */                                             // 77
		var animation = false,                                                                                              // 78
			animationstring = 'animation',                                                                                     // 79
			keyframeprefix = '',                                                                                               // 80
			animationstartevent = 'animationstart',                                                                            // 81
			domPrefixes = 'Webkit Moz O ms'.split(' '),                                                                        // 82
			startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),                   // 83
			pfx  = '';                                                                                                         // 84
		{                                                                                                                   // 85
			var elm = document.createElement('fakeelement');                                                                   // 86
			if( elm.style.animationName !== undefined ) { animation = true; }                                                  // 87
			                                                                                                                   // 88
			if( animation === false ) {                                                                                        // 89
				for( var i = 0; i < domPrefixes.length; i++ ) {                                                                   // 90
					if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {                                              // 91
						pfx = domPrefixes[ i ];                                                                                         // 92
						animationstring = pfx + 'Animation';                                                                            // 93
						keyframeprefix = '-' + pfx.toLowerCase() + '-';                                                                 // 94
						animationstartevent = startEvents[ i ];                                                                         // 95
						animation = true;                                                                                               // 96
						break;                                                                                                          // 97
					}                                                                                                                // 98
				}                                                                                                                 // 99
			}                                                                                                                  // 100
		}                                                                                                                   // 101
		                                                                                                                    // 102
		var animationName = 'resizeanim';                                                                                   // 103
		var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
		var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';                                     // 105
	}                                                                                                                    // 106
	                                                                                                                     // 107
	function createStyles() {                                                                                            // 108
		if (!stylesCreated) {                                                                                               // 109
			//opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360                   // 110
			var css = (animationKeyframes ? animationKeyframes : '') +                                                         // 111
					'.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' +          // 112
					'.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
				head = document.head || document.getElementsByTagName('head')[0],                                                 // 114
				style = document.createElement('style');                                                                          // 115
			                                                                                                                   // 116
			style.type = 'text/css';                                                                                           // 117
			if (style.styleSheet) {                                                                                            // 118
				style.styleSheet.cssText = css;                                                                                   // 119
			} else {                                                                                                           // 120
				style.appendChild(document.createTextNode(css));                                                                  // 121
			}                                                                                                                  // 122
                                                                                                                      // 123
			head.appendChild(style);                                                                                           // 124
			stylesCreated = true;                                                                                              // 125
		}                                                                                                                   // 126
	}                                                                                                                    // 127
	                                                                                                                     // 128
	window.addResizeListener = function(element, fn){                                                                    // 129
		if (attachEvent) element.attachEvent('onresize', fn);                                                               // 130
		else {                                                                                                              // 131
			if (!element.__resizeTriggers__) {                                                                                 // 132
				if (getComputedStyle(element).position == 'static') element.style.position = 'relative';                          // 133
				createStyles();                                                                                                   // 134
				element.__resizeLast__ = {};                                                                                      // 135
				element.__resizeListeners__ = [];                                                                                 // 136
				(element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';                       // 137
				element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +                          // 138
																						'<div class="contract-trigger"></div>';                                                         // 139
				element.appendChild(element.__resizeTriggers__);                                                                  // 140
				resetTriggers(element);                                                                                           // 141
				element.addEventListener('scroll', scrollListener, true);                                                         // 142
				                                                                                                                  // 143
				/* Listen for a css animation to detect element display/re-attach */                                              // 144
				animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function(e) {             // 145
					if(e.animationName == animationName)                                                                             // 146
						resetTriggers(element);                                                                                         // 147
				});                                                                                                               // 148
			}                                                                                                                  // 149
			element.__resizeListeners__.push(fn);                                                                              // 150
		}                                                                                                                   // 151
	};                                                                                                                   // 152
	                                                                                                                     // 153
	window.removeResizeListener = function(element, fn){                                                                 // 154
		if (attachEvent) element.detachEvent('onresize', fn);                                                               // 155
		else {                                                                                                              // 156
			element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);                                    // 157
			if (!element.__resizeListeners__.length) {                                                                         // 158
					element.removeEventListener('scroll', scrollListener);                                                           // 159
					element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);                                   // 160
			}                                                                                                                  // 161
		}                                                                                                                   // 162
	}                                                                                                                    // 163
}( jQuery ));                                                                                                         // 164
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['sdecima:javascript-detect-element-resize'] = {};

})();
