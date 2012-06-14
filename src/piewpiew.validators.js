define('piewpiew.validators', ['piewpiew.core'], function(piewpiew) {

  var validators = {};

  /**
   * piewpiew.models.validators.Validator  base class
   * --------------------------------------------------------------------------
   *  
   */
  validators.Validator = piewpiew.Class({
    initialize: function(options) {
      options || (options = {});
      options.messages || (options.messages = {});

      piewpiew.extend(this, options);

      this.messages = this.defaultMessages();

      piewpiew.extend(this.messages, options.messages);
    },

    defaultMessages: function() {
      return {};
    },

    validate: function(value) {
      return [];
    }
  });

  /**
   * piewpiew.models.validators.StringValidator class. 
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
  validators.StringValidator = validators.Validator.extend({
    minLength: -1,
    maxLength: -1,

    defaultMessages: function() {
      return {
        tooLongNoMinLength  : validators.StringValidator.messages.tooLongNoMinLength,
        tooShortNoMaxLength : validators.StringValidator.messages.tooShortNoMaxLength,
        outOfRange          : validators.StringValidator.messages.outOfRange
      }
    },

    validate: function(value) {
      var errors = [];

      if (this.maxLength > -1) {
        if (value.length > this.maxLength) {
          errors.push((this.minLength > -1) ? piewpiew.printf(this.messages.outOfRange, this) : 
                                              piewpiew.printf(this.messages.tooLongNoMinLength, this));
        }
      }

      if (this.minLength > -1) {
        if (value.length < this.minLength) {
          errors.push((this.maxLength > -1) ? piewpiew.printf(this.messages.outOfRange, this) : 
                                              piewpiew.printf(this.messages.tooShortNoMaxLength, this));
        }
      }

      return errors;
    }
  });

  validators.StringValidator.messages = {
     tooLongNoMinLength   : "String must have no more than ${maxLength} characters"
    ,tooShortNoMaxLength  : "String must have at least ${minLength} characters"
    ,outOfRange           : "String must have between ${minLength} and ${maxLength} characters"
  };

  /**
   * piewpiew.models.validators.RangeValidator
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
  validators.RangeValidator = validators.Validator.extend({
    min: 0,
    max: -1,

    defaultMessages: function() {
      return {
        outOfRange: validators.RangeValidator.messages.outOfRange
      }
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

  validators.RangeValidator.messages = {
    outOfRange : "A value between ${min} and ${max} is required."
  };

  /**
   * piewpiew.models.validators.RegexValidator
   * --------------------------------------------------------------------------
   */
  validators.RegexValidator = validators.Validator.extend({
    regex: /./,

    defaultMessages: function() {
      return {
        invalid: validators.RegexValidator.messages.invalid
      }
    },

    validate: function(value) {
      var errors = [];

      if (!this.regex.test(value)) {
        errors.push(piewpiew.printf(this.messages.invalid, {value: value}))
      }

      return errors;
    }
  });

  validators.RegexValidator.messages = {
    invalid: "The supplied string does not match the regular expression."
  };

  /**
   * piewpiew.models.validators.EmailValidator
   * --------------------------------------------------------------------------
   */
  validators.EmailValidator = validators.RegexValidator.extend({
    regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    defaultMessages: function() {
      return {
        invalid: validators.EmailValidator.messages.invalid
      }
    }
  });  

  validators.EmailValidator.messages = {
    invalid : "${value} is not a valid email address."
  };
  
  return validators;
});