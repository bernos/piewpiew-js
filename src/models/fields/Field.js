define(['underscore', 'piewpiew.core'], function(_, piewpiew) {
	/**
	 * Base class for all field types
	 */
	return piewpiew.Class({

		/**
		 * Indicates that the field is required
		 */
		required: false,

		validators: null,

		validationMessages: null,

		/**
		 * Initialises the field instance
		 * @param {Object} options
		 */
		initialize: function(options) {
			options = options || {};
			_.extend(this, options);

			// Set up validation messages first, as they are used when setting up our
			// default validators
			this.validationMessages = {
				type : "The type of ${label} is invalid.",
				required : "${label} is a required field."
			};

			_.extend(this.validationMessages, this.defaultValidationMessages());
 			_.extend(this.validationMessages, options.validationMessages || {});
			
			this.validators = this.defaultValidators();
 			_.extend(this.validators, options.validators || {});
		},

		defaultValidators: function() {
			return {};
		},

		defaultValidationMessages: function() {
			return {}
		},

		validate: function(value) {
			var errors = [],
					field = this;

			if (!this.validateType(value)) {
				errors.push(piewpiew.printf(this.validationMessages.type, this));
			}			

			if (this.required && !this.validateRequired(value)) {
				errors.push(piewpiew.printf(this.validationMessages.required, this));
			}

			_.each(this.validators, function(validator, name) {
				validator.label = field.label;

				var v = validator.validate(value);

				if (null !== v) {
					errors = errors.concat(v);
				}
			});

			if (errors.length > 0) {
				return errors;
			}
		},

		validateType: function(value) {
			return true;
		},

		validateRequired: function(value) {
			if (null == value) return false;

		    if (typeof value == "string" && value === "") return false;

		    return true;
		},

		renderEditor: function(value, attributes, helpers) {
			return "";
		}
	});
});