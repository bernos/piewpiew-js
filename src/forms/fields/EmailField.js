define([
  './Field',
  '../../piewpiew.validators',
  '../../views/Helpers'
],

function(Field, validators, Helpers) {
 
  return Field.extend({

    defaultValidators : function() {
      return {
        email : new validators.EmailValidator()
      };
    },

    render: function(value, attributes) {
      return Helpers.Html.textfield(this.name, value, attributes);
    }
  });
});