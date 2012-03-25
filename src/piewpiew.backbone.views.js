(function(root, factory) {
  // If AMD is available, use the define() method to load our dependencies 
  //and declare our module
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', 'piewpiew', 'jquery'], function(_, Backbone, piewpiew, $) {
      return factory(root, _, Backbone, piewpiew, $);
    });
  }
  // Otherwise we will attach our module to root, and pass references to our 
  // dependencies into the factory. We're assuming that our dependencies are 
  // also attached to root here, but they could come from anywhere 
  else 
  {    
    root.piewpiew.backbone = factory(root, _, Backbone, piewpiew, $);
  }
})(this, function(root, _, Backbone, piewpiew, $) {  
  
  piewpiew.views || (piewpiew.views = {});

  /**
   *  piewpiew.View base class
   *  --------------------------------------------------------------------------
   *  Adds external template support to the basic Backbone.View class, as well 
   *  as default implementations for rendering and and app registration.
   */
  piewpiew.views.View = Backbone.View.extend({

    // A default template.
    template: 'No template specified for view',

    /**
     * Template processing function. By default we use the template function 
     * provided by the underscore library. By default instances call
     * piewpiew.View.template(). You can implement per-view template functions
     * by overriding this method. If you want to override the template function
     * for all views in your app, you should override piewpiew.views.template()
     *
     * @param {String} template
     *  The unparsed template string
     * @param {Object} context
     *  The template context containing data to be rendered by the template
     * @return {String} the rendered template
     */
    templateFunction: function(template, context) {
      return piewpiew.views.template(template, context);
    },

    /**
     * Returns a template context object. A Template context is an object 
     * which encapsulates the data that will be rendered by our template
     * function. By default we simply return the result of calling our
     * model's toJSON method (assuming we have a model, and that model has a
     * toJSON method).
     *
     * In many cases you will want to override this method so that ir returns
     * data better suited to your template's requirements.
     *
     * @return {Object}
     */
    templateContext: function() {
      if (this.model) {
        if (typeof this.model.toJSON == 'function') {
          return this.model.toJSON();
        }
        return this.model;
      }
      return {};
    },

    /**
     * Renders the view. By default we pass our template string and template
     * context to templateFunction()
     */
    render: function() {
      var template = null;

      if (typeof this.template == 'function') {
        template = this.template();
      } else {
        template = this.template;
      }

      $(this.el).html(
        this.templateFunction(
          template, 
          piewpiew.views.TemplateContext(this.templateContext())
        )
      );

      return this;
    },

    /**
     * This method is called when the view is registered with the App. It
     * is often a better idea to put any view initialization code in onRegister(),
     * as opposed to initialize() as the view will have access to the App via 
     * this.app during onRegister().
     *
     * @param {piewpiew.App}
     *  the app that the view is being registered with
     */
    onRegister: function(app) {
      // noop
      return this;
    }
  });

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
  piewpiew.views.template = function(template, context) {
    return _.template(template, context);
  };

  /**
   * Builds a template context object by merging template data with our view helpers
   *
   * @param {object} data
   *  Template data
   * @return {object}
   */
  piewpiew.views.TemplateContext = function(data) {
    return _.extend(data, piewpiew.views.Helpers);
  };

  /**
   * View helpers. These methods get attached to templateContext objects when they
   * are passed to view templates for rendering.
   */
  piewpiew.views.Helpers = {
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
        context.attributes = this.attributeString(htmlAttributes);

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
        context.attributes = this.attributeString(htmlAttributes);

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
        context.attributes = this.attributeString(htmlAttributes);

        return piewpiew.views.template(field.labelTemplate(), context); 
      },

      hidden: function(name, value) {
        return piewpiew.views.template('<hidden name="<%= name %>" value="<%= value %>"/>', {
          name:name,
          value:value
        });
      },

      label: function(name, value, htmlAttributes) {
        var template = '<label for="<%= name %>" <%= attributes %>><%= value %></label>';

        return piewpiew.views.template(template, {
          name: name,
          value: value,
          attributes: this.attributeString(htmlAttributes)
        });
      },

      textfield: function(name, value, htmlAttributes) {
        var template = '<label for="<%= name %>" <%= attributes %>><%= value %></label>';
        
        return piewpiew.views.template(template, {
          name: name,
          value: value,
          attributes: this.attributeString(htmlAttributes)
        });
      }
    }
  };

  
  ListView = piewpiew.views.View.extend({
    tagName: "ul",

    itemTemplate: function(item) {
      return "";
    },

    itemTemplateContext: function(item) {
      return piewpiew.view.TemplateContext(item.toJSON());
    },

    initialize: function() {
      this.collection.bind("reset", this.render, this);
      this.collection.bind("add", this.handleAdd, this);
      this.collection.bind("remove", this.handleRemove, this);
    },

    handleAdd: function(model, collection, options) {
      this.appendItem(model.toJSON());
    },

    handleRemove: function() {
      console.log("remove", arguments);
    },

    render: function() {
      var self = this;

      $(this.el).empty();

      _(this.collection.models).each(function(model) {
        self.appendItem(model);
      });

      return this;
    },

    appendItem: function(item) {
      console.log(item);
      if (this.$el) {
        this.$el.append("<li>" + item.name + "</li>");
      } else {
        this.render();
      }
    }
  });

  FormView = piewpiew.views.View.extend({

    template: function() {
      var buf = [];

      buf.push('<form class="form-horizontal">');

      if (this.model.id) {
        buf.push('<%= Html.hidden("id", model.id) %>');
      }

      buf.push('<%= Html.hidden("cid", model.cid) %>');
      buf.push('<%= Html.editorForModel(model) %>');
      buf.push('<input type="submit" value="save"/>');
      buf.push('</form>');

      return buf.join("\n");
    },

    initialize: function(options) {
      if (this.model) {
        this.model.bind("error", this.handleError, this);
      } 
    },

    templateContext: function() {
      return {
        model:this.model
      };
    },

    events: {
      'submit form': 'handleSubmit',
      'blur input': 'handleBlur',
      'focus input': 'handleFocus' 
    },

    handleSubmit: function(e) {
      var formData = this.$('form').serializeObject();

      this.clearErrors();

      if (null != this.model) {
        if (this.model.set(formData)) this.trigger("submit", this);
      }     

      e.preventDefault();
    },

    handleFocus: function(e) {

    },

    handleBlur: function(e) {
      var $field = $(e.target);
      this.clearErrorFor($field.attr('name'));
      this.model.set($field.attr('name'), $field.val());
    },

    /**
     * Handlder for our model's validation error event. Displays error messages for
     * each of the fields that failed validation.
     */
    handleError: function(model, errors) {
      var view = this;

      _.each(errors, function(messages, name) {
        var msg = view.formatErrorMessagesFor(name,messages);
        var errorEl = view.formatErrorElementFor(name, msg);
        view.clearErrorFor(name);
        view.attachErrorElementFor(name, errorEl);          
      });
    },

    /** 
     * Clears all errors from the form view. If you implement your own validation
     * error message strategy you should override this.
     */
    clearErrors: function() {
      this.$(".control-group.error .help-inline").remove();
      this.$(".control-group.error").removeClass("error");
    },

    /**
     * Clears error message for a particular field
     *
     * @param {name}
     *  Name of the field
     */
    clearErrorFor: function(name) {
      this.$(".control-group-for-"+name+".error .help-inline").remove();
      this.$(".control-group-for-"+name+".error").removeClass("error");
    },

    /**
     * Formats validation error messages for a field. Overriding classes
     * can implement their own version to provide custom formatting for
     * certain fields.
     *
     * @param {string} name
     *  The name of the field
     * @param {array} messages
     *  An an array of validation messages for the field
     */
    formatErrorMessagesFor: function(name, messages) {
      return messages.join(" ");
    },

    /**
     * Formats a label for validation error message. Used to wrap the message
     * output generated by formatMessageFor().
     *
     * @param {string} name
     *  Name of the fied the message is for
     * @param {string} message
     *  The message string
     * @return {string}
     */
    formatErrorElementFor: function(name, message) {
      return '<span class="help-inline generated">' + message + '</span>';
    },

    /**
     * Attaches a validation error element to the dom. You can override this method
     * to customise where error elements are attached in the dom, relative to their
     * associated field
     *
     * @param {string} name
     *  Name of the field that the error element is associated with
     * @param {string} errorElement
     *  HTML string for the error element
     */
    attachErrorElementFor: function(name, errorElement) {
      // Attach the element and also append the 'error' class to the containing
      // 'control-group' element. This approach is closely coupled to how our other
      // error formatting functions work. The idea is if you want to implement a
      // different error messaging strategy, then you will probably want to overwrite
      // all these functions together.
      var $input = this.$("*[name=" + name + "]");
      $input.parent().append(errorElement);
      $input.closest('.control-group').addClass('error');
    }
  });

  /**
   * Add ability to serialize jquery matches to javascript objects.
   * useful for handling form data and so forth.
   */
  $.fn.serializeObject = function()
  {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;
  };

  return piewpiew;
});














































