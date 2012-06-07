/*******************************************************************************

  bootstrap.js


  TODO: Change configuration pattern to something more like express.js

  app.configure("staging", "production", function() {
    app.set();
    require.config();
  });

*******************************************************************************/

/**
 * Default config for requirejs. This is just enough configuration to get the
 * bootstrap up and running. Further configuration for requirejs can be added
 * via the config.json application configuration file. You should not change
 * the requirejs config here, unless you have changed the standard folder
 * structure for the application.
 */

 /*
require.config({
  paths: {
    // Common libraries
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
*/
/**
 * Load the config, then the main app file, and away we go
 */
require(['config/config'], function(config) 
{
  /**
   * Locate the requirejs config block for the current environment in the config 
   * file, if one is provided, otherwise we'll provide a sensible default
   */
  var requireConfig = null;
  var env   = config.environment != null ? config.environment : "development";

  // First check currently configured environment
  if (config[env]) {
    requireConfig = config[env]['requirejs'];
  }

  // If we didnt find a value, escalate
  while (null == requireConfig && env != 'production') {
    switch (env) {
      case 'development' :
        env = 'testing';
        break;

      case 'testing' :
        env = 'production';
        break;
    }

    if(null != config[env]) {
      requireConfig = config[env]['requirejs'];
    }        
  }

  if (requireConfig != null) require.config(requireConfig);  

  require(['piewpiew'], function(piewpiew) 
  {
    require(['piewpiew.config', 'app/main'], function(configuration, main) 
    {
      main(new configuration.Config(config));
    });  
  });  
});