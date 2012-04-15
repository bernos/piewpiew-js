define('piewpiew.config', ['piewpiew.core'], function(piewpiew) {

	var config = {};

  config.DEVELOPMENT  = "development";
  config.TESTING      = "testing";
  config.PRODUCTION   = "production";

	config.Config = piewpiew.Class({

    initialize: function(options) {
      options || (options = {});

      if (!options.environment) options.environment = config.DEVELOPMENT;

      this.getOptions = function() {
        return options;
      }
		},

    setEnvironment: function(environment) {
      this.getOptions()['environment'] = environment;
      return this;
    },

    getEnvironment: function() {
      return this.getOptions().environment;
    },

    get: function(key, defaultValue) {
      var value = null;
      var options = this.getOptions();
      var env = this.getEnvironment();

      // First check currently configured environment
      if (options[env]) {
        value = options[env][key];
      }

      // If we didnt find a value, escalate
      while (null === value && env != config.PRODUCTION) {
        switch (env) {
          case config.DEVELOPMENT :
            env = config.TESTING;
            break;

          case config.TESTING :
            env = config.PRODUCTION;
            break;
        }

        if(null != options[env]) {
          value = options[env][key];
        }        
      }

      if (null !== value) {
        return this.resolveValue(value);
      }

      return this.resolveValue(defaultValue);
    },

    resolveValue: function(value) {
      if (typeof value == 'function') {
        return value();
      }
      return value;
    }
	});

	piewpiew.config = config;

	return config;
});