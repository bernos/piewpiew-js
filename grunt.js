module.exports = function(grunt) {

  grunt.initConfig({
    pkg : '<json:package.json>',

    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
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
          "<banner>"
          
          ,"<%= dirs.src %>/piewpiew.core.js"        
        
          ,"<%= dirs.src %>/piewpiew.views.Helpers.js"
          ,"<%= dirs.src %>/piewpiew.views.Region.js"
          ,"<%= dirs.src %>/piewpiew.views.View.js"
          ,"<%= dirs.src %>/piewpiew.views.CollectionView.js"
          ,"<%= dirs.src %>/piewpiew.views.FormView.js"
          ,"<%= dirs.src %>/piewpiew.views.Layout.js"
          ,"<%= dirs.src %>/piewpiew.views.js"
    
          ,"<%= dirs.src %>/piewpiew.forms.js"
          ,"<%= dirs.src %>/piewpiew.forms.fields.js"
          ,"<%= dirs.src %>/piewpiew.models.js"

          ,"<%= dirs.src %>/piewpiew.validators.js"

          ,"<%= dirs.src %>/piewpiew.models.fields.js" 
          ,"<%= dirs.src %>/piewpiew.controllers.js"
          ,"<%= dirs.src %>/piewpiew.application.js"
          ,"<%= dirs.src %>/piewpiew.config.js"
        ],
        dest : '<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.js'
      },

      examples : {
        src : "<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.min.js",
        dest : "examples/requirejs/js/libs/piewpiew/<%= pkg.name %>-<%= pkg.version %>.min.js"
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
        src : 'test/**/*.js',
        options : {
          globals : ['piewpiew'],
          ui : 'tdd',
          reporter : 'spec'
        }        
      }
    }
  });

  grunt.registerTask('default', 'mocha:all concat:dist min:dist concat:examples');

  grunt.loadTasks('tasks');
}

