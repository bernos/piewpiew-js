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
       *
       * @param {Object} htmlAttributes
       *  Object containing html attributes to stringify
       * @return {String}
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

      // TODO: there should be a better way to handle model editors. The generic
      // ModelForm class should really be able to handle this
      editorForModel: function(model) {
        return Template.renderTemplate(
          model.editorTemplate(), 
          model.editorTemplateContext()
        );
      },

      /**
       * Renders a form field from the piewpiew.forms.fields module. This helper
       * formats the field value and html attributes and passes them to the 
       * form field instance to do the actual rendering. Generally speaking most
       * form fields will use the other Html helpers to render their controls
       *
       * @param {piewpiew.forms.Form} form
       *  The form that we'll extract the field value from
       * @param {piewpiew.forms.fields.Field} field
       *  The field that we want to render
       * @param {Object} htmlAttributes
       *  Any extra html attributes to render 
       * @return {String} The rendered html form element
       */
      formField: function(form, field, htmlAttributes) {
        htmlAttributes || (htmlAttributes = {});
        htmlAttributes.classes || (htmlAttributes.classes = []);   
        htmlAttributes.classes.push("control");
        htmlAttributes.classes.push("control-for-" + field.name);

        return field.render(form.get(field.name), htmlAttributes);
      },

      /**
       * Renders an HTML <hidden> element
       * 
       * @param {String} name
       *  Name attribute for the element
       * @param {String} value
       *  Value attribute for the element
       * @return {String} The rendered element
       */
      hidden: function(name, value) {
        return piewpiew.printf('<hidden name="${name}" value="${value}"/>', {
          name:name,
          value:value
        });
      },

      /**
       * Renders an HTML <label> element
       *
       * @param {String} name
       *  Name attribute for the element
       * @param {String} value
       *  Value attribute for the element
       * @param {Object} htmlAttributes
       *  Object containing extra html attributes to add to the element
       * @return {String} The rendered element
       */
      label: function(name, value, htmlAttributes) {        
        return piewpiew.printf('<label for="${name}" ${attributes}>${value}</label>', {
          name: name,
          value: value,
          attributes: this.attributeString(htmlAttributes)
        });
      },

      /**
       * Renders an HTML <select> element
       *
       * @param {String} name
       *  Name attribute for the element
       * @param {String} options
       *  An object containing name/values for the select list options. Format
       *  of the object is a simple { name: value, name: value }
       * @param {String} selectedOption
       *  The name of the selected option
       * @param {Object} htmlAttributes
       *  Object containing extra html attributes to add to the element
       * @return {String} The rendered element
       */
      selectList: function(name, options, selectedOption, htmlAttributes) {
        var output = piewpiew.printf('<select name="${name} ${attributes}>', {
          name: name,
          attributes: this.attributeString(htmlAttributes) 
        });

        for(var n in options) {
          var selected = (n == selectedOption) ? ' selected="selected"' : '';

          output += piewpiew.printf('<option value="${value}"${selected}>${label}</option>', {
            value: n,
            label: options[n],
            selected: selected
          });
        }

        output += '</select>';

        return output;
      },

      /**
       * Renders an HTML textfield element
       *
       * @param {String} name
       *  Name attribute for the element
       * @param {String} value
       *  Value attribute for the element
       * @param {Object} htmlAttributes
       *  Object containing extra html attributes to add to the element
       * @return {String} The rendered element
       */
      textfield: function(name, value, htmlAttributes) {
        return piewpiew.printf('<input name="${name}" type="text" value="${value}" ${attributes}/>', {
          name: name,
          value:  (value != null) ? value : "",
          attributes: this.attributeString(htmlAttributes)
        });
      },

      /**
       * Renders an HTML textarea element
       *
       * @param {String} name
       *  Name attribute for the element
       * @param {String} value
       *  Value attribute for the element
       * @param {Object} htmlAttributes
       *  Object containing extra html attributes to add to the element
       * @return {String} The rendered element
       */
      textarea: function(name, value, htmlAttributes) {
        return piewpiew.printf('<textarea name="${name}" ${attributes}>${value}</textarea>', {
          name: name,
          value: value,
          attributes: this.attributeString(htmlAttributes)
        });
      }


    }    
  };
});