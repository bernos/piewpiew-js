define(function() {
	return {
		version: "0.0.1",

        environment: "development",        

        development: {

        },

        test: {

        },

        production: {
          requirejs: {
            paths: {
              // Common libraries
              'amd-loader': 'libs/amd-loader', // Wrapper for loading non-amd libs
              'jquery'    : 'libs/jquery/jquery-1.7.1.min',
              'underscore': 'libs/underscore/underscore',
              'backbone'  : 'libs/backbone/backbone',
              'piewpiew'  : 'libs/piewpiew/piewpiew-0.0.1.min',

              // Require JS plugins
              'text'      : 'libs/requirejs/text',
              'order'     : 'libs/requirejs/order',
              'i18n'      : 'libs/requirejs/i18n',
              'domReady'  : 'libs/requirejs/domReady'
            }
          }
        }
	}
});