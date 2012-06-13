all: test js

js:
	node ./build.js

test:
	node ./node_modules/mocha/bin/mocha --reporter spec --globals piewpiew --ui tdd --require assert

.PHONY: test js