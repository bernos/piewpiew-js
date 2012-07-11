/**
 * RangeValidator class
 * --------------------------------------------------------------------------
 *
 * Range validator class. Determines whether a numeric value is between a
 * minimum and maximum boundary.
 *
 * @property {Number} min
 *  Minimum allowed value in range
 * @property {Number} max
 *  Maximum allowed valud in range. Set this lower than min to allow
 *  unbounded values
 *
 * Validation messages:
 *  outOfRange - Displayed when the value being validated is out of range
 */
define([
  'piewpiew.core',
  './Validator'
],

function(piewpiew, Validator) {
  
  var RangeValidator = Validator.extend({
    min: 0,
    max: -1,

    defaultMessages: function() {
      return {
        outOfRange: RangeValidator.messages.outOfRange
      };
    },

    validate: function(value) {
      var errors = [];

      if (this.max < this.min) return errors;

      if (value < this.min || value > this.max) {
        errors.push(piewpiew.printf(this.messages.outOfRange, this));
      }

      return errors;
    }
  });

  RangeValidator.messages = {
    outOfRange : "A value between ${min} and ${max} is required."
  };

  return RangeValidator;
});