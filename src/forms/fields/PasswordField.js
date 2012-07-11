define([
  './Field',
  '../../piewpiew.validators',
  '../../views/Helpers'
],

function(Field, validators, Helpers) {
 
  return Field.extend({

    complexityRegex: /(?=^.{8,}$)((?=.*\d)|(?=.*[\W_]+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,

    defaultValidators : function() {
      return {
        complexity : new validators.RegexValidator({
          regex: this.complexityRegex,
          messages: {
            invalid: "Password must be at least 8 characters long, contain upper and lower case letters, and at least 1 number or special character."
          }
        })
      };
    },

    render: function(value, attributes) {
      return Helpers.Html.passwordField(this.name, value, attributes);
    }
  });
});