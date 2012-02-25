----
TODO
----

# Model fields need to be able to be models or collections.
# Replace piewpiew.printf with calls to piewpiew.template. One templating solution should suffice
  Either that or change printf to be more like printf("Here is {0} the {1} template", arg1, arg2);
# Move template strings, validation messages and so forth into a config object.
  Each package/module could have it's own config. Eventually it would be sweet
  to be able to localise strings.
# Allow for setting validation messages for default validators in field properties, rather than
  having to create custom validators.

----
DONE
----

# piewpiew.backbone.models.js is getting too big. Split it up. Heres the dependency map
	
	piewpiew
		piewpiew.models.Model
		piewpiew.models.validators
			piewpiew.models.fields
