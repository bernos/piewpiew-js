
define([
  'piewpiew.controllers',
  'piewpiew.views', 
  'app/views/ApplicationView', 
  'app/views/ContactsCollectionView',
  'app/views/ContactView',
  'app/models/ContactsCollection',
  'piewpiew.forms',
  'piewpiew.forms.fields',
  'piewpiew.models',
  'piewpiew.models.fields',
  'piewpiew.views.helpers'
], 

function(controllers, views, ApplicationView, ContactsCollectionView, ContactView, ContactsCollection, forms, fields, models, modelFields, helpers) {
  var ApplicationController = controllers.Controller.extend({

    initialize: function() {
      this.initializeModel();
    },



    initializeModel: function() {

      var PersonModel = models.Model.extend({
        fields: {
          firstName: new modelFields.StringField(),
          lastName: new modelFields.StringField()
        }
      });

      var PersonForm = forms.Form.extend({
        fields: {
          firstName: new fields.TextField({
            label: "First name",
            required: true
          }),
          lastName: new fields.TextField({
            label: "Last name"
          })
        }
      });

      var form = new PersonForm({
        firstName: "Brendan",
        lastName: "McMahon"
      });

      this.formView = new views.FormView({
        model: form
      });

      console.log("adfafsd", form);

      var contacts = [
        { name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" }
      ];

      this.contactsCollection = new ContactsCollection(contacts);

      this.view = new ApplicationView({
        el: 'body',
        contacts: this.contactsCollection
      });

      this.view.bind("add", this.addContact, this);
    },

    addContact: function() {
      this.contactsCollection.add({ name: "Contact 9", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" });
    },

    start: function() {
      this.view.render();      
      $('body').append(this.formView.render().el);
    }
  });

  return ApplicationController;
});