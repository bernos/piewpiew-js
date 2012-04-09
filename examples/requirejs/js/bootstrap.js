/*******************************************************************************

  bootstrap.js

  Gets our app up and running. Generally you won't need to edit this file, 
  except if you need to make changes to the configuration of the require.js
  AMD library.

*******************************************************************************/

/**
 * Let require.js know where our libraries live
 */
require.config({
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
});

/**
 * Load the main application module and kick things off
 */
require(['config/config', 'app/main'], function(config, main) {
  main(config);
});