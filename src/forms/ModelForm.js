define([
  'underscore',
  './Form'
],

function(_, Form) {
  
  return Form.extend({
    initialize : function(attributes, options) {
      this.fields = this.fields || {};

      // For any fields not explicitly set in the ModelForm.fields
      // configuration, check the fields of the associated model and
      // set up corresponding form fields for each
      if (this.model) {
        var that = this;

        _.each(this.model.prototype.fields, function(field, name) {
          if (that.fields[name] === null) {
            that.fields[name] = that.getFormFieldForModelField(field);
          }
        });
      }

      Form.prototype.initialize.apply(this, arguments);
    },

    getFormFieldForModelField: function(modelField) {
      return "TBA";
    },

    save: function() {
      this.validate();
    }
  });
});