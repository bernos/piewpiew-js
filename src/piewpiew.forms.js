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

    validate : function() {

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