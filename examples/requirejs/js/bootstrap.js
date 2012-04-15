/*******************************************************************************

  bootstrap.js

*******************************************************************************/

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

  if (requireConfig == null) {
    console.info('Did not find requirejs config in config file');
    requireConfig = {
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
    };
  }

  require.config(requireConfig);

  require(['piewpiew'], function(piewpiew) 
  {
    require(['piewpiew.config', 'app/main'], function(configuration, main) 
    {
      main(new configuration.Config(config));
    });  
  });  
});