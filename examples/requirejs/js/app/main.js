/*******************************************************************************

  main.js

*******************************************************************************/
define([
  'app/views/ApplicationView', 
  'app/controllers/ApplicationController'
], 

function(ApplicationView, ApplicationController) 
{
  /**
   * This is the application entry point. The bootstrap will
   * call this function and pass in the config.
   */
  return function(config) 
  {
    /**
     * Create our application view
     */
    var applicationView = new ApplicationView({
      el: 'body'
    });

    /**
     * Create a controller for the view
     */
    var applicationController = new ApplicationController({
      view : applicationView
    });

    applicationView.trigger("example");

    /**
     * Now render the view into the DOM
     */
    applicationView.render();
  }
});