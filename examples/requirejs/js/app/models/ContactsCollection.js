define(['backbone', 'app/models/ContactModel'], function(Backbone, ContactModel) {
  return Backbone.Collection.extend({
    model : ContactModel
  });
})