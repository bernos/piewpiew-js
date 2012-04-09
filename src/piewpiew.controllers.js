define('piewpiew.controllers', ['piewpiew.core'], function(piewpiew) {
  
  var controllers = {};

  controllers.Controller = piewpiew.Class({
    initialize: function(options) {
      options || (options = {});
      
      this.events || (this.events = {});

      for (var e in options.events) {
        this.events[e] = options.events[e];
      }

      if (options.view) {
        this.setView(options.view);
      }
    },

    getView: function() {
      return this._view;
    },

    setView: function(view) {
      if (this.getView()) {
        this.unbindView(this.getView());
      }

      if (view) {
        this.bindView(view);
      }

      this._view = view;

      return this;
    },

    bindView: function(view) {
      for (var e in this.events) {
        view.bind(e, this[this.events[e]], this);
      }
    },

    unbindView: function(view) {
      for (var e in this.events) {
        view.unbind(e, this[this.events[e]]);
      }
    }
  });

  /**
   *  piewpiew.SimpleCommand base class
   *  --------------------------------------------------------------------------
   *  Basic command class implementation
   */

  controllers.SimpleCommand = piewpiew.Class({
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
  
  controllers.MacroCommand = piewpiew.Class({
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

  piewpiew.controllers = controllers;

  return controllers;
});