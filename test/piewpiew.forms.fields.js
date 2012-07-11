describe('forms.fields', function() {

  var _id = 0;

  function addToDom($, field, value) {
    // Generate uniqe id
    var id = "form-field-" + (_id++);
    var el = $('<div id="' + id + '"/>');

    // append to the dom
    el.append(field.render(value));
    $('#form-fields .output').append(el);

    // retrieve the appended el and return it
    return $('#' + id + ' *[name="' + field.name + '"]');
  }

  describe('TextField', function() {

    it('Should render to the DOM', function(done) {
      require(['jquery', 'forms/fields'], function($, fields) {
        var field = new fields.TextField({
          name: "textfield"
        });

        var $el = addToDom($, field, "Test Value");
        expect($el.val()).to.equal("Test Value");

        done();
      });
    });

    it('Should initialize default length validators', function(done) {
      require(['jquery', 'forms/fields'], function($, fields) {
        var field = new fields.TextField({
          name: "textfield",
          minLength: 4,
          maxLength: 6
        });

        expect(field.validate("aaa")).to.be.an.instanceof(Array);
        expect(field.validate("aaaaaaa")).to.be.an.instanceof(Array);
        expect(field.validate("aaaaa")).to.be.false;

        done();
      });
    });

    it('Should initialize default regex validator', function(done) {
      require(['jquery', 'forms/fields'], function($, fields) {
        var field = new fields.TextField({
          name: "textfield",
          regex: /^asdf?/
        });

        expect(field.validate("aaa")).to.be.an.instanceof(Array);
        expect(field.validate("asdf")).to.be.false;

        done();
      });
    });    
  });

  describe('EmailField', function() {

    it('Should render to the DOM', function(done) {
      require(['jquery', 'forms/fields'], function($, fields) {
        var field = new fields.EmailField({name:"email-field"});
        var $el = addToDom($, field, "bernos@gmail.com");

        expect($el.val()).to.equal("bernos@gmail.com");

        done();
      });
    });

    it('Should detect invalid email addresses', function(done) {
      require(['jquery', 'forms/fields'], function($, fields) {
        var field = new fields.EmailField({name:"email-field"});
        
        expect(field.validate("invalid email address")).to.be.an.instanceof(Array);

        done();
      });
    });
  });

  describe('PasswordField', function() {

    it('Should render to the DOM', function(done) {
      require(['jquery', 'forms/fields'], function($, fields) {
        var field = new fields.PasswordField({name:"password-field"});
        var $el = addToDom($, field, "asdf");

        expect($el.val()).to.equal("asdf");

        done();
      });
    });

    it('Should reject poor passwords', function(done) {
      require(['jquery', 'forms/fields'], function($, fields) {
        var field = new fields.PasswordField({name:"email-field"});
        
        expect(field.validate("badpassword")).to.be.an.instanceof(Array);
        expect(field.validate("abcdABCD1")).to.be.false;

        done();
      });
    });
  });

  describe('Select List', function() {

    it('Should render to the DOM', function(done) {
      require(['jquery', 'forms/fields'], function($, fields) {
        var field = new fields.SelectList({
          name:"select-list-field",
          options: {
            "Label one" : "value1",
            "Label two" : "value2",
            "Label three" : "value3"
          }
        });
        var $el = addToDom($, field, "value2");

        expect($el.val()).to.equal("value2");

        done();
      });
    });
  });

  describe('Multi Select List', function() {

    it('Should render to the DOM', function(done) {
      require(['jquery', 'forms/fields'], function($, fields) {
        var field = new fields.MultiSelectList({
          name:"select-list-field",
          options: {
            "Group One" : {
              "Label one" : "value1",
              "Label two" : "value2",
              "Label three" : "value3"
            },
            "Group two" : {
              "Label four" : "value4",
              "Label five" : "value5",
              "Label six" : "value6"
            }
          }
        });

        var val = ["value2", "value5"];
        var $el = addToDom($, field, val);

        expect($el.val()).to.equal(val);

        done();
      });
    });
  });
  
});
