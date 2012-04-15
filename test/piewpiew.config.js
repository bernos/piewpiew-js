var requirejs = require('requirejs');

requirejs.config({
  nodeRequire: require,
  baseUrl: 'src/'
});

var should = requirejs('should');
var config = requirejs('piewpiew.config');

/**
 * Helper that creates default config options
 */
function defaultOptions() {
  return {
    development: {
      notInherited: "development value",    
    },

    testing: {
      notInherited: "testing value",
    },

    production: {
      notInherited: "production value", 
    }
  };
}

describe('Config', function(){

  describe('constructor', function(){

    /**
     * Simple constructor test. Ensures dependencies are
     * met and so forth.
     */
    it('should contruct', function() {      
      var c = new config.Config(defaultOptions());
      c.should.be.an.instanceof(config.Config);
    });    
  });

  describe('environment management', function() {
    it('should default to development environment configuration', function() {
      var c = new config.Config(defaultOptions());
      c.getEnvironment().should.equal(config.DEVELOPMENT)
    });

    it('should set environment based on constructor options', function() {
      var c = new config.Config({
        environment: config.TESTING
      });

      c.getEnvironment().should.equal(config.TESTING);
    })

    it('should be able to change environments', function() {
      var c = new config.Config(defaultOptions());
      c.setEnvironment(config.TESTING).getEnvironment().should.equal(config.TESTING);
    });
  });

  describe('value overrides', function() {
    it ('should override values for each environment', function() {
      var c = new config.Config(defaultOptions());
      c.get("notInherited", {}).should.equal("development value");
      c.setEnvironment(config.TESTING).get("notInherited", {}).should.equal("testing value");
      c.setEnvironment(config.PRODUCTION).get("notInherited", {}).should.equal("production value");
    });
  });


})