{
  "src-folder"  : "src",

  "dest-folder" : "dist",

  "modules" : {

    "piewpiew" : {
      "version" : "0.0.1",
      "uglify" : false, 
      "uglify-js-options" : {
        "strict_semicolons" : false
      },
      "input-files" : [
        "piewpiew.core.js"
        ,"piewpiew.models.js"       
        ,"piewpiew.models.validators.js"
        ,"piewpiew.models.fields.js" 
        ,"piewpiew.views.js"
        ,"piewpiew.views.helpers.js"
        ,"piewpiew.controllers.js"
        ,"piewpiew.application.js"
      ]
    }   
  },

  "examples" : {
    "test" : {
      "copy" : {
        "dist/piewpiew.backbone-0.0.1.min.js" : "examples/test/js/piewpiew.backbone-0.0.1.min.js"
      }
    },
    "script-tag" : {
      "copy" : {
        "dist/piewpiew-0.0.1.min.js" : "examples/script-tag/js/piewpiew-0.0.1.min.js"
      }
    },
    "requirejs" : {
      "copy" : {
        "dist/piewpiew-0.0.1.min.js" : "examples/requirejs/js/libs/piewpiew/piewpiew-0.0.1.min.js"
      }
    }
  }
}