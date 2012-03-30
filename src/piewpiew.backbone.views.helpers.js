(function(root, factory) {
  // If AMD is available, use the define() method to load our dependencies 
  //and declare our module
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'piewpiew', 'piewpiew.backbone.views'], function(_, piewpiew, views) {
      return factory(root, _, piewpiew, views);
    });
  }
  // Otherwise we will attach our module to root, and pass references to our 
  // dependencies into the factory. We're assuming that our dependencies are 
  // also attached to root here, but they could come from anywhere 
  else 
  {    
    root.piewpiew = factory(root, _, piewpiew, piewpiew.views);
  }
})(this, function(root, _, piewpiew, views) {  

  /**
   * View helpers. These methods get attached to templateContext objects when they
   * are passed to view templates for rendering.
   */
  piewpiew.views.helpers = {
    Html: {
      /**
       * Creates an HTML attributes string from an object. Name:value pairs in the
       * object will be translated into name="value" in the attribute string. The
       * one exception is for css classes. An array of css class names can be stored
       * in the "classes" property of the attributes object and it will be parsed
       * into the appropriate class attribute.
       */
      attributeString: function(htmlAttributes) {
        var buf = [];

        _.each(htmlAttributes, function(value, key) {
          if (key == "classes") {
            key = "class";
            value = value.join(" ");
          }
          buf.push(piewpiew.printf('${key}="${value}"', {key:key, value:value}));
        });

        return buf.join(" ");
      },

      editorForModel: function(model) {
        return piewpiew.views.template(
          model.editorTemplate(), 
          piewpiew.views.TemplateContext(model.editorTemplateContext())
        );
      },

      /**
       * Creates an editor control for a field, using the value of the field from
       * a particular model. The template used is determined by the value of the
       * field.editorTemplate property.
       */
      editorForField: function(model, field, htmlAttributes) {
        htmlAttributes || (htmlAttributes = {});
        htmlAttributes.classes || (htmlAttributes.classes = []);   
        htmlAttributes.classes.push("control-group");
        htmlAttributes.classes.push("control-group-for-" + field.name);

        var context = piewpiew.views.TemplateContext(field.editorTemplateContext(model));
        context.attributes = htmlAttributes;

        return piewpiew.views.template(field.editorTemplate(), context);
      },

      /**
       * Creates a form control for a field, using the value of the field from
       * a particular model. The template used is determined by the value of the
       * field.formControlTemplate property.
       */
      formControlForField: function(model, field, htmlAttributes) {
        htmlAttributes || (htmlAttributes = {});
        htmlAttributes.classes || (htmlAttributes.classes = []);   
        htmlAttributes.classes.push("control");
        htmlAttributes.classes.push("control-for-" + field.name);

        var context = piewpiew.views.TemplateContext(field.formControlTemplateContext(model));
        context.attributes = htmlAttributes;

        return piewpiew.views.template(field.formControlTemplate(), context);
      },

      /**
       * Creates a label for a field, using the value of the field from
       * a particular model. The template used is determined by the value of the
       * field.editorTemplate property.
       */
      labelForField: function(model, field, htmlAttributes) {
        htmlAttributes || (htmlAttributes = {});
        htmlAttributes.classes || (htmlAttributes.classes = []);   
        htmlAttributes.classes.push("control-label");

        var context = piewpiew.views.TemplateContext(field.labelTemplateContext(model));
        context.attributes = htmlAttributes;

        return piewpiew.views.template(field.labelTemplate(), context); 
      },

      hidden: function(name, value) {
        return piewpiew.printf('<hidden name="${name}" value="${value}"/>', {
          name:name,
          value:value
        });
      },

      label: function(name, value, htmlAttributes) {        
        return piewpiew.printf('<label for="${name}" ${attributes}>${value}</label>', {
          name: name,
          value: value,
          attributes: this.attributeString(htmlAttributes)
        });
      },

      textfield: function(name, value, htmlAttributes) {
        return piewpiew.printf('<input name="${name}" type="text" value="${value}" ${attributes}/>', {
          name: name,
          value:  (value != null) ? value : "",
          attributes: this.attributeString(htmlAttributes)
        });
      }
    }
  };

  return piewpiew;
});














































