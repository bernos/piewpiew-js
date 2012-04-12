/*******************************************************************************

  bootstrap.js

*******************************************************************************/

/**
 * Load the config, then the main app file, and away we go
 */
require(['config/config'], function(config) 
{
  if (config.requirejs) require.config(config.requirejs);

  require(['app/main'], function(main) 
  {
    main(config);
  });  
});