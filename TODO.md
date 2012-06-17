----
TODO
----

# Complete CollectionView
# Model fields need to be able to be models or collections.
# Replace piewpiew.printf with calls to piewpiew.template. One templating solution should suffice
  Either that or change printf to be more like printf("Here is {0} the {1} template", arg1, arg2);
# Allow for setting validation messages for default validators in field properties, rather than
  having to create custom validators.
# Create a listview

----
DONE
----
# Move template strings, validation messages and so forth into a config object.
  Each package/module could have it's own config. Eventually it would be sweet
  to be able to localise strings.
# piewpiew.backbone.models.js is getting too big. Split it up. Heres the dependency map
	
	piewpiew
		piewpiew.models.Model
		piewpiew.models.validators
			piewpiew.models.fields

---------------
TEST FRAMEWORKS
---------------

Mocha > Ended up using this as prefered solution, with chai.js as the test lib

* Works well from command line. Wrote some basic TDD tests in the /test folder. Got them
  running with grunt using the custom command in tasks/mocha.js
* This falls apart as soon as DOM manipulation is needed. Tried the grunt-mocha npm module
  but could not get it working.
* UPDATE: Got this working by adding a call to mocha.run() at the end of the mocha.helper
  file in the grunt-mocha module. mocha was not running correctly because the helper was
  being injected AFTER the call to mocha.run in the index.html test runner


Jasmine

* npm install grunt-jasmine-test
* Requires phantomjs
* Jasmine library lives in the spec library and is included in the spec runner html file
  just like any javascript would be. Had to make one change to the spec runner that ships
  with jasmine - only add the HtmlReporter if we are running in a real browser, otherwise
  messages never get passed back to grunt
* Async interface is really clumsy. Given that we use requirejs extensively and almost all
  test are async, this sucks