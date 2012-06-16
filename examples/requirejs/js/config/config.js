define(function() {

  /**
   * Our main environment configuration
   */
  var env = "development"

  /**
   * Configuration functions in this section are run
   * during the bootstrap phase, prior to the application
   * module even being loaded. This is the place to put
   * any environment settings that need to be defined
   * before the app loads, such as requirejs configuration
   * and so forth
   */
  require.config({
    paths: {
      // Common libraries
      'jquery'    : 'libs/jquery/jquery-1.7.1.min',
      'underscore': 'libs/underscore/underscore-1.3.1.min',
      'backbone'  : 'libs/backbone/backbone-0.9.2.min',
      'piewpiew'  : 'libs/piewpiew/piewpiew-0.0.2.min',

      // Require JS plugins
      'text'      : 'libs/requirejs/text',
      'i18n'      : 'libs/requirejs/i18n',
      'domReady'  : 'libs/requirejs/domReady'
    },

    shim : {
      'underscore' : {
        exports : '_'
      },

      'backbone' : {
        deps : ['underscore', 'jquery'],
        exports : 'Backbone'          
      }
    }
  });

  /**
   * The configuration function below will be called when
   * the Application is instantiated. The app argument is a
   * reference to the application object being configured
   */
  return function(app) {

    /**
     * Set the app environment
     */
    app.env = env;

    /**
     * Set "foo" to "bar" for the staging environment
     */
    app.configure("staging", function() {
      app.set("foo", "bar");
    });

    /**
     * Set "fizz" to "buzz" for both development and staging
     * environments
     */
    app.configure("development", "staging", function() {
      app.set("fizz", "buzz")
    });

    /**
     * Ommitting the environment argument is equivalent to
     * specifying "all" environments
     */
    app.configure(function() {
      app.set("title", "awesome");
    });

    console.log("configuring", app);
  }
});