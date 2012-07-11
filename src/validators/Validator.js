/**
 * Base Validator class
 * --------------------------------------------------------------------------
 */
define([
  'piewpiew.core'
],

function(piewpiew) {

  return piewpiew.Class({
    
    initialize: function(options) {
      options = options || {};
      options.messages = options.messages || {};

      piewpiew.extend(this, options);

      this.messages = this.defaultMessages();

      piewpiew.extend(this.messages, options.messages);
    },

    defaultMessages: function() {
      return {};
    },

    validate: function(value) {
      return [];
    }
  });
});