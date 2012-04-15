define(['text!app/templates/ApplicationView.html', 'piewpiew.views'], function(template, views) {

  var ApplicationView = piewpiew.views.View.extend({
    template: template,

    events: {
      'click .hello' : 'onHelloClick'
    },

    onHelloClick: function() {
      this.trigger('helloClicked', this);
    }
  });

  return ApplicationView;
});