define([
  'underscore',
  './Field',
  '../../validators/StringValidator',
  '../../validators/RegexValidator'
],

function(_, Field, StringValidator, RegexValidator) {
  return Field.extend({
    
    minLength: -1,
    maxLength: -1,
    regex: /./,

    defaultValidationMessages: function() {
      return {
        tooLongNoMinLength  : StringValidator.messages.tooLongNoMinLength,
        tooShortNoMaxLength : StringValidator.messages.tooShortNoMaxLength,
        outOfRange          : StringValidator.messages.outOfRange,
        regexNoMatch        : RegexValidator.messages.invalid
      };
    },

    defaultValidators: function() {
      return {
        length: new StringValidator({
          minLength: this.minLength,
          maxLength: this.maxLength,
          messages: {
            tooLongNoMinLength  : this.validationMessages.tooLongNoMinLength,
            tooShortNoMaxLength : this.validationMessages.tooShortNoMaxLength,
            outOfRange          : this.validationMessages.outOfRange
          }
        }),
        regex: new RegexValidator({
          regex: this.regex,
          messages: {
            invalid: this.validationMessages.regexNoMatch
          }
        })
      };
    },

    renderEditor: function(value, attributes, helpers) {
      return helpers.Html.textfield(this.name, value, attributes);
    }
  });
});