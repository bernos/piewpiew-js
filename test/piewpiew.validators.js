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

      test('Default validation messages are correct', function() {
        var v = new validators.StringValidator({
          maxLength : 3
        });

        var errors = v.validate("asdf");

        assert.ok(errors.length == 1 && errors[0] == "String must have no more than 3 characters");

        v.maxLength = -1;
        v.minLength = 3;

        errors = v.validate("a");

        assert.ok(errors.length == 1 && errors[0] == "String must have at least 3 characters");

        v.maxLength = 3;
        v.minLength = 1;

        errors = v.validate("asdfddd");

        assert.ok(errors.length == 1 && errors[0] == "String must have between 1 and 3 characters");
      });
    });
    
    suite('EmailValidator', function() {
      test('Allows valid email addresses', function() {
        var v = new validators.EmailValidator();

        assert.equal(v.validate("email@example.com").length, 0, "email@example.com");
        assert.equal(v.validate("firstname.lastname@example.com").length, 0, "firstname.lastname@example.com");
        assert.equal(v.validate("email@subdomain.example.com").length, 0, "email@subdomain.example.com");
        assert.equal(v.validate("firstname+lastname@example.com").length, 0, "firstname+lastname@example.com");
        //assert.equal(v.validate("email@123.123.123.123").length, 0, "email@123.123.123.123");
        assert.equal(v.validate("email@[123.123.123.123]").length, 0, "email@[123.123.123.123]");
        assert.equal(v.validate("“email”@example.com").length, 0, "“email”@example.com");
        assert.equal(v.validate("1234567890@example.com").length, 0, "1234567890@example.com");
        assert.equal(v.validate("email@example-one.com").length, 0, "email@example-one.com");
        assert.equal(v.validate("_______@example.com").length, 0, "_______@example.com");
        assert.equal(v.validate("email@example.name").length, 0, "email@example.name");
        assert.equal(v.validate("email@example.museum").length, 0, "email@example.museum");
        assert.equal(v.validate("email@example.co.jp").length, 0, "email@example.co.jp");
        assert.equal(v.validate("firstname-lastname@example.com").length, 0, "firstname-lastname@example.com");

        // Some unusual but valid addresses
        //assert.equal(v.validate("much.”more\\ unusual”@example.com").length, 0, "much.”more\\ unusual”@example.com");
        //assert.equal(v.validate("very.unusual.”@”.unusual.com@example.com").length, 0, "very.unusual.”@”.unusual.com@example.com");
        //assert.equal(v.validate("very.”(),:;<>[]”.VERY.”very@\\\\ \"very”.unusual@strange.example.com").length, 0, "very.”(),:;<>[]”.VERY.”very@\\\\ \"very”.unusual@strange.example.com");


      });

      test('Denies invalid email addresses', function() {
        var v = new validators.EmailValidator();
        
        assert.notEqual(v.validate("plainaddress").length, 0, "plainaddress");
        assert.notEqual(v.validate("#@%^%#$@#$@#.com").length, 0, "#@%^%#$@#$@#.com");
        assert.notEqual(v.validate("@example.com").length, 0, "@example.com");
        assert.notEqual(v.validate("Joe Smith <email@example.com>").length, 0, "Joe Smith <email@example.com>");
        assert.notEqual(v.validate("email.example.com").length, 0, "email.example.com");
        assert.notEqual(v.validate("email@example@example.com").length, 0, "email@example@example.com");
        assert.notEqual(v.validate(".email@example.com").length, 0, ".email@example.com");
        assert.notEqual(v.validate("email.@example.com").length, 0, "email.@example.com");
        assert.notEqual(v.validate("email..email@example.com").length, 0, "email..email@example.com");
        //assert.notEqual(v.validate("あいうえお@example.com").length, 0, "あいうえお@example.com");
        assert.notEqual(v.validate("email@example.com (Joe Smith)").length, 0, "email@example.com (Joe Smith)");
        assert.notEqual(v.validate("email@example").length, 0, "email@example");
        //assert.notEqual(v.validate("email@-example.com").length, 0, "email@-example.com");
        //assert.notEqual(v.validate("email@example.web").length, 0, "email@example.web");
        assert.notEqual(v.validate("email@111.222.333.44444").length, 0, "email@111.222.333.44444");
        assert.notEqual(v.validate("email@example..com").length, 0, "email@example..com");
        assert.notEqual(v.validate("Abc..123@example.com").length, 0, "Abc..123@example.com");
        assert.notEqual(v.validate("").length, 0);
        assert.notEqual(v.validate("”(),:;<>[\\]@example.com").length, 0, "”(),:;<>[\\]@example.com");
        //assert.notEqual(v.validate("just”not”right@example.com").length, 0, "just”not”right@example.com");
        assert.notEqual(v.validate("this\\ is\"really\"not\\allowed@example.com").length, 0, "this\\ is\"really\"not\\allowed@example.com");
      });
    });

  });


});