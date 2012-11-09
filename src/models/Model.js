define(['underscore', 'backbone'], function(_, Backbone) {

	var Model = Backbone.Model.extend({
		strict : true,

		validate: function(attrs, options) {
			var errors = {};
			var isValid = true;
			var fields = this.constructor.fields;
			var strict = this.strict;

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

	// We will use an overridden "extend" method that will ensure
	// andy model fields getted added as static properties, and that
	// they are also merged with any parent models fields also
	Model.extend = function(protoProps, staticProps) {
		console.log("Extended inherittance");

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