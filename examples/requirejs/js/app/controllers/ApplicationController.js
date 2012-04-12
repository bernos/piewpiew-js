
define(['piewpiew.controllers'], function(controllers) {
  var ApplicationController = controllers.Controller.extend({
    events: {
      'helloClicked' : 'handleHelloClicked'
    },  

    handleHelloClicked: function(view) {
      console.log('handling helloClicked', this, view);
    }
  });

  return ApplicationController;
});