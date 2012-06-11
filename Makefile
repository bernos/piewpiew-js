all: test-all js

js:
	node ./build.js

test-all:
	node ./node_modules/mocha/bin/mocha --reporter spec --globals piewpiew

.PHONY: test-all js