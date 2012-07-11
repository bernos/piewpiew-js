/**
 * StringValidator class.
 * --------------------------------------------------------------------------
 *
 * Ensures that a string is between a min and max length
 *
 * @property {Number} minLength
 *  Minimum length for the string. Use -1 for no minimum length
 * @property {Number} maxLength
 *  Maximum length for the string. Use -1 for no maximum length
 *
 * Validation messages
 *  outOfRange - String is not between minLength and maxLength
 *  tooLongNoMinLength - String is longer than max length with no minLength
 *    specified
 *  tooShortNoMaxLength - String is shorter than min length with no maxLength
 *    specified
 */
define([
  'piewpiew.core',
  './Validator'
],

function(piewpiew, Validator) {
  
  var StringValidator = Validator.extend({
    minLength: -1,
    maxLength: -1,

    defaultMessages: function() {
      return {
        tooLongNoMinLength  : StringValidator.messages.tooLongNoMinLength,
        tooShortNoMaxLength : StringValidator.messages.tooShortNoMaxLength,
        outOfRange          : StringValidator.messages.outOfRange
      };
    },

    validate: function(value) {
      var errors = [];

      if (this.maxLength > -1) {
        if (value.length > this.maxLength) {
          errors.push((this.minLength > -1) ?
            piewpiew.printf(this.messages.outOfRange, this) :
            piewpiew.printf(this.messages.tooLongNoMinLength, this));
        }
      }

      if (this.minLength > -1) {
        if (value.length < this.minLength) {
          errors.push((this.maxLength > -1) ?
            piewpiew.printf(this.messages.outOfRange, this) :
            piewpiew.printf(this.messages.tooShortNoMaxLength, this));
        }
      }

      return errors;
    }
  });

  StringValidator.messages = {
     tooLongNoMinLength   : "String must have no more than ${maxLength} characters",
     tooShortNoMaxLength  : "String must have at least ${minLength} characters",
     outOfRange           : "String must have between ${minLength} and ${maxLength} characters"
  };
  
  return StringValidator;
});