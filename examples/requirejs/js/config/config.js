define({
	version: "0.0.1",

  /**
   * Specify the environment configuration. Valid values are 
   * development|test|production.
   */
  environment: "development",        

  /**
   * Configuration options specific to the development environment. Development
   * environment also inherits from the test and production environments
   */
  development: { },

  /**
   * Configuration options specifc to the test environment. Test environment 
   * also inherits from the production environment.
   */
  test: { },

  /**
   * Configuration options for the production environment. All values in this
   * environment are ineritted by the test and development environments. You 
   * should define all your configuration options here in the production block
   * and only override what is necessary in the test and development blocks
   */
  production: {
    requirejs: {
      paths: {
        // Common libraries
        'amd-loader': 'libs/amd-loader', // Wrapper for loading non-amd libs
        'jquery'    : 'libs/jquery/jquery-1.7.1.min',
        'underscore': 'libs/underscore/underscore',
        'backbone'  : 'libs/backbone/backbone',
        'piewpiew'  : 'libs/piewpiew/piewpiew-0.0.1.min',

        // Require JS plugins
        'text'      : 'libs/requirejs/text',
        'order'     : 'libs/requirejs/order',
        'i18n'      : 'libs/requirejs/i18n',
        'domReady'  : 'libs/requirejs/domReady'
      }
    }
  }
});