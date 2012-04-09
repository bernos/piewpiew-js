define(['text!templates/ApplicationView.html', 'piewpiew.views'], function(template, views) {

  var ApplicationView = piewpiew.views.View.extend({
    template: template,

    events: {
      'click .hello' : 'handleHelloClick'
    },

    handleHelloClick: function() {
      this.trigger('helloClicked', this);
    }
  });

  return ApplicationView;
});