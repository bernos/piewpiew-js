/*******************************************************************************

  bootstrap.js

*******************************************************************************/

/**
 * Load the config, then the main app file, and away we go
 */
require(['config/config'], function(config) 
{
  if (config.requirejs) require.config(config.requirejs);

  require(['piewpiew'], function(piewpiew) 
  {
    require(['piewpiew.config', 'app/main'], function(configuration, main) 
    {
      main(new configuration.Config(config));
    });  
  });  
});