define('piewpiew.controllers', ['piewpiew.core'], function(piewpiew) {
  
  var controllers = {};

  controllers.Controller = piewpiew.Class({
    initialize: function(options) {
      options || (options = {});
      
      if (options.view) {
        this.setView(options.view);
      }

      if (options.model) {
        this.setModel(options.model);
      }
    },

    getView: function() {
      return this._view;
    },

    setView: function(view) {
      if (this.getView()) {
        this.unbindView(this.getView());
      }

      this._view = view;

      if (view) {
        this.bindView(view);
      }
      
      return this;
    },

    bindView: function(view) { },

    unbindView: function(view) { },

    getModel: function() {
      return this._model;
    },

    setModel: function(model) {
      if (this.getModel()) {
        this.unbindModel(this.getModel());
      }      

      this._model = model;

      if (model) {
        this.bindModel(model);
      }
      
      return this;
    },

    bindModel: function(model) {},
    unbindModel: function(model) {}
  });

  piewpiew.controllers = controllers;

  return controllers;
});