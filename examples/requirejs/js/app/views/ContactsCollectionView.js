define(['piewpiew.views', 'underscore', 'app/views/ContactView'], function(views, _, ContactView) {
  return views.View.extend({
    render : function() {
      var that = this;

      if (this.collection) {
        _.each(this.collection.models, function(item) {
          that.renderContact(item);
        }, this);
      }
    },

    renderContact: function(contact) {
      var contactView = new ContactView({ model: contact});
      this.$el.append(contactView.render().el);
    }
  });
})