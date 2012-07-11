module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadTasks( "build/tasks" );

  grunt.initConfig({
    pkg : '<json:package.json>',

    meta: {
      banner: '/*! \n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
              '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
              '<%= pkg.homepage ? " * " + pkg.homepage + "\n" : "" %>' +
              ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' +
              ' */'
    },

    dirs : {
      src : 'src',
      dest : 'dist'
    },

    lint : {
      all : ['grunt.js', '<%= dirs.src %>/**/*.js']
    },

    concat : {
      dist : {
        src : [
          "<banner>",
          
          "<%= dirs.src %>/piewpiew.core.js",
        
          "<%= dirs.src %>/piewpiew.views.Helpers.js",
          "<%= dirs.src %>/piewpiew.views.Region.js",
          "<%= dirs.src %>/piewpiew.views.View.js",
          "<%= dirs.src %>/piewpiew.views.CollectionView.js",
          "<%= dirs.src %>/piewpiew.views.FormView.js",
          "<%= dirs.src %>/piewpiew.views.Layout.js",
          "<%= dirs.src %>/piewpiew.views.js",
    
          "<%= dirs.src %>/piewpiew.forms.js",
          "<%= dirs.src %>/piewpiew.forms.fields.js",
          "<%= dirs.src %>/piewpiew.models.js",

          "<%= dirs.src %>/piewpiew.validators.js",

          "<%= dirs.src %>/piewpiew.models.fields.js" ,
          "<%= dirs.src %>/piewpiew.controllers.js",
          "<%= dirs.src %>/piewpiew.application.js",
          "<%= dirs.src %>/piewpiew.config.js"
        ],
        dest : '<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    clean : {
      examples : {
        src : [
          'examples/requirejs/js/libs/*.js'
        ]
      }
    },

    copy : {
      examples : {
        src : [
          'lib/**/*.js',
          '<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.min.js',
          'node_modules/underscore/underscore-min.js',
          'node_modules/backbone/backbone-min.js'
        ],
        dest : 'examples/requirejs/js/libs/',
        strip : /(^dist|^lib|^node_modules\/underscore|^node_modules\/backbone|^node_modules\/requirejs)/
      }
    },

    min : {
      dist : {
        src : ["<banner>", "<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.js"],
        dest : '<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },

    mocha : {
      all : {
        src : ['test/index.html']
      }
    }
  });

  /**
   * Run tests
   */
  grunt.registerTask('test', 'mocha:all');

  /**
   * Build the piewpiew library
   */
  grunt.registerTask('build-lib', 'lint:all concat:dist min:dist');
  
  /**
   * Build the examples - will also build the library
   */
  grunt.registerTask('build-examples', 'build-lib clean:examples copy:examples');

  /**
   * Default task. Run build-examples, which also build the lib(s)
   */
  grunt.registerTask('default', 'build-examples');
};

