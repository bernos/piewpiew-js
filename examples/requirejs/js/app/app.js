define([
  'piewpiew.application',
  'piewpiew.controllers',
  'piewpiew.views', 
  'app/views/ApplicationView', 
  'app/views/ContactView',
  'app/models/ContactsCollection',
  'piewpiew.forms',
  'piewpiew.forms.fields',
  'piewpiew.models',
  'piewpiew.models.fields',
  'piewpiew.views.helpers',
  'app/forms/ContactForm',
  'app/controllers/ApplicationController'], 

  function(application, controllers, views, ApplicationView,  ContactView, ContactsCollection, forms, fields, models, modelFields, helpers, ContactForm, ApplicationController) {
  var app = application.Application.extend({
    initializeModel: function() {
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

      return this;
    },

    initializeView: function() {
            
      var form = new ContactForm({
        name: "Brendan McMahon"
      });

      this.formView = new views.FormView({
        model: form
      });

      this.view = new ApplicationView({
        el: 'body',
        contacts: this.contactsCollection
      });

      return this;
    },

    initializeController: function() {
      var applicationController = new ApplicationController({
        view: this.view,
        model: this.contactsCollection
      });
    },

    start: function() {
      this.view.render();      
      $('body').append(this.formView.render().el);
      return this;
    }
  });

  return app;
});