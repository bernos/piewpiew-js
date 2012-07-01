describe('View Helpers', function() {
  
  function testDomOutput($, expected, actual) {
    var el = $('<div/>');
    el.append(actual);
    $('#output').append(el);
    expect(el.html()).to.equal(expected);
  }

  /**
   * Creates an html helper test function from the name of a helper, the expected
   * html output, and arguments for the helper. Saves a bunch of typing
   */
  function htmlHelperTest(helperName, expectedHtml, helperArgs) {
    return function() {
      require(['jquery', 'piewpiew.views.Helpers'], function($, helpers) {
        var str = helpers.Html[helperName].apply(helpers.Html, helperArgs);

        testDomOutput($, expectedHtml, str);
      });
    };
  }
  
  describe('HTML.label', function() {
    var expected = '<label for="some-id" class="one two three">My Label</label>';
    var args = ["some-id", "My Label", {
      classes: ['one', 'two', 'three']
    }];

    it('Should render to the dom', htmlHelperTest('label', expected, args));
  });

  describe('HTML.checkbox', function() {
    var expected = '<label class="checkbox"><input name="mycheckbox" type="checkbox" value="myvalue" class="one two three" checked="checked">Check this out</label>';
    var args = ["Check this out", "mycheckbox", "myvalue", true, {
      classes: ['one', 'two', 'three']
    }];

    it('Should render to the dom', htmlHelperTest('checkbox', expected, args));
  });

  describe('HTML.radioButton', function() {
    var expected = '<label class="radio"><input name="myradiobutton" type="radio" value="myvalue" class="one two three" checked="checked">Radio action</label>';
    var args = ["Radio action", "myradiobutton", "myvalue", true, {
      classes: ['one', 'two', 'three']
    }];

    it('Should render to the dom', htmlHelperTest('radioButton', expected, args));
  });

  describe('HTML.hidden', function() {
    var expected = '<input type="hidden" name="myname" value="myvalue">';
    var args = ["myname", "myvalue"];

    it('Should render to the dom', htmlHelperTest('hidden', expected, args));
  });

  describe('HTML.selectList', function() {
    var expected = '<select name="mylist" id="mylistid" class="class-one class-two"><option value="one">Option one</option><option value="two" selected="selected">Option two</option><option value="three">Option three</option></select>';
    var options = [
      {value: "one", label : "Option one"},
      {value: "two", label : "Option two"},
      {value: "three", label: "Option three"}
    ];

    var args = ["mylist", options, "two", false, {
      id: 'mylistid',
      classes : ['class-one', 'class-two']
    }];

    it('Should render to the dom', htmlHelperTest('selectList', expected, args));

    expected = '<select name="mylist" id="mylistid" class="class-one class-two" multiple="multiple"><optgroup label="Group one"><option value="one">Option one</option><option value="two" selected="selected">Option two</option><option value="three">Option three</option></optgroup><optgroup label="Group two"><option value="four" selected="selected">Option four</option><option value="five">Option five</option><option value="six">Option six</option></optgroup></select>';

    options = {
      "Group one" : [
        {value: "one", label : "Option one"},
        {value: "two", label : "Option two"},
        {value: "three", label: "Option three"}
      ],
      "Group two" : [
        {value: "four", label : "Option four"},
        {value: "five", label : "Option five"},
        {value: "six", label: "Option six"}
      ]
    };

    args = ["mylist", options, ["two", "four"], true, {
      id: 'mylistid',
      classes : ['class-one', 'class-two']
    }];

    it('Should render to the dom', htmlHelperTest('selectList', expected, args));


  });

  describe('HTML.radioButtonList', function() {
    var expected = "";
    var options = [
      {value: "one", label : "Option one"},
      {value: "two", label : "Option two"},
      {value: "three", label: "Option three"}
    ];
    var args = ["myradiolist", options, "two"];
    it('should render into the dom',  htmlHelperTest('radioButtonList', expected, args));
  });

  describe('HTML.checkboxList', function() {
    var expected = "";
    var options = [
      {value: "one", label : "Option one"},
      {value: "two", label : "Option two"},
      {value: "three", label: "Option three"}
    ];
    var args = ["mycheckboxList", options, ["one", "three"]];
    it('should render into the dom',  htmlHelperTest('checkboxList', expected, args));
  });

  

  describe('HTML.passwordField', function() {
    var expected = '<label for="some-id" class="one two three">My Label</label>';
    var args = ["mytextfield", "My textfield", {
      classes: ['one', 'two', 'three']
    }];

    it('Should render to the dom', htmlHelperTest('passwordField', expected, args));
  });

  describe('HTML.submitButton', function() {
    var expected = '<label for="some-id" class="one two three">My Label</label>';
    var args = ["submit", "Submit it!", {
      classes: ['one', 'two', 'three']
    }];

    it('Should render to the dom', htmlHelperTest('submitButton', expected, args));
  });

  describe('HTML.textfield', function() {
    var expected = '<label for="some-id" class="one two three">My Label</label>';
    var args = ["mytextfield", "My textfield", {
      classes: ['one', 'two', 'three']
    }];

    it('Should render to the dom', htmlHelperTest('textfield', expected, args));
  });

  describe('HTML.textarea', function() {
    var expected = '<label for="some-id" class="one two three">My Label</label>';
    var args = ["mytextarea", "My textarea\ncontent here", {
      classes: ['one', 'two', 'three']
    }];

    it('Should render to the dom', htmlHelperTest('textarea', expected, args));
  });

  describe('HTML.input', function() {
    var expected = '<label for="some-id" class="one two three">My Label</label>';
    var args = ["date", "myinput", "Value here", {
      classes: ['one', 'two', 'three']
    }];

    it('Should render to the dom', htmlHelperTest('input', expected, args));
  });

  describe('HTML.file', function() {
    var expected = '<label for="some-id" class="one two three">My Label</label>';
    var args = ["myfile", {
      classes: ['one', 'two', 'three']
    }];

    it('Should render to the dom', htmlHelperTest('file', expected, args));
  });

  describe('HTML.button', function() {
    var expected = '<label for="some-id" class="one two three">My Label</label>';
    var args = ["mybutton", "hello", {
      classes: ['one', 'two', 'three']
    }];

    it('Should render to the dom', htmlHelperTest('button', expected, args));
  });


});
