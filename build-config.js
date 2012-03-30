{
  "src-folder"  : "src",

  "dest-folder" : "dist",

  "modules" : {

    "piewpiew.core" : {
      "version" : "0.0.1",
      "input-files" : [
        "piewpiew.core.js"
      ],
      "uglify" : true, 
      "uglify-js-options" : {
        "strict_semicolons" : false
      }
    },

    "piewpiew.backbone" : {
      "version" : "0.0.1",
      "uglify" : false, 
      "input-files" : [
        "piewpiew.core.js",
        "piewpiew.backbone.js",
        "piewpiew.backbone.models.js",
        "piewpiew.backbone.models.validators.js",
        "piewpiew.backbone.models.fields.js",
        "piewpiew.backbone.views.js",
        "piewpiew.backbone.views.helpers.js"
      ]
    }
  },

  "examples" : {
    "test" : {
      "copy" : {
        "dist/piewpiew.backbone-0.0.1.min.js" : "examples/test/js/piewpiew.backbone-0.0.1.min.js"
      }
    }
  }
}