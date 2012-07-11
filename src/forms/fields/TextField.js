define([
  './Field',
  '../../piewpiew.validators',
  '../../views/Helpers'
],

function(Field, validators, Helpers) {
 
  return Field.extend({

    minLength : -1,

    maxLength : -1,

    regex : /./,

    defaultValidators : function() {
      return {
        length : new validators.StringValidator({
          minLength : this.minLength,
          maxLength : this.maxLength
        }),

        regex : new validators.RegexValidator({
          regex : this.regex
        })
      };
    },

    render: function(value, attributes) {
      return Helpers.Html.textfield(this.name, value, attributes);
    }
  });
});