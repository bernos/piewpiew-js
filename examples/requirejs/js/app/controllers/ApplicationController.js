
define([
  'piewpiew.controllers',
  'piewpiew.views', 
  'app/views/ApplicationView', 
  'app/views/ContactsCollectionView',
  'app/views/ContactView',
  'app/models/ContactsCollection'
], 

function(controllers, views, ApplicationView, ContactsCollectionView, ContactView, ContactsCollection) {
  var ApplicationController = controllers.Controller.extend({

    initialize: function() {
      this.initializeModel();
    },

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
    }
  });

  return ApplicationController;
});