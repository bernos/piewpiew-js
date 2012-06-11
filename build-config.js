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
        
        ,"piewpiew.views.Helpers.js"
        ,"piewpiew.views.Region.js"
        ,"piewpiew.views.View.js"
        ,"piewpiew.views.CollectionView.js"
        ,"piewpiew.views.FormView.js"
        ,"piewpiew.views.Layout.js"
        ,"piewpiew.views.js"

        ,"piewpiew.forms.js"
        ,"piewpiew.forms.fields.js"
        ,"piewpiew.models.js"       
        ,"piewpiew.models.validators.js"
        ,"piewpiew.models.fields.js" 
        ,"piewpiew.controllers.js"
        ,"piewpiew.application.js"
        ,"piewpiew.config.js"
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