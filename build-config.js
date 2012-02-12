{
  "src-folder"  : "src",

  "dest-folder" : "dist",

  "modules" : 
  {

    "piewpiew-core" : {
      "version" : "0.0.2",
      "input-files" : [
        "piewpiew.core.js"
      ],
      "uglify-js-options" : {
        "strict_semicolons" : false
      }
    },

    "piewpiew-backbone" : {
      "version" : "0.0.2",
      "input-files" : [
        "piewpiew.backbone.js",
        "piewpiew.backbone.data.js"
      ]
    }
  }  
}