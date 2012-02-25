(function(root, factory) {
  // If AMD is available, use the define() method to load our dependencies 
  //and declare our module
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', 'piewpiew'], function(_, Backbone, piewpiew) {
      return factory(root, _, Backbone, piewpiew);
    });
  }
  // Otherwise we will attach our module to root, and pass references to our 
  // dependencies into the factory. We're assuming that our dependencies are 
  // also attached to root here, but they could come from anywhere 
  else 
  {    
    root.piewpiew.backbone = factory(root, _, Backbone, piewpiew);
  }
})(this, function(root, _, Backbone, piewpiew) {  
  
  /**
   *  piewpiew.models.validators namespace
   *  ==========================================================================
   *  
   */
  piewpiew.models || (piewpiew.models = {});
  piewpiew.models.validators || (piewpiew.models.validators = {});

  /**
   *  piewpiew.models.validators.Config
   *  ==========================================================================
   *  
   *  Any and all strings for messages, templates and so forth should live here,
   *  and be retrieved by objects in the models module, rather than declared on
   *  objects themselves. Just makes it easier to change stuff as you don't need
   *  to go looking for strings hidden away in source.
   */
  piewpiew.models.validators.Config = {

    messages: {
      
      /* StringValidator */
      stringTooLongNoMinLength:  "String must have no more than ${maxLength} characters"
      ,stringTooShortNoMaxLength: "String must have at least ${minLength} characters"
      ,stringOutOfRange:          "String must have between ${minLength} and ${maxLength} characters"
      
      /* RangeValidator */
      ,rangeOutOfRange: "A value between ${min} and ${max} is required."
      
      /* RegexValidator */
      ,regexNoMatch: "The supplied string does not match the regular expression."
      
      /* EmailValidator */
      ,emailInvalid: "${value} is not a valid email address."
    }    
  };

  // Shortcut access to config stuff  
  var c    = piewpiew.configValue;
  var conf = piewpiew.models.validators.Config;
  var msg  = piewpiew.models.validators.Config.messages;

  /**
   * piewpiew.models.validators.Validator  base class
   * --------------------------------------------------------------------------
   *  
   */
  piewpiew.models.validators.Validator = piewpiew.Class({
    initialize: function(options) {
      options || (options = {});
      options.messages || (options.messages = {});

      _.extend(this, options);

      this.messages = this.defaultMessages();

      _.extend(this.messages, options.messages);
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
  piewpiew.models.validators.StringValidator = piewpiew.models.validators.Validator.extend({
    minLength: -1,
    maxLength: -1,

    defaultMessages: function() {
      return {
        tooLongNoMinLength : c(msg.stringTooLongNoMinLength),
        tooShortNoMaxLength : c(msg.stringTooShortNoMaxLength),
        outOfRange : c(msg.stringTooShortNoMaxLength)
      }
    },

    validate: function(value) {
      var errors = [];

      if (this.maxLength > -1) {
        if (value.length > this.maxLength) {
          errors.push((this.minLength > -1) ? piewpiew.printf(this.messages.outOfRange, this) : piewpiew.printf(this.messages.tooLongNoMinLength, this));
        }
      }

      if (this.minLength > -1) {
        if (value.length < this.minLength) {
          errors.push((this.maxLength > -1) ? piewpiew.printf(this.messages.outOfRange, this) : piewpiew.printf(this.messages.tooShortNoMaxLength, this));
        }
      }

      return errors;
    }
  });

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
  piewpiew.models.validators.RangeValidator = piewpiew.models.validators.Validator.extend({
    min: 0,
    max: -1,

    defaultMessages: function() {
      return {
        outOfRange: c(msg.rangeOutOfRange)
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

  /**
   * piewpiew.models.validators.RegexValidator
   * --------------------------------------------------------------------------
   */
  piewpiew.models.validators.RegexValidator = piewpiew.models.validators.Validator.extend({
    regex: /./,

    defaultMessages: function() {
      return {
        invalid: c(msg.regexNoMatch)
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

  /**
   * piewpiew.models.validators.EmailValidator
   * --------------------------------------------------------------------------
   */
  piewpiew.models.validators.EmailValidator = piewpiew.models.validators.RegexValidator.extend({
    regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    defaultMessages: function() {
      return {
        invalid: c(msg.emailInvalid)
      }
    }
  });  
  
  return piewpiew;
});














































