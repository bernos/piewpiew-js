define('piewpiew.forms.fields', [
  'underscore',
  'piewpiew.core',
  'piewpiew.forms',
  'piewpiew.views.helpers'
], 

function(_, piewpiew, forms, helpers) {

  var fields = {};

  /**
   * piewpiew.forms.fields.Field
   * ===========================================================================
   *
   */
  fields.Field = piewpiew.Class({
    
    /**
     * Is the field required?
     */
    required: false,

    /**
     * Error message if a value fails required validation
     */
    requiredMessage: "${label} is a required field",
    
    /**
     * Error message if a value is of the wrong type
     */
    invalidTypeMessage: "The value of ${label} is invalid",

    /**
     * Initialise the field instance.
     *
     * @param {object} options
     */
    initialize: function(options) {
      options || (options = {});

      _.extend(this, options);

      this.validators = this.defaultValidators();

      _.extend(this.validators, options.validators);
    },

    /**
     * Creates default validators for the field. Inheritting classes should 
     * provide their own implementation
     */
    defaultValidators: function() {
      return {};
    },

    /**
     * Render the field. Form subclasses should override this method and return
     * the appropriate HTML formatted string.
     *
     * @param {Object} value
     *  Value of the field
     * @param {Object} attributes
     *  Extra html attributes for the field
     * @return {String}
     */
    render: function(value, attributes) {
      return "";
    },

    /**
     * Validate a value against each of our validators. If the value is valid,
     * return false, otherwise return an array of validation errors
     */
    validate: function(value) {
      var errors = [];

      // First ensure the type of value is acceptable.
      if (!this.validateType(value)) {
        errors.push(piewpiew.printf(this.invalidTypeMessage, this));
      }

      // Ensure required
      if (this.required && !this.validateRequired(value)) {
        errors.push(piewpiew.printf(this.requiredMessage, this));
      }

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

  fields.TextField = fields.Field.extend({
    render: function(value, attributes) {
      return helpers.Html.textfield(this.name, value, attributes);
    }
  });

  forms.fields = fields;

  return forms.fields;
});