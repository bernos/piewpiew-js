define('piewpiew.forms', [
  'underscore',
  'backbone',
  'piewpiew.core'
], 

function(_, backbone, piewpiew) {
  var forms = {};

  forms.Form = backbone.Model.extend({

    initialize: function(attributes, options) {
      this.fields || (this.fields = {});

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
      console.log("validate", attrs)
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

  forms.ModelForm = forms.Form.extend({
    initialize : function(attributes, options) {
      this.fields || (this.fields = {});

      // For any fields not explicitly set in the ModelForm.fields 
      // configuration, check the fields of the associated model and 
      // set up corresponding form fields for each
      if (this.model) {
        var that = this;

        _.each(this.model.prototype.fields, function(field, name) {
          if (that.fields[name] == null) {
            that.fields[name] = that.getFormFieldForModelField(field);
          }
        });
      }

      forms.Form.prototype.initialize.apply(this, arguments);
    },

    getFormFieldForModelField: function(modelField) {
      return "TBA";
    },

    save: function() {
      this.validate
    }
  });

  piewpiew.forms = forms;

  return forms;
});

/*

Notes on refactoring old model and formview

Old formview was dumb with regards to template. Required the Html.editorForModel helper.

Get rid of Html.editorForModel helper, and make the default form template smarter.

Try to avoid template library specific template syntax

All view type functions in piewpiew.models.fields needs to be removed


*/