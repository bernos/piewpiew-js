(function(root, factory) {
  // If AMD is available, use the define() method to load our dependencies 
  //and declare our module
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', 'piewpiew', 'piewpiew.backbone.models.validators'], function(_, Backbone, piewpiew, validators) {
      return factory(root, _, Backbone, piewpiew, validators);
    });
  }
  // Otherwise we will attach our module to root, and pass references to our 
  // dependencies into the factory. We're assuming that our dependencies are 
  // also attached to root here, but they could come from anywhere 
  else 
  {    
    root.piewpiew.backbone = factory(root, _, Backbone, piewpiew, piewpiew.models.validators);
  }
})(this, function(root, _, Backbone, piewpiew, validators) {  

  /**
   *  piewpiew.models.fields namespace
   *  ==========================================================================
   *  
   */
  piewpiew.models || (piewpiew.models = {});
  piewpiew.models.fields || (piewpiew.models.fields = {});
  
  /**
   *  piewpiew.models.Config
   *  ==========================================================================
   *  
   *  Any and all strings for messages, templates and so forth should live here,
   *  and be retrieved by objects in the models module, rather than declared on
   *  objects themselves. Just makes it easier to change stuff as you don't need
   *  to go looking for strings hidden away in source.
   */
  piewpiew.models.fields.Config = {

    messages: {
      
      /* Field */
       required: "${label} is a required field"
      ,invalidType: "The value of ${label} is invalid"

      /* StringField */
      ,stringFieldInvalidType: "${label} must be a string"
      ,stringFieldTooLongNoMinLength: "${label} must have no more than ${maxLength} characters"
      ,stringFieldTooShortNoMaxLength: "${label} must have at least ${minLength} characters"
      ,stringFieldOutOfRange: "${label} must have between ${minLength} and ${maxLength} characters"

      /* EmailField */
      ,emailFieldInvalidEmailMessage: "${value} is not a valid email address."
    },

    templates: {
       fieldLabel: '<%= Html.label(name, value, attributes) %>' 
      ,fieldEditor: '<div <%= Html.attributeString(attributes) %>><%= Html.labelForField(model, field) %><div class="controls"><%= Html.formControlForField(model, field) %></div></div>'
      ,stringFieldFormControl: '<%= Html.textfield(name, value, attributes) %>'
    }    
  };

  // Shortcut access to config stuff  
  var c    = piewpiew.configValue;
  var conf = piewpiew.models.fields.Config;
  var msg  = piewpiew.models.fields.Config.messages;
  var tmpl = piewpiew.models.fields.Config.templates;

  /**
   *  piewpiew.models.fields.Field base class
   *  --------------------------------------------------------------------------
   *  
   */
  piewpiew.models.fields.Field = piewpiew.Class({
    /**
     * Is the field required?
     */
    required: false,

    /**
     * Error message if a value fails required validation
     */
    requiredMessage: c(msg.required),
    
    /**
     * Error message if a value is of the wrong type
     */
    invalidTypeMessage: c(msg.invalidType),
    
    /**
     * Returns a template string for rendering the field label.
     */
    labelTemplate: function() {
      return c(tmpl.fieldLabel);
    },

    /**
     * Returns a template context object for passing to our label template
     */
    labelTemplateContext: function(model) {
      return {
        name: this.name,
        value: this.label
      }; 
    },

    formControlTemplate: function() {
      return "";
    },

    formControlTemplateContext: function(model) {
      return {
        name: this.name,
        value: model.get(this.name)
      };
    },
    
    /**
     * Template for rendering an editor component for this field.
     */
    editorTemplate: function() {
      return c(tmpl.fieldEditor);
    },

    editorTemplateContext: function(model) {
      return {
        name: this.name,
        model: model,
        field: this,
        value: model.get(this.name)
      }
    },

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
     * Creates default validators for the field. Inheritting classes
     * should provide their own implementation
     */
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
      if (!this.validateType(value)) errors.push(piewpiew.printf(this.invalidTypeMessage, this));

      // Ensure required
      if (this.required && !this.validateRequired(value)) errors.push(piewpiew.printf(this.requiredMessage, this));

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
   *  piewpiew.models.fields.StringField class
   *  --------------------------------------------------------------------------
   *  
   */
  piewpiew.models.fields.StringField = piewpiew.models.fields.Field.extend({
    
    invalidTypeMessage : c(msg.stringFieldInvalidType),

    tooLongNoMinLengthMessage : c(msg.stringFieldTooLongNoMinLength),
    
    tooShortNoMaxLengthMessage : c(msg.stringFieldTooShortNoMaxLength),
    
    outOfRangeMessage : c(msg.stringFieldOutOfRange),

    minLength: -1,

    maxLength: -1,

    defaultValidators: function() {
      var self = this;

      return {
        length: new piewpiew.models.validators.StringValidator({
          minLength: self.minLength,
          maxLength: self.maxLength,
          messages: {
            tooLongNoMinLength : piewpiew.printf(self.tooLongNoMinLengthMessage, self),
            tooShortNoMaxLength : piewpiew.printf(self.tooShortNoMaxLengthMessage, self),
            outOfRange : piewpiew.printf(self.outOfRangeMessage, self)
          }
        })
      }
    },

    formControlTemplate: function() {
      return c(tmpl.stringFieldFormControl);      
    },

    validateType: function(value) {
      return (typeof value == "string");
    },

    validateRequired: function(value) {
      return value.length > 0;
    }
  });

  piewpiew.models.fields.EmailField = piewpiew.models.fields.StringField.extend({

    invalidEmailMessage: c(msg.emailFieldInvalidEmailMessage),

    defaultValidators: function() {
      var self = this;

      return {
        email: new piewpiew.models.validators.EmailValidator({
          messages: {
            invalid: self.invalidEmailMessage
          }
        })
      }
    }
  });

  return piewpiew;
});