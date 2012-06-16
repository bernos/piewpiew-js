/**
 * Because the piewpiew library will make use of requirejs and node also defines
 * a "native" implementation of the require() global function, we need to import
 * requirejs under the alternative name 'requirejs' and use requirejs() when
 * importing our libraries to test. We also need to set up requirejs config to
 * enable conpatibility with node's require() function
 */
var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: 'src/'
});

requirejs(['assert', 'piewpiew.config'], function(assert, config) {

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
  
  suite('piewpiew.config', function() {
    suite('constructor', function() {
      test('Instance should report itself as an instanceof piewpiew.config.Config', function() {
        var c = new config.Config({});
        assert.notEqual(c, null, "Config was not constructed");
        assert.ok(c instanceof config.Config);
      });
    });
  });

});