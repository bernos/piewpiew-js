define(['piewpiew.controllers'], function(controllers) {
  return controllers.Controller.extend({
    bindView: function(view) {
      view.bind("add", this.addClicked, this);
      view.bind("delete", this.deleteClicked, this);
    },

    addClicked: function(contactListView) {
      contactListView.collection.add({ 
        name: "Contact number 9", 
        address: "1, a street, a town, a city, AB12 3CD", 
        tel: "0123456789", 
        email: "anemail@me.com", 
        type: "family" 
      });
    },

    deleteClicked: function(contactView) {
      contactView.model.collection.remove(contactView.model);
    }
  });
});