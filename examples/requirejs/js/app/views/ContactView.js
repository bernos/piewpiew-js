define(['piewpiew.views', 'text!app/templates/ContactView.html'], function(views, template) {
  return views.View.extend({
    template: template,
    events : {
      'click .remove' : 'remove'
    },
    remove : function(e) {
      console.log('remove clicked', arguments);
      this.model.collection.remove(this.model);
      e.stopImmediatePropagation();
    }
  });
})