/*******************************************************************************

  bootstrap.js

*******************************************************************************/

/**
 * Load the config, then the main app file, and away we go
 */
require(['config/config'], function(config) 
{
  if (config.requirejs) require.config(config.requirejs);

  require(['order!piewpiew', 'order!piewpiew.config', 'order!app/main'], function(piewpiew, configuration, main) 
  {
    main(new configuration.Config(config));
  });  
});