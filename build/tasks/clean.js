module.exports = function(grunt) {

  grunt.registerMultiTask("clean", "remove files from output directory.", function() {
    var fs = require('fs');
    var files = grunt.file.expandFiles(this.file.src);

    files.forEach(function(filename) {
      grunt.log.writeln("Deleting " + filename);
      fs.unlinkSync(filename);
    });

  });

}