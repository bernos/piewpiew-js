define('piewpiew.views.Helpers', 
[
  'underscore', 
], 

function(_) {
  return {
    /**
     * Template processing function for all views. If you wish to use a templating
     * library other than the underscore template function (such as mustache etc)
     * just override this function
     *
     * @param {String} template
     *  The template string to be rendered
     * @param {Object} context
     *  The context object containing data to be rendered
     * @return {String} the rendered template
     */
    renderTemplate: function(template, context) {
      return _.template(template, this.templateContext(context));
    },

    /**
     * Builds a template context object by merging template data with our view helpers
     *
     * @param {object} data
     *  Template data
     * @return {object}
     */
    templateContext: function(data) {
      return _.extend(data, this);
    },
    
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
            
            if (typeof value.join == "function") value = value.join(" ");
          }
          buf.push(piewpiew.printf('${key}="${value}"', {key:key, value:value}));
        });

        return buf.join(" ");
      },

      editorForModel: function(model) {
        return Template.renderTemplate(
          model.editorTemplate(), 
          model.editorTemplateContext()
        );
      },

      formField: function(form, field, htmlAttributes) {
        console.log("formField ", field)
        htmlAttributes || (htmlAttributes = {});
        htmlAttributes.classes || (htmlAttributes.classes = []);   
        htmlAttributes.classes.push("control");
        htmlAttributes.classes.push("control-for-" + field.name);

        return field.render(form.get(field.name), htmlAttributes);
      },

      /**
       * Creates an editor control for a field, using the value of the field from
       * a particular model. The template used is determined by the value of the
       * field.editorTemplate property.

       DEPRECATED
       */
      editorForField: function(model, field, htmlAttributes) {

        htmlAttributes || (htmlAttributes = {});
        htmlAttributes.classes || (htmlAttributes.classes = []);   
        htmlAttributes.classes.push("control-group");
        htmlAttributes.classes.push("control-group-for-" + field.name);

        var context = field.editorTemplateContext(model);
        context.attributes = htmlAttributes;

        return Template.renderTemplate(field.editorTemplate(), context);
      },

      /**
       * Creates a form control for a field, using the value of the field from
       * a particular model. The template used is determined by the value of the
       * field.formControlTemplate property.

       DEPRECATED
       */
      formControlForField: function(model, field, htmlAttributes) {
        htmlAttributes || (htmlAttributes = {});
        htmlAttributes.classes || (htmlAttributes.classes = []);   
        htmlAttributes.classes.push("control");
        htmlAttributes.classes.push("control-for-" + field.name);

        var context = field.formControlTemplateContext(model);
        context.attributes = htmlAttributes;

        return Template.renderTemplate(field.formControlTemplate(), context);
      },

      /**
       * Creates a label for a field, using the value of the field from
       * a particular model. The template used is determined by the value of the
       * field.editorTemplate property.

       DEPRECTATED
       */
      labelForField: function(model, field, htmlAttributes) {
        htmlAttributes || (htmlAttributes = {});
        htmlAttributes.classes || (htmlAttributes.classes = []);   
        htmlAttributes.classes.push("control-label");

        var context = field.labelTemplateContext(model);
        context.attributes = htmlAttributes;

        return Template.renderTemplate(field.labelTemplate(), context); 
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
});