
define(['piewpiew.controllers', 'app/views/ApplicationView'], function(controllers, ApplicationView) {
  var ApplicationController = controllers.Controller.extend({

    initialize: function() {
      this.applicationView = new ApplicationView({
        el: 'body'
      });

      this.applicationView.bind('helloClicked', this.handleHelloClicked, this);
    },

    handleHelloClicked: function(view) {
      console.log('handling helloClicked', this, view);
    },

    start: function() {
      this.applicationView.render();
    }
  });

  return ApplicationController;
});