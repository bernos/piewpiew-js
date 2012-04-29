define(['piewpiew.views', 'text!app/templates/ContactView.html'], function(views, template) {
  return views.View.extend({
    template: template,

    events: {
      'click .delete': 'onDeleteClicked'
    },

    onDeleteClicked: function() {
      console.log("delete clicked", arguments);
      this.model.collection.remove(this.model);
      return false;
    }
  });
})