/*******************************************************************************

  main.js

*******************************************************************************/
define([
  'app/controllers/ApplicationController'
], 

function(ApplicationController) 
{
  /**
   * This is the application entry point. The bootstrap will
   * call this function and pass in the config.
   */
  return function(config) 
  {
    var applicationController = new ApplicationController(config);
    applicationController.start();
  }
});