define(['piewpiew.controllers'], function(controllers) {
  var ApplicationController = controllers.Controller.extend({
    bindView: function(view) {
      view.bind("add", this.addClick, this);
      view.contactsCollectionView.bind("delete", this.deleteClick, this);
    },

    addClick: function() {
      this.getModel().add({ 
        name: "Contact 9", 
        address: "1, a street, a town, a city, AB12 3CD", 
        tel: "0123456789", 
        email: "anemail@me.com", 
        type: "family" 
      });
    },

    deleteClick: function(contactView) {
      this.getModel().remove(contactView.model);
    }
  });

  return ApplicationController;
});