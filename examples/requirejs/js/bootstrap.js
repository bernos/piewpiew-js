/*******************************************************************************

  bootstrap.js

*******************************************************************************/

/**
 * Load the config, then the main app file, and away we go
 */
require(['config/config'], function(config) 
{  
  require(['piewpiew', 'app/app'], function(piewpiew, app) 
  {
    var application = new app(config);
    application.start();
  }); 
});