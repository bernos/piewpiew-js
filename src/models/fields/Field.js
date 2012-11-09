define(['underscore', 'piewpiew.core'], function(_, piewpiew) {
	return piewpiew.Class({
		required: false,

		initialize: function(options) {
			options = options || {};
			_.extend(this, options);

			this.validators = this.defaultValidators();
			this.validationMessages = this.defaultValidationMessages();

			_.extend(this.validators, options.validators || {});
			_.extend(this.validationMessages, options.validationMessages || {});
		},

		defaultValidators: function() {
			return {};
		},

		defaultValidationMessages: function() {
			return {
				required : "${label} is a required field.",
				type : "The value of ${label} is invalid."
			}
		},

		validate: function(value) {
			var errors = [];

			console

			if (!this.validateType(value)) {
				errors.push(piewpiew.printf(this.validationMessages.type, this));
			}			

			if (this.required && !this.validateRequired(value)) {
				errors.push(piewpiew.printf(this.validationMessages.required, this));
			}

			_.each(this.validators, function(validator, name) {
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
		}
	});
});