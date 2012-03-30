(function(root, factory) {
  // If AMD is available, use the define() method to load our dependencies 
  //and declare our module
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', 'piewpiew'], function(_, Backbone, piewpiew) {
      return factory(root, _, Backbone, piewpiew);
    });
  }
  // Otherwise we will attach our module to root, and pass references to our 
  // dependencies into the factory. We're assuming that our dependencies are 
  // also attached to root here, but they could come from anywhere 
  else 
  {    
    root.piewpiew = factory(root, _, Backbone, piewpiew);
  }
})(this, function(root, _, Backbone, piewpiew) {  
  
  piewpiew.models || (piewpiew.models = {});

  /**
   *  piewpiew.models.Config
   *  ==========================================================================
   *  
   *  Any and all strings for messages, templates and so forth should live here,
   *  and be retrieved by objects in the models module, rather than declared on
   *  objects themselves. Just makes it easier to change stuff as you don't need
   *  to go looking for strings hidden away in source.
   */
  piewpiew.models.Config = {

    messages: {
      
    },

    templates: {
       modelEditor: function() {
        var buf = [];

        buf.push("<% _.each(model.fields, function(field, name) { %>");
        buf.push("<div>");
        buf.push("<%= Html.editorForField(model, field) %>");
        buf.push("</div>");
        buf.push("<% }); %>");

        return buf.join("\n");
      }
    }    
  };

  // Shortcut access to config stuff  
  var c    = piewpiew.configValue;
  var conf = piewpiew.models.Config;
  var msg  = piewpiew.models.Config.messages;
  var tmpl = piewpiew.models.Config.templates;


  /**
   *  piewpiew.models.Model base class
   *  --------------------------------------------------------------------------
   *  Adds formal field definitions and a validation framework to the base 
   *  Backbone Model class.
   */
  piewpiew.models.Model = Backbone.Model.extend({

    /**
     * Custom implementation of toJSON that ensures the models cid and id (if 
     * set) are included in the json representation of the model
     */
    toJSON: function() {
      return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
        id: this.id,
        cid: this.cid
      });
    },

    editorTemplate: function() {
      return c(tmpl.modelEditor);
    },

    editorTemplateContext: function() {
      return {
        model:this
      }
    },

    initialize: function(attributes, options) {

      // Initialize each of our field objects...
      _.each(this.fields, function(field, name) {
        
        attributes || (attributes = {});

        // Set a default label if none has been provided...
        if (!field.label) {
          field.label = name;
        }

        field.name  = name;
      });
    },
    
    /**
     * Iterate over each of the model's field definitions and validate the
     * corresponding value from the model instance. Returns either and object of
     * errors or false if no validation errors occured. The structure of the 
     * error object is:
     *
     *  {
     *    "field-one-name" : [
     *      "Error message one",
     *      "Error message two"
     *    ],
     *    "field-two-name" : [
     *      "Error message one",
     *      "Error message two"
     *    ]
     *  }
     */
    validate: function(attrs) {
      var errors = {};
      var isValid = true;
      var model = this;

      _.each(attrs, function(value, key) {
        if (model.fields[key]) {
          var e = model.fields[key].validate(value);
          if (e) {
            isValid = false;
            errors[key] = e;
          }
        }
      });

      if (!isValid) return errors;
    }
  });

  return piewpiew;
});














































