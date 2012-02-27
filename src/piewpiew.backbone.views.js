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














































