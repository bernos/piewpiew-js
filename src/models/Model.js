define(['underscore', 'backbone'], function(_, Backbone) {

	/**
	 * Our Model class adds the ability to set up formal field definitions for our
	 * model attributes. Field definitions allow us to add metadata that can be
	 * used when performing model validation, displaying fields and so forth.
	 *
	 * Field definitions are provided by the classes in the models.fields module
	 * but custom field types can be created by extending the basic 
	 * models.field.Field class. Field definitions are set up by providing an
	 * object for the `fields` property of you model class, like this
	 *
	 * PersonModel = Model.extend({
	 *   fields: {
	 *     name: new StringField({
	 *       minLength: 0,
	 *       maxLength: 64
	 *     })
	 *   }
	 * });
	 * 
	 * It is worth noting that the fields object will be attached to the 
	 * constructor function of the model, effectively becoming a "static" property
	 * of the model class, as opposed to an instance property of each model. Model
	 * instances can access their field definitions via `this.constructor.fields`
	 */
	var Model = Backbone.Model.extend({
		
		/**
		 * If set to true, the model will fail validation if any it contains any 
		 * attributes that do not have a formal field specification set.
		 */
		strict : true,

		/**
		 * Ensure that we set a default value (usually just null) for all of our 
		 * formally defined fields. We do this so that each field will have 
		 * something to validate when the validate() method runs.
		 * @param {Object} attrs
		 * @param {Object} options
		 */
		initialize: function(attrs, options) {
			attrs = attrs || {};

			_.each(this.constructor.fields, function(field, key) {
				if (undefined === attrs[key]) {
					attrs[key] = field.defaultValue;
				}
			});

			this.set(attrs, {silent: true});
		},

		/**
		 * Validate attrs. For each attribute we pass its value to the corresponding 
		 * formal field definition to be validated. If the model's `strict` property 
		 * is true, and there is no corresponding formal field definition for an 
		 * attribute, the model will fail validation.
		 * @param {Object} attrs
		 * @param {Object} options
		 * @return Either null if no errors were detected, or an object containing 
		 *  validation error messages for all the model fields which failed 
		 *  validation, in the following format.
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
		validate: function(attrs, options) {
			var errors 	= {},
					isValid = true,
					fields 	= this.constructor.fields,
					strict 	= this.strict;

			_.each(attrs, function(value, key) {
				if(fields[key] && fields[key].validate) {
					var e = fields[key].validate(value);

					if (e) {
						isValid = false;
						errors[key] = e;
					}
				} else if (!fields[key] && strict) {
					isValid = false;
					errors[key] = "Model has no field named " + key;
				}
			});

			return isValid ? null : errors;
		}
	});

	/**
	 * We will use an overridden "extend" method that will ensure any model fields
	 * getted added as static properties, and that they are also merged with any 
	 * parent models fields also
	 */
	Model.extend = function(protoProps, staticProps) {
		protoProps.fields = protoProps.fields || {};

		_.each(protoProps.fields, function(field, name) {
			field.name = name;
			if (!field.label) field.label = name;
		});

		staticProps = staticProps || {};
		staticProps.fields = staticProps.fields || {};

		_.extend(staticProps.fields, this.fields || {}, protoProps.fields);

		protoProps.fields = null;

		var child = Backbone.Model.extend.apply(this, [protoProps, staticProps]);
				child.extend = this.extend;

		return child;
	}

	return Model;

});