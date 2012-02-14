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
  
  piewpiew.data || (piewpiew.data = {});

  /**
   *  piewpiew.data.fields namespace
   *  ==========================================================================
   *  
   */
  piewpiew.data.fields || (piewpiew.data.fields = {});

  /**
   *  piewpiew.data.fields.Field base class
   *  --------------------------------------------------------------------------
   *  
   */
  piewpiew.data.fields.Field = piewpiew.Class({
    required: false,
    requiredMessage: "This is a required field",
    invalidTypeMessage: "The value of this field is invalid",
    labelTemplate: piewpiew.View.defaultTemplates.label(),
    editorTemplate: "",

    initialize: function(options) {
      options || (options = {});

      _.extend(this, options);

      this.validators = this.defaultValidators();

      _.extend(this.validators, options.validators);
    },

    defaultValidators: function() {
      return {};
    },

    /**
     * Validate a value against each of our validators. If the value is valid,
     * return false, otherwise return an array of validation errors
     */
    validate: function(value) {
      var errors = [];

      // First ensure the type of value is acceptable.
      if (!this.validateType(value)) errors.push(this.invalidTypeMessage);

      // Ensure required
      if (this.required && !this.validateRequired(value)) errors.push(this.requiredMessage);

      _.each(this.validators, function(validator, name) {
        var v = validator.validate(value);

        if (null != v) errors = errors.concat(v);
      });

      if (errors.length > 0) return errors;

      return false;
    },

    /**
     * Ensures that the type of value is valid. Inheritting classes implement
     * their own version of this method
     *
     * @param {Object} value
     * @return {boolean}
     */
    validateType: function(value) {
      return true;
    },

    /**
     * Validates that the value is valid, if this is a required field. For 
     * example, an empty string would pass the validateType() method, but should
     * not pass the validateRequired() test.
     * @param {Object} value
     * @return {boolean}
     */
    validateRequired: function(value) {
      if (null == value) return false;

      return true;
    }    
  });

  /**
   *  piewpiew.data.fields.StringField class
   *  --------------------------------------------------------------------------
   *  
   */
  piewpiew.data.fields.StringField = piewpiew.data.fields.Field.extend({
    invalidTypeMessage: "The value of this field must be a string",
    editorTemplate: piewpiew.View.defaultTemplates.textfield(),
    labelTemplate: piewpiew.View.defaultTemplates.label(),

    validateType: function(value) {
      return (typeof value == "string");
    },

    validateRequired: function(value) {
      return value.length > 0;
    }
  });

  piewpiew.data.fields.EmailField = piewpiew.data.fields.StringField.extend({
    defaultValidators: function() {
      return {
        email: new piewpiew.data.validators.EmailValidator()
      }
    }
  });

  /**
   *  piewpiew.data.validators namespace
   *  ==========================================================================
   *  
   */
  piewpiew.data.validators || (piewpiew.data.validators = {});

  /**
   *  piewpiew.data.validators.Validator  base class
   *  --------------------------------------------------------------------------
   *  
   */
  piewpiew.data.validators.Validator = piewpiew.Class({
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
   * String validator class. Ensures that a string is between a min and max
   * length
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
  piewpiew.data.validators.StringValidator = piewpiew.data.validators.Validator.extend({
    minLength: -1,
    maxLength: -1,

    defaultMessages: function() {
      return {
        tooLongNoMinLength : "String must have no more than ${maxLength} characters",
        tooShortNoMaxLength : "String must have at least ${minLength} characters",
        outOfRange : "String must have between ${minLength} and ${maxLength} characters"
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
  piewpiew.data.validators.RangeValidator = piewpiew.data.validators.Validator.extend({
    min: 0,
    max: -1,

    defaultMessages: function() {
      return {
        outOfRange: "A value between ${min} and ${max} is required."
      }
    },

    validate: function(value) {
      var errors = [];

      if (this.max < this.min) return errors;

      if (value < this.min || value > this.max) {
        errors.push(piewpiew.printf(this.messages.outOfRange, { min: this.min, max: this.max }));        
      }

      return errors;
    }
  });

  piewpiew.data.validators.RegexValidator = piewpiew.data.validators.Validator.extend({
    regex: /./,

    defaultMessages: function() {
      return {
        invalid: "The supplied string does not match the regular expression."
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

  piewpiew.data.validators.EmailValidator = piewpiew.data.validators.RegexValidator.extend({
    regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    defaultMessages: function() {
      return {
        invalid: "${value} is not a valid email address."
      }
    }
  });  

  /**
   *  piewpiew.Model base class
   *  --------------------------------------------------------------------------
   *  Adds formal field definitions and a validation framework to the base 
   *  Backbone Model class.
   */
  piewpiew.Model = Backbone.Model.extend({

    initialize: function(attributes, options) {

      // Initialize each of our field objects...
      _.each(this.fields, function(field, name) {
        
        attributes || (attributes = {});

        // Set a default label if none has been provided...
        if (!field.label) {
          field.label = name;
        }

        field.name  = name;
      });
    },
    
    /**
     * Iterate over each of the model's field definitions and validate the
     * corresponding value from the model instance. Returns either and object of
     * errors or false if no validation errors occured. The structure of the 
     * error object is:
     *
     *  {
     *    "field-one-name" : [
     *      "Error message one",
     *      "Error message two"
     *    ],
     *    "field-two-name" : [
     *      "Error message one",
     *      "Error message two"
     *    ]
     *  }
     */
    validate: function(attrs) {
      var errors = {};
      var isValid = true;
      var model = this;

      _.each(attrs, function(value, key) {
        console.log("validating ", key, value);
        if (model.fields[key]) {
          console.log(model.fields);
          var e = model.fields[key].validate(value);
          console.log("validated ", e);
          if (e) {
            isValid = false;
            errors[key] = e;
          }
        }
      });

      if (!isValid) return errors;
    }
  });

  return piewpiew;
});














































