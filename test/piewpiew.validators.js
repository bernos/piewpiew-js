describe('Validators', function() {

  describe('StringValidator', function() {
    
    it("Should allow unbounded string lengths", function(done) {
      require(['piewpiew.validators'], function(validators) {
        var v = new validators.StringValidator();
        expect(v.validate("").length).to.eq(0);
        done();
      });
    });

    it("Should validate max length", function(done) {
      require(['piewpiew.validators'], function(validators) {
        var v = new validators.StringValidator({
          maxLength: 4
        });

        expect(v.validate("abcd").length).to.eq(0);
        expect(v.validate("abcde").length).not.to.eq(0);

        done();
      });
    });

    it("Should validate min length", function(done) {
      require(['piewpiew.validators'], function(validators) {
        var v = new validators.StringValidator({
          minLength: 4
        });
        
        expect(v.validate("abc").length).not.to.eq(0);
        expect(v.validate("abcd").length).to.eq(0);
        expect(v.validate("abcde").length).to.eq(0);

        done();
      });
    });

    it("Should validate between min and max length", function(done) {
      require(['piewpiew.validators'], function(validators) {
        var v = new validators.StringValidator({
          minLength: 4,
          maxLength: 6
        });
        
        expect(v.validate("abc").length).not.to.eq(0);
        expect(v.validate("abcdefg").length).not.to.eq(0);

        expect(v.validate("abcd").length).to.eq(0);
        expect(v.validate("abcde").length).to.eq(0);
        expect(v.validate("abcdef").length).to.eq(0);

        done();
      });
    });

    it("Should elicit appropriate validation error messages", function(done) {
      require(['piewpiew.validators'], function(validators) {
        var v = new validators.StringValidator({
          maxLength : 3
        });

        var errors = v.validate("asdf");

        expect(errors.length == 1 && errors[0] == "String must have no more than 3 characters").to.eq(true);

        v.maxLength = -1;
        v.minLength = 3;

        errors = v.validate("a");

        expect(errors.length == 1 && errors[0] == "String must have at least 3 characters").to.eq(true);

        v.maxLength = 3;
        v.minLength = 1;

        errors = v.validate("asdfddd");

        expect(errors.length == 1 && errors[0] == "String must have between 1 and 3 characters").to.eq(true);

        done();
      });
    });   

  });

  describe('EmailValidator', function() {

    it("Should allow valid email addresses", function(done) {
      require(['piewpiew.validators'], function(validators) {

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
        
        done();
      });
    });

    it("Should detect invalid email addresses", function(done) {
      require(['piewpiew.validators'], function(validators) {
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
        
        done();
      });
    });

  });
});