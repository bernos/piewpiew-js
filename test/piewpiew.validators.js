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

requirejs(['assert', 'piewpiew.validators'], function(assert, validators) {

  suite('piewpiew.validators', function() {
    suite('StringValidator', function() {
      test('Allows unbounded string lengths', function() {
        var v = new validators.StringValidator();
        var errors = v.validate("");
        assert.equal(errors.length, 0);
      });

      test('Validates max length', function() {
        var v = new validators.StringValidator({
          maxLength: 4
        });
        
        assert.equal(v.validate("abcd").length, 0);
        assert.notEqual(v.validate("abcde").length, 0);
      });

      test('Validates min length', function() {
        var v = new validators.StringValidator({
          minLength: 4
        });
        
        assert.notEqual(v.validate("abc").length, 0);
        assert.equal(v.validate("abcd").length, 0);
        assert.equal(v.validate("abcde").length, 0);
      });

      test('Validates between min and max length', function() {
        var v = new validators.StringValidator({
          minLength: 4,
          maxLength: 6
        });
        
        assert.notEqual(v.validate("abc").length, 0);
        assert.notEqual(v.validate("abcdefg").length, 0);

        assert.equal(v.validate("abcd").length, 0);
        assert.equal(v.validate("abcde").length, 0);
        assert.equal(v.validate("abcdef").length, 0);
      });
    });
  });


});