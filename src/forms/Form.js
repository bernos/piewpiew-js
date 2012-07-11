define([
  'underscore',
  'backbone'
],

function(_, backbone) {

  return backbone.Model.extend({

    /**
     * TODO: need to create local field "proxy" objects, as some
     * field properties need to be bound to form instances, while
     * some need to be shared by all form instances.
     *
     * Field proxies will need an interface like
     *
     * {
          name
          label
          validate()
          value()
          render() - also need to update the formField html helper
     }
     */
    initialize: function(attributes, options) {
      this.fields = this.fields || {};

      _.each(this.fields, function(field, name) {
        field.name = name;

        if (!field.label) {
          field.label = name;
        }
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
    },

    submit : function(data) {

    }
  });
});