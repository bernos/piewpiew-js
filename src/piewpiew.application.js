define('piewpiew.application', ['underscore', 'backbone', 'piewpiew.core'], function(_, Backbone, piewpiew) {

  var application = {};

  /**
   *  piewpiew.Application
   *  -------------------------------------------------------------------------
   *  The Application class represents the 'core' of our app or app component. 
   *  It provides a consistent point of access to views and models in our app
   *  via the regsiterView, registerModel, getView, getModel methods.
   */    
  application.Application = piewpiew.Class({

    /**
     * Default element for the application is the body tag
     */
    el: 'body',

    /**
     * Initializes the Application instance.
     *
     * @param {Object} options
     *  Default options for the app
     */
    initialize: function(config, options) {

      if (config) {
        config(this);
      }

      options || (options = {});

      var defaults;

      if (defaults = this.defaults) {
        if (typeof defaults == 'function') {
          defaults = defaults.call(this);
        }
        options = _.extend({}, defaults, options);
      }

      this.set(options);

      this._routerMap   = {};
      this._modelMap    = {};
      this._viewMap     = {};

      this.initializeOptions(options);
      this.initializeRouter();
      this.initializeModel();
      this.initializeView();
      this.initializeController();

      return this;
    },

    set: function(name, value) {
      this.options || (this.options = {});

      if (arguments.length == 2) {
        this.options[name] == value;
      } else {
        for (var n in name) {
          this.options[n] = name[n];
        }
      }

      return this;
    },

    get: function(name) {
      this.options || (this.options = {});
      return this.options[name];
    },

    configure: function(env, fn) {
      var envs = 'all';
      var args = Array.prototype.slice.call(arguments);
      var fn = args.pop();

      if (args.length) {
        envs = args;
      }

      if (envs == 'all' || envs.indexOf(this.env) > -1) {
        fn.call(this); 
      }

      return this;
    },

    /**
     * Initialize the app with options passed to the constructor
     */
    initializeOptions: function(options) {
      _.extend(this, options);
    },

    /**
     * Register your router(s) here.
     */
    initializeRouter: function() { 
      if (this.routes) {
        var routes = this.normalizeRoutes(this.routes);

        this.registerRouter('default', new Backbone.Router({
          routes: routes
        }));

      }

      return this; 
    },

    /**
     * Register your models with the app here.
     */
    initializeModel: function() { return this; },

    /**
     * Register your views with the app here.
     */
    initializeView: function() { return this; },

    /**
     * Initialize the controller here
     */
    initializeController: function() { return this; },

    /**
     * Registers a router with the app
     *
     * @param {String} name
     *  Name of the router
     * @param {Backbone.Router} router
     *  A router to register
     */
    registerRouter: function(name, router) {
      this._routerMap[name] = router;
    },

    normalizeRoutes: function(routes) {
      if (this.baseUrl) {
        normalizedRoutes = {};
        
        for (var pattern in routes) {
          var p = pattern.length ? this.baseUrl + '/' + pattern : this.baseUrl;

          normalizedRoutes[p] = routes[pattern];
        }  

        return normalizedRoutes;
      }

      return routes;
    },

    /**
     * Retrieve a router by name
     *
     * @param {String} name
     *  The name of the router to retrieve
     * @return {Backbone.Router} the requested router or null if no router has
     *  been registered with the provided name
     */
    getRouter: function(name) {
      return this._routerMap[name];
    },

    /**
     * Registers a model with the App. The model's app property will be set
     * to reference this app. If the model has an onRegister() method it will
     * be called
     *
     * @param {String} name
     *  A name to register the model under
     * @param {Backbone.Model} model
     * @return {App}
     */
    registerModel: function(name, model) {
      this._modelMap[name] = model;
      model.app = this;

      if (typeof model.onRegister == 'function') {
        model.onRegister(this);
      }

      return this;
    },

    /**
     * Retrieve a model from the app.
     *
     * @param {String} name
     *  The name of the model to retrieve
     * @return {Backbone.Model}
     */
    getModel: function(name) {
      return this._modelMap[name]
    },

    /**
     * Registers a view with the App. The view's app property will be set
     * to reference this app. If the view has an onRegister() method it will
     * be called
     *
     * @param {String} name
     *  A name to register the view under
     * @param {Backbone.View} view
     * @return {App}
     */
    registerView: function(name, view) {
      this._viewMap[name] = view;
      view.app = this;

      if (typeof view.onRegister == 'function') {
        view.onRegister(this);
      }

      return this;
    },

    /**
     * Retrieve a view from the app
     *
     * @param {String} name
     *  Name of the view to retrieve
     * @return {Backbone.View}
     */
    getView: function(name) {
      return this._viewMap[name];
    },

    /**
     * Binds a command class to an event source and event name. The App
     * will create an instance of the command class, and call it's execute()
     * method whenever the eventSource triggers the event. The command's
     * execute() method will receive the arguments provided by the event
     *
     * @param {Function} commandClass
     *  Constructor of a command class. Command classes must implement an
     *  execute() method
     * @param {Object} eventSource
     *  The event source that the command will be bound to
     * @param {String} eventName
     *  The name of the event the command will be bound to
     * @return {App}
     */
    registerCommand: function(commandClass, eventSource, eventName) {
      var app = this;

      eventSource.bind(eventName, function() {
        var command = new commandClass(app);
        command.execute.apply(command, arguments)  
      });

      return this;
    }
  });

  

  piewpiew.application = application;

  return application;
});