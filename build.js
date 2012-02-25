#!/usr/bin/env node

/**
 * Script build the project using the uglify-js node module.
 *
 * Requires that nodejs is installed
 *
 * Check out build-config.js for configuring build options.
 */

var MODULE_PATH = './build/node_modules';
var CONFIG_PATH = './build-config.js';
var fs = require('fs');
var uglify = require(buildModulePath('uglify-js'));

/**
 * Add a copy method to the filesystem library
 */
fs.copy = function (src, dst, cb) {

  var util = require('util');

  function copy(err) {
    var is
      , os
      ;

    if (!err) {
      return cb(new Error("File " + dst + " exists."));
    }

    fs.stat(src, function (err) {
      if (err) {
        return cb(err);
      }
      is = fs.createReadStream(src);
      os = fs.createWriteStream(dst);
      util.pump(is, os, cb);
    });
  }

  fs.stat(dst, copy);
};

main(loadConfig(CONFIG_PATH));

/**
 * Main entry point
 */
function main(config) {
  buildModules(config);
  buildExamples(config);
}

/**
 * builds each of the modules in our config
 */
function buildModules(config) {
  var modules = config.modules;
  
  // Iterate over all modules
  for (var name in modules) {
    buildModule(name, config.modules[name], config['src-folder'], config['dest-folder']);
  }
}

/**
 * builds the examples
 */
function buildExamples(config) {
  var examples = config.examples;

  for (var name in examples) {
    buildExample(examples[name]);
  }
}

/**
 * Loads our config file
 */
function loadConfig(path) {
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

function buildExample(example) {
  for(var src in example.copy) {
    try {
      fs.unlinkSync(example.copy[src]);
    } catch(e) {
      
    }
    fs.copy(src, example.copy[src], function(){});
  }
}

/**
 * Builds a single module.
 */
function buildModule(name, config, srcFolder, destFolder) {
  var destFile = name + '-' + config['version'] + '.min.js';

  if (null != config['input-files']) {
    var sourceString = concatFiles(srcFolder, config['input-files']);
    var uglifiedString = config['uglify'] ? uglify(sourceString, config['uglify-js-options']) : sourceString;
    var destPath = destFolder.replace(/\/$/,'') + '/' + destFile;

    // TODO: Remove old destFile...

    var id = fs.openSync(destPath, 'w');
    fs.writeSync(id, '/* ' + destFile + ' */\n' + uglifiedString);
    fs.closeSync(id);
  }
}

function concatFiles(baseFolder, files) {
  var parts = [];

  for(var i = 0, m = files.length; i < m; i++) {
    var fileName  = files[i];
    var inputFile = baseFolder.replace(/\/$/, '') + '/' + fileName.replace(/^\//);

    parts.push(fs.readFileSync(inputFile));
  }

  return parts.join("");  
}

function uglify(input, options) {
  var options = options || {};
  var jsp = uglify.parser;
  var pro = uglify.uglify;

  var ast = jsp.parse(inputFile, options.strict_semicolons); // parse code and get the initial AST
      ast = pro.ast_mangle(ast, options.mangle_options); // get a new AST with mangled names
      ast = pro.ast_squeeze(ast, options.squeeze_options); // get an AST with compression optimizations
    
  return pro.gen_code(ast, options.gen_options); // compressed code here
}

/**
 * Creates a path to a node module, allowing us to use a non-standard folder structure
 * Mainly designed to allow us to keep downloaded node modules concerned with building
 * our project tucked away in the build folder
 */
function buildModulePath(module) {
  return MODULE_PATH.replace(/\/$/, '') + '/' + module.replace(/^\//, '');
}

