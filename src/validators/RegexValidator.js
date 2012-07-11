/**
 * RegexValidator class
 * --------------------------------------------------------------------------
 *
 * Regular expression validator class. Determines whether a string matches a
 * a given regular expression,
 *
 * @property {Regex} regex
 *  The regular expression to match against.
 *
 * Validation messages:
 *  invalid - Displayed when the value does not match the regex.
 */
define([
  'piewpiew.core',
  './Validator'
],

function(piewpiew, Validator) {
  
  var RegexValidator = Validator.extend({
    regex: /./,

    defaultMessages: function() {
      return {
        invalid: RegexValidator.messages.invalid
      };
    },

    validate: function(value) {
      var errors = [];

      if (!this.regex.test(value)) {
        errors.push(piewpiew.printf(this.messages.invalid, {value: value}));
      }

      return errors;
    }
  });

  RegexValidator.messages = {
    invalid: "The supplied string does not match the regular expression."
  };

  return RegexValidator;
});