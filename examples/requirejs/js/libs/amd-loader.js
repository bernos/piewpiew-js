/**
 * amd-loader.js
 *
 * This is a wrapper to help with loading scripts that are not
 * AMD compatible, such as underscore and backbone.
 *
 * This wrapper module is used as a dependency by the backbone.js and
 * underscore.js wrapper modules.
 */
define(['order!libs/underscore/underscore-1.3.1.min', 'order!libs/backbone/backbone-0.9.2.min'], function() {
	return {
		underscore : _.noConflict(),
		backbone : Backbone.noConflict()
	};
});