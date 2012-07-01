define('piewpiew.views.Helpers',
[
  'underscore'
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
        htmlAttributes = htmlAttributes || {};
        htmlAttributes.classes = htmlAttributes.classes || [];
        htmlAttributes.classes.push("control");
        htmlAttributes.classes.push("control-for-" + field.name);

        return field.render(form.get(field.name), htmlAttributes);
      },

      /**
       * Renders an HTML button element
       *
       * @param {String} name
       *  Name attribute for the element
       * @param {String} value
       *  Value attribute for the element
       * @param {Object} htmlAttributes
       *  Object containing extra html attributes to add to the element
       * @return {String} The rendered element
       */
      button: function(name, value, htmlAttributes) {
        return this.input("button", name, value || "", htmlAttributes);
      },

      /**
       * Renders an HTML checkbox element
       *
       * @param {String} name
       *  Name attribute for the element
       * @param {String} value
       *  Value attribute for the element
       * @param {Object} htmlAttributes
       *  Object containing extra html attributes to add to the element
       * @return {String} The rendered element
       */
      checkbox: function(label, name, value, checked, htmlAttributes) {
        htmlAttributes = htmlAttributes || {};

        if (checked) {
          htmlAttributes.checked = "checked";
        }

        return piewpiew.printf('<label class="checkbox">${input}${label}</label>', {
          label: label,
          input: this.input("checkbox", name, value || "", htmlAttributes)
        });
      },

      /**
       * Renders a list of HTML checkbox elements
       *
       * @param {String} name
       *  Name attribute for the element
       * @param {Array} options
       *  An array of checkbox options. Each option is an object containing
       *  label, value and htmlAttributes properties
       * @param {string} selectedOptions
       *  An array of values of the selected options
       * @return {String} The rendered element
       */
      checkboxList: function(name, options, selectedOptions, htmlAttributes) {
        htmlAttributes = htmlAttributes || {};
        htmlAttributes.classes = htmlAttributes.classes || [];
        htmlAttributes.classes.push("checkbox-list");

        var str = piewpiew.printf('<div ${attributes}>', {
          attributes: this.attributeString(htmlAttributes)
        }), checked;

        for(var i = 0, m = options.length; i < m; i++) {
          checked = _.any(selectedOptions, function(value) {
            return value == options[i].value;
          });

          str += this.checkbox(options[i].label, name, options[i].value, checked, options[i].htmlAttributes);
        }

        str += '</div>';

        return str;
      },

      /**
       * Renders an HTML file input element
       *
       * @param {String} name
       *  Name attribute for the element
       * @param {String} value
       *  Value attribute for the element
       * @return {String} The rendered element
       */
      file: function(name, htmlAttributes) {
        return this.input("file", name, null, htmlAttributes);
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
        return this.input("hidden", "name", "value");
      },

      /**
       * Renders an HTML image button element
       *
       * @param {String} name
       *  Name attribute for the element
       * @param {String} value
       *  Value attribute for the element
       * @param {Object} htmlAttributes
       *  Object containing extra html attributes to add to the element
       * @return {String} The rendered element
       */
      imageButton: function(name, src, htmlAttributes) {
        htmlAttributes = htmlAttributes || {};
        htmlAttributes.src = src;

        return this.input("image", name, null, htmlAttributes);
      },

      /**
       * Renders an HTML input element
       *
       * @param {String} type
       *  The input type
       * @param {String} name
       *  Name attribute for the element
       * @param {String} value
       *  Value attribute for the element
       * @param {Object} htmlAttributes
       *  Extra html attributes for the element
       * @return {String} the rendered html element
       */
      input: function(type, name, value, htmlAttributes) {
        value = value ? 'value="'+value+'"' : '';

        return piewpiew.printf('<input type="${type}" name="${name}" ${value} ${attributes}/>', {
          type: type,
          name: name,
          value: value || "",
          attributes: this.attributeString(htmlAttributes)
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
      passwordField: function(name, value, htmlAttributes) {
        return this.input("password", name, value || "", htmlAttributes);
      },

      /**
       * Renders an HTML radio button element
       *
       * @param {String} name
       *  Name attribute for the element
       * @param {String} value
       *  Value attribute for the element
       * @param {Object} htmlAttributes
       *  Object containing extra html attributes to add to the element
       * @return {String} The rendered element
       */
      radioButton: function(label, name, value, checked, htmlAttributes) {
        htmlAttributes = htmlAttributes || {};

        if (checked) {
          htmlAttributes.checked = "checked";
        }

        return piewpiew.printf('<label class="radio">${input}${label}</label>', {
          input: this.input("radio", name, value || "", htmlAttributes),
          label: label
        });
      },

      /**
       * Renders a list of HTML radio button elements
       *
       * @param {String} name
       *  Name attribute for the element
       * @param {Array} options
       *  An array of radio button options. Each option is an object containing
       *  label, value and htmlAttributes properties
       * @param {string} selectedOption
       *  The value of the selected option
       * @return {String} The rendered element
       */
      radioButtonList: function(name, options, selectedOption, htmlAttributes) {
        htmlAttributes = htmlAttributes || {};
        htmlAttributes.classes = htmlAttributes.classes || [];
        htmlAttributes.classes.push("radiobutton-list");

        var str = piewpiew.printf('<div ${attributes}>', {
          attributes: this.attributeString(htmlAttributes)
        }), checked;

        for(var i = 0, m = options.length; i < m; i++) {
          checked = selectedOption == options[i].value;

          str += this.radioButton(options[i].label, name, options[i].value, checked, options[i].htmlAttributes);
        }

        str += '</div>';

        return str;
      },

      /**
       * Renders an HTML reset button
       *
       * @param {String} label
       *  The label for the button
       * @param {Object} htmlAttributes
       *  Object containing extra html attributes for the element
       * @return {String} the rendered element
       */
      resetButton: function(name, label, htmlAttributes) {
        return this.input("reset", name, label || "", htmlAttributes);
      },

      /**
       * Renders an HTML <select> element
       *
       * @param {String} name
       *  Name attribute for the element
       * @param {String} options
       *  An array of objects specifying the value/label for the select list options. Format
       *  is simply
       *  [
       *    {label: "option 1 label", value: "option 1 value"},
       *    {label: "option 2 label", value: "option 2 value"}
       *  ]
       *  Option groups are also supported by passing in an object, rather than
       *  array. Each key in the object will be used as the option group labels,
       *  with each value an array of options. For example:
       *  {
       *    "Option group one" : [
       *      {label: "option 1 label", value: "option 1 value"},
       *      {label: "option 2 label", value: "option 2 value"}
       *    ],
       *    "Option group two" : [
       *      {label: "option 3 label", value: "option 3 value"},
       *      {label: "option 4 label", value: "option 4 value"}
       *    ]
       *  }
       * @param {String} selectedOptions
       *  Either and array of selected option values for multi select lists, or a singe
       *  selected option value
       * @param {Boolean} multipleSelect
       *  Enable multiple select
       * @param {Object} htmlAttributes
       *  Object containing extra html attributes to add to the element
       * @return {String} The rendered element
       */
      selectList: function(name, options, selectedOptions, multipleSelect, htmlAttributes) {
        var i,m,selected;

        htmlAttributes = htmlAttributes || {};

        if (multipleSelect) {
          htmlAttributes.multiple = "multiple";
        }

        var output = piewpiew.printf('<select name="${name}" ${attributes}>', {
          name: name,
          attributes: this.attributeString(htmlAttributes)
        });

        if (selectedOptions.constructor.prototype !== Array.prototype) {
          selectedOptions = [selectedOptions];
        }

        if (options.constructor.prototype === Array.prototype) {
          for (i = 0, m = options.length; i < m; i++) {

            selected = _.any(selectedOptions, function(value) {
              return value == options[i].value;
            });

            selected = (selected) ? ' selected="selected"' : '';
            output += piewpiew.printf('<option value="${value}"${selected}>${label}</option>', {
              value: options[i].value,
              label: options[i].label,
              selected: selected
            });
          }
        } else if (typeof options == "object") {
          for (var group in options) {
            output += piewpiew.printf('<optgroup label="${label}">', {
              label: group
            });

            for (i = 0, m = options[group].length; i < m; i++) {

              selected = _.any(selectedOptions, function(value) {
                return value == options[group][i].value;
              });

              selected = (selected) ? ' selected="selected"' : '';
              
              output += piewpiew.printf('<option value="${value}"${selected}>${label}</option>', {
                value: options[group][i].value,
                label: options[group][i].label,
                selected: selected
              });
            }

            output += '</optgroup>';
          }
        }

        output += '</select>';

        return output;
      },

      /**
       * Renders an HTML submit button
       *
       * @param {String} label
       *  The label for the button
       * @param {Object} htmlAttributes
       *  Object containing extra html attributes for the element
       * @return {String} the rendered element
       */
      submitButton: function(name, label, htmlAttributes) {
        return this.input("submit", name, label || "", htmlAttributes);
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
        return this.input("text", name, value || "", htmlAttributes);
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