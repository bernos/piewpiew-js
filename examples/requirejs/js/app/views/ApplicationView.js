define(['text!app/templates/ApplicationView.html', 'piewpiew.views'], function(template, views) {

  var ApplicationView = piewpiew.views.View.extend({
    template: template,

    initialize: function() {
      this.model.bind("change:value", this.render, this);
    },

    events: {
      'click .increment' : 'onIncrementClick',
      'click .decrement' : 'onDecrementClick'
    },

    onIncrementClick: function() {
      this.trigger('incrementClicked', this);
    },

    onDecrementClick: function() {
      this.trigger('decrementClicked', this);
    }
  });

  return ApplicationView;
});