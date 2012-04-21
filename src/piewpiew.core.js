/*******************************************************************************

  piewpiew.core.js

*******************************************************************************/
(function(global) 
{
  var piewpiew = {};

  piewpiew.DEVELOPMENT  = "development";
  piewpiew.TESTING      = "testing";
  piewpiew.PRODUCTION   = "production";

  /**
   * Storage for modules loaded using piewpiew's built in define and require
   * methods. This will only be used when not using a third part AMD loader like
   * requirejs. The expectation here is that if we're not using AMD then we
   * are using plain old <script> tags, and we are responsible for ensuring that
   * all our scripts are loaded in the right order.
   */
  var modules  = {
    'underscore' : global._,
    'backbone'   : global.Backbone,
    'jquery'     : global.jQuery
  };

  /**
   * Merges two or more objects. When extend(a,b,c) is called, first the 
   * properties of b are copied to a, then the properties of c are copied to a.
   * The updated 'a' object is returned
   */
  var extend = function(obj) {
    for (var i = 0, max = arguments.length; i < max; i++) {
      var source = arguments[i];
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }

    return obj;
  };

  /**
   * Simple string formatting function. Replaces all occurances of ${token}
   * with values from a context object.
   *
   * @param {String} str
   *  The input string, containing tokens to be replace.
   * @param {Object} o
   *  Token values to be substituted into the input string.
   * @return {String}
   */
  piewpiew.printf = function(str, o) {
    for (var t in o) {
      var re = new RegExp("\\$\\{" + t + "\\}", "g");
       str = str.replace(re, o[t]);
    }
    return str;
  };

  /**
   * Helper function used by other piewpiew modules to resolve config values.
   * Modules will often have a config object, containing various configuration
   * options, like templates, message string and so on. Sometimes these values
   * are scalars, sometimes they are complex types, and sometimes they are
   * functions that need to be executed at call time in order to return the
   * actual config value. Modules can pass the config item to this function and
   * it will derive the value of the config item based on its type.
   */
  piewpiew.configValue = function(configItem) {
    // If the item is a function, call it and return the return value
    if (typeof configItem == 'function') {
      return configItem();
    }
    return configItem;
  };

  /**
   *  piewpiew.Class
   *  --------------------------------------------------------------------------
   *  Utility function for defining 'Classes'. 
   */
  var initializing = false;
    
  piewpiew.Class = function() {
    var methods = null;
    var parent  = null;
                
    /**
     * Default constructor for our new class. All classes created using the 
     * piewpiew.Class() method will share this constructor.
     */
    var klass = function() {
      if(!initializing) {
        this.initialize.apply(this, arguments);
      }
    };
      
    /**
     * If the first argument is a function, assume it is the "class" from which 
     * the new class will inherit. In this case the second argument is an object 
     * containing the methods and properties for the new class.
     *
     * If the first argument is not a function, then we interpret it as an 
     * object containing the methods and properties of the new class
     */
    if (typeof arguments[0] === 'function') {
      parent = arguments[0];
      methods = arguments[1];
    } else {
      methods = arguments[0];
    }

    if (parent) {
      // Set the initializing flag to prevent the normal initialization methods 
      // firing when creating the new prototype object
      initializing = true;
      klass.prototype = new parent();
      initializing = false;
    }

    extend(klass.prototype, methods);
    
    klass.prototype.constructor = klass;

    if (!klass.prototype.initialize) {
      klass.prototype.initialize = function(){};
    } 

    klass.extend = function(o) {
      return piewpiew.Class(this, o);
    }

    return klass;
  };

  /**
   * Implementation of define. This defininition will be used if no dedicated
   * module loading library, such as requirejs is used. This implementation does
   * not actually load external scripts, and relies on us to ensure that we
   * specify the correct order of our external scripts. The recommeded way to
   * work with piewpiew is to use a dedicated AMD library, like requirejs
   */
  piewpiew.define = function(module, dependencies, fn) {
    if (typeof define === 'function' && define.amd) {
      define(module, dependencies, fn);
    } else {
      if (dependencies && dependencies.length) {
        for (var i = 0; i < dependencies.length; i++) {
          dependencies[i] = modules[dependencies[i]];
        }
      }
      modules[module] = fn.apply(this, dependencies || []);
    }
  };

  global.piewpiew = piewpiew;

  if (typeof exports != 'undefined') {
    exports.piewpiew = piewpiew;
  }

  if (typeof define === 'undefined') {
    global.define = piewpiew.define;
  }

  piewpiew.define('piewpiew.core', [], function() { return piewpiew });

}(typeof window === 'undefined' ? this : window));