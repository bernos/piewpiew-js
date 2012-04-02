/**
 * Let require.js know where our libraries live
 */
require.config({
  paths: {
    // Common libraries
    'amd-loader': 'libs/amd-loader',
    'jquery'    : 'libs/jquery/jquery-1.7.1.min',
    'underscore': 'libs/underscore/underscore',
    'backbone'  : 'libs/backbone/backbone',

    // Require JS plugins
    'text'      : 'libs/requirejs/text',
    'order'     : 'libs/requirejs/order',
    'i18n'      : 'libs/requirejs/i18n',
    'domReady'  : 'libs/requirejs/domReady'
  }
});

/**
 * Load the main application module and kick things off
 */
require(['config', 'main'], function(config, main) {
  main(config);
});