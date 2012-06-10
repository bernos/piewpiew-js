define(['piewpiew.views', 'text!app/templates/ContactView.html'], function(views, template) {
  return views.View.extend({
    template: template,

    events: {
      'click .delete': 'onDeleteClicked'
    },

    onDeleteClicked: function() {
      this.trigger("delete", this);
      return false;
    }
  });
})