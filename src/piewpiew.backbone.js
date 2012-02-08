(function(root, factory) {
  // If AMD is available, use the define() method to load our dependencies 
  //and declare our module
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', 'piewpiew'], function(_, Backbone, piewpiew) {
      return factory(root, _, Backbone, piewpiew);
    });
  }
  // Otherwise we will attach our module to root, and pass references to our 
  // dependencies into the factory. We're assuming that our dependencies are 
  // also attached to root here, but they could come from anywhere 
  else 
  {    
    root.piewpiew.backbone = factory(root, _, Backbone, piewpiew);
  }
})(this, function(root, _, Backbone, piewpiew) {  
  
  /**
   *  piewpiew.View base class
   *  --------------------------------------------------------------------------
   *  Adds external template support to the basic Backbone.View class, as well 
   *  as default implementations for rendering and and app registration.
   */
  piewpiew.View = Backbone.View.extend({

    // A default template.
    template: 'No template specified for view',

    /**
     * Template processing function. By default we use the template function 
     * provided by the underscore library. By default instances call
     * piewpiew.View.template(). You can implement per-view template functions
     * by overriding this method. If you want to override the template function
     * for all views in your app, you should override piewpiew.View.template()
     *
     * @param {String} template
     *  The unparsed template string
     * @param {Object} context
     *  The template context containing data to be rendered by the template
     * @return {String} the rendered template
     */
    templateFunction: function(template, context) {
      return piewpiew.View.template(template, context);
    },

    /**
     * Returns a template context object. A Template context is an object 
     * which encapsulates the data that will be rendered by our template
     * function. By default we simply return the result of calling our
     * model's toJSON method (assuming we have a model, and that model has a
     * toJSON method).
     *
     * In many cases you will want to override this method so that ir returns
     * data better suited to your template's requirements.
     *
     * @return {Object}
     */
    templateContext: function() {
      if (this.model && typeof this.model.toJSON == 'function') {
        return this.model.toJSON();
      }
      return {};
    },

    /**
     * Renders the view. By default we pass our template string and template
     * context to templateFunction()
     */
    render: function() {
      $(this.el).html(this.templateFunction(this.template, this.templateContext()));
      return this;
    },

    /**
     * This method is called when the view is registered with the App. It
     * is often a better idea to put any view initialization code in onRegister(),
     * as opposed to initialize() as the view will have access to the App via 
     * this.app during onRegister().
     *
     * @param {piewpiew.App}
     *  the app that the view is being registered with
     */
    onRegister: function(app) {
      // noop
      return this;
    }
  });

  /**
   * Template processing function for all views. If you wish to use a templating
   * library other than the underscore template function (such as mustache etc)
   * just override this function
   *
   * @param {String} template
   *  The template string to be rendered
   * @param {Object} context
   *  The context object containing data to be rendered
   * @return {String} the rendered template
   */
  piewpiew.View.template = function(template, context) {
    return _.template(template, context);
  }

  /**
   *  piewpiew.App
   *  -------------------------------------------------------------------------
   *  The App class represents the 'core' of our app or app component. It
   *  provides a consistent point of access to views and models in our app
   *  via the regsiterView, registerModel, getView, getModel methods.
   */    
  piewpiew.App = Backbone.View.extend({

    /**
     * Initializes the App instance.
     *
     * @param {String} key
     *  Unique multiton key for the app
     * @param {Object} options
     *  Default options for the app
     */
    initialize: function(key, options) {
      if (piewpiew.App.instanceMap[key]) {
        throw "App instance with key '" + key + "' already exists."
      }

      piewpiew.App.instanceMap[key] = this;

      options = options || {};

      var defaults;

      if (defaults = this.defaults) {
        if (typeof defaults == 'function') {
          defaults = defaults.call(this);
        }
        options = _.extend({}, defaults, options);
      }

      this._multitonKey = key;
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

  piewpiew.App.instanceMap = {};

  /**
   *  piewpiew.SimpleCommand base class
   *  --------------------------------------------------------------------------
   *  Basic command class implementation
   */

  piewpiew.SimpleCommand = piewpiew.Class({
    initialize: function(app) {
      this.app = app;
    },

    execute: function() { return this; }
  });

  /**
   *  piewpiew.MacroCommand base class
   *  --------------------------------------------------------------------------
   *  Basic macro commadn class implementation. Macro commands can contain 
   *  multiple subcommands which will be executed in series.
   */
  
  piewpiew.MacroCommand = piewpiew.Class({
    initialize: function(app) {
      this.app = app;
      this.subCommands = [];
      this.initializeMacroCommand();
    },

    /**
     * Initialize the MacroCommand instance. Normally you will override this
     * an call this.addSubCommand() to add sub commands to the MacroCommand.
     */
    initializeMacroCommand: function() { return this },

    /**
     * Adds a sub command to the MacroCommand
     *
     * @param {Function} commandClass
     *  Constructor function of the sub command to add
     */
    addSubCommand: function(commandClass) {
      this.subCommands.push(commandClass);
      return this;
    },

    /**
     * Executes the MacroCommand. Iterates over the collection of sub commands
     * and executes them one after the other
     */
    execute: function() {
      while(this.subCommands.length > 0) {
        var commandClass = this.subCommands.shift();
        var command      = new commandClass(this.app);

        command.execute.apply(command, arguments);
      }
      return this;
    }
  });

  return piewpiew;
});














































