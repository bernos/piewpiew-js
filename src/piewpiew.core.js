define(['underscore'], function(_) {
  var piewpiew = {};

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

    _.extend(klass.prototype, methods);
    
    klass.prototype.constructor = klass;

    if (!klass.prototype.initialize) {
      klass.prototype.initialize = function(){};
    } 

    klass.extend = function(o) {
      return piewpiew.Class(this, o);
    }

    return klass;
  };

  return piewpiew;
});