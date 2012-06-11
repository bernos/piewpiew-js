define([
  'piewpiew.views', 
  'app/views/ContactView', 
  'text!app/templates/ContactCollectionView.html'
], 

function(views, ContactView, template) {

  return views.CollectionView.extend({
    template: template,
    view: ContactView,

    events: {
      'click a.add' : 'onAddClicked'
    },

    onAddClicked: function() {
      this.trigger('add', this);
    }
  });
});