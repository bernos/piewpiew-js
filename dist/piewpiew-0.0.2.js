/*! 
 * piewpiew - v0.0.2 - 2012-06-20
 * http://github.com/bernos/piewpiew-js
 * Copyright (c) 2012 Brendan McMahon;
 */

/*******************************************************************************

  piewpiew.core.js

*******************************************************************************/
(function(global) 
{
  var piewpiew = {};

  piewpiew.DEVELOPMENT  = "development";
  piewpiew.TESTING      = "testing";
  piewpiew.PRODUCTION   = "production";

  /**
   * Storage for modules loaded using piewpiew's built in define and require
   * methods. This will only be used when not using a third part AMD loader like
   * requirejs. The expectation here is that if we're not using AMD then we
   * are using plain old <script> tags, and we are responsible for ensuring that
   * all our scripts are loaded in the right order.
   */
  var modules  = {
    'underscore' : global._,
    'backbone'   : global.Backbone,
    'jquery'     : global.jQuery
  };

  /**
   * Merges two or more objects. When extend(a,b,c) is called, first the 
   * properties of b are copied to a, then the properties of c are copied to a.
   * The updated 'a' object is returned
   */
  piewpiew.extend = function(obj) {
    for (var i = 0, max = arguments.length; i < max; i++) {
      var source = arguments[i];
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }

    return obj;
  };

  /**
   * Simple string formatting function. Replaces all occurances of ${token}
   * with values from a context object.
   *
   * @param {String} str
   *  The input string, containing tokens to be replace.
   * @param {Object} o
   *  Token values to be substituted into the input string.
   * @return {String}
   */
  piewpiew.printf = function(str, o) {
    for (var t in o) {
      var re = new RegExp("\\$\\{" + t + "\\}", "g");
       str = str.replace(re, o[t]);
    }
    return str;
  };

  /**
   * Helper function used by other piewpiew modules to resolve config values.
   * Modules will often have a config object, containing various configuration
   * options, like templates, message string and so on. Sometimes these values
   * are scalars, sometimes they are complex types, and sometimes they are
   * functions that need to be executed at call time in order to return the
   * actual config value. Modules can pass the config item to this function and
   * it will derive the value of the config item based on its type.
   */
  piewpiew.configValue = function(configItem) {
    // If the item is a function, call it and return the return value
    if (typeof configItem == 'function') {
      return configItem();
    }
    return configItem;
  };

  /**
   *  piewpiew.Class
   *  --------------------------------------------------------------------------
   *  Utility function for defining 'Classes'. 
   */
  var initializing = false;
    
  piewpiew.Class = function() {
    var methods = null;
    var parent  = null;
                
    /**
     * Default constructor for our new class. All classes created using the 
     * piewpiew.Class() method will share this constructor.
     */
    var klass = function() {
      if(!initializing) {
        this.initialize.apply(this, arguments);
      }
    };
      
    /**
     * If the first argument is a function, assume it is the "class" from which 
     * the new class will inherit. In this case the second argument is an object 
     * containing the methods and properties for the new class.
     *
     * If the first argument is not a function, then we interpret it as an 
     * object containing the methods and properties of the new class
     */
    if (typeof arguments[0] === 'function') {
      parent = arguments[0];
      methods = arguments[1];
    } else {
      methods = arguments[0];
    }

    if (parent) {
      // Set the initializing flag to prevent the normal initialization methods 
      // firing when creating the new prototype object
      initializing = true;
      klass.prototype = new parent();
      initializing = false;
    }

    piewpiew.extend(klass.prototype, methods);
    
    klass.prototype.constructor = klass;

    if (!klass.prototype.initialize) {
      klass.prototype.initialize = function(){};
    } 

    klass.extend = function(o) {
      return piewpiew.Class(this, o);
    }

    return klass;
  };

  /**
   * Implementation of define. This defininition will be used if no dedicated
   * module loading library, such as requirejs is used. This implementation does
   * not actually load external scripts, and relies on us to ensure that we
   * specify the correct order of our external scripts. The recommeded way to
   * work with piewpiew is to use a dedicated AMD library, like requirejs
   */
  piewpiew.define = function(module, dependencies, fn) {
    if (typeof define === 'function' && define.amd) {
      define(module, dependencies, fn);
    } else {
      if (dependencies && dependencies.length) {
        for (var i = 0; i < dependencies.length; i++) {
          dependencies[i] = modules[dependencies[i]];
        }
      }
      modules[module] = fn.apply(this, dependencies || []);
    }
  };

  global.piewpiew = piewpiew;

  if (typeof exports != 'undefined') {
    exports.piewpiew = piewpiew;
  }

  if (typeof define === 'undefined') {
    global.define = piewpiew.define;
  }

  piewpiew.define('piewpiew.core', [], function() { return piewpiew });

}(typeof window === 'undefined' ? this : window));
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
      }
    }    
  };
});
define('piewpiew.views.Region', 
[
  'piewpiew.core'
], 

function(piewpiew) {
  /**
   *  piewpiew.views.Region class
   *  --------------------------------------------------------------------------
   *  Regions are simple containers that manage collections of child views
   *  within a Layout instance. A region is associated with a single Layout
   *  instance, and uses a DOM selector in order to attach its managed views to
   *  DOM.
   */
  return piewpiew.Class({
    
    /**
     * Initializes the Region. This function is called automatically by the 
     * Region constructor.
     *
     * @param {Object} options
     *  Initialization options. The options must contain a "selector" property
     *  which is a string that is used to locate the DOM elment the Region should
     *  append it's views to. The selector will be executed within the context of
     *  the root element of the associated Layout
     */
    initialize : function(options) {
      if (!options.selector) {
        throw "Cannot initialize a Region without a selector.";
      }

      this.views = [];
      this.selector = options.selector;
      return this;
    },

    /**
     * Adds a view to the region
     *
     * @param {piewpiew.views.View} view
     * @return {piewpiew.views.View}
     *  The view that was added. Useful for method chaining
     */
    addView : function(view) {
      this.views.push(view);
      return view;
    },

    /**
     * Removes a view from the region
     * 
     * @param {piewpiew.views.View} view
     * @return {piewpiew.views.View}
     *  The removed view
     */
    removeView : function(view) {
      for (var i = 0, m = this.views.length; i < m; i++) {
        if (this.views[i] == view) {
          this.views.splice(i,1);
          return view;
        }
      }
      return view;
    },

    /**
     * Renders all the views in the region
     *
     * @param {piewpiew.views.Layout} layout
     *  The layout to attach managed views to. This is required in order to
     *  provide the DOM context when executing the regions selector
     */
    render : function(layout) {
      for (var i in this.views) {
        layout.$(this.selector).append(this.views[i].render().el);
      }
    }
  });
});
define('piewpiew.views.View', 
[
  'backbone', 
  'piewpiew.views.Helpers'
], 

function(Backbone, Helpers) {

  /**
   *  piewpiew.views.View base class
   *  --------------------------------------------------------------------------
   *  Adds external template support to the basic Backbone.View class, as well 
   *  as default implementations for rendering and and app registration.
   */
  return Backbone.View.extend({

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
      return Helpers.renderTemplate(template, context);
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
          this.templateContext()
        )
      );

      return this;
    }
  });
});
define('piewpiew.views.CollectionView', 

[
  'piewpiew.views.View'
], 

function(View) {

  return View.extend({

    /**
     * An empty template overrides the default 'No template specified for view'
     */
    template: '',
    
    /**
     * Class used to render each item in the collection
     */    
    view: View,

    initialize: function(options) {
      var defaults;

      options || (options = {});

      if (defaults = this.defaults) {
        if (typeof defaults == 'function') {
          defaults = defaults.call(this);
        }
        options = _.extend({}, defaults, options);
      }

      if (options.view) {
        this.view = options.view;
      }

      this.views = [];

      if (this.collection) {
        this.collection.bind("reset",   this.onCollectionReset,       this);
        this.collection.bind("add",     this.onCollectionItemAdded,   this);
        this.collection.bind("remove",  this.onCollectionItemRemoved, this);
      }
    },
    
    /**
     * Returns the $el to which all child views should be appended. By default
     * we simply use the CollectionView.$el property, but you may wan to override
     * this when using a custom template
     */
    getListEl: function() {
      return this.$el;
    },

    /**
     * Handles collection reset event
     */
    onCollectionReset: function() {
      this.render();
    },

    /**
     * Handles collection add event
     */
    onCollectionItemAdded: function(model, collection, options) {
      this.addItem(model);
    },

    /**
     * Handles collection remove event
     */
    onCollectionItemRemoved: function(model, collection, options) {
      this.removeItem(model);
    },

    addItem: function(item) {
      var view = new this.view({
        model: item
      });

      view.bind("all", this.proxyEvent, this);

      this.$el.append(view.render().el);

      this.views.push(view);

      return this;
    },

    removeItem: function(item) {
      for (var v = null, i = 0, m = this.views.length; i < m; i++) {
        v = this.views[i];
        if (v.model == item) {
          this.views.splice(i,1);
          v.unbind("all", this.proxyEvent, this);
          v.remove();
          break;
        }
      }
      return this;
    },

    clear: function() {
      for (var v = null, i = 0, m = this.views.length; i < m; i++) {
        v = this.views[i];
        v.remove();
      }
      this.views = [];
    },

    render: function() {
      this.clear();

      View.prototype.render.apply(this);

      if (this.collection) {
        var that = this;

        _.each(this.collection.models, function(item) {
          that.addItem(item);
        }, this);
      }

      return this;
    },

    proxyEvent: function() {
      this.trigger.apply(this, arguments);
    }
  });
});
define('piewpiew.views.FormView', 

[
   'jquery'
  ,'piewpiew.views.View'
], 

function($, View) {

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

  return View.extend({

    initialize: function(options) {
      if (this.model) {
        this.model.bind("error", this.handleError, this);
      } 
    },

    template: function() {
//       var model = this.model;
// console.log("asfasdfsdafdafdas");
      return [
        '<form class="form-horizontal">',
        '  <% if (null != model.id) { %>',
        '    <%= Html.hidden("id", model.id) %>',
        '  <% } %>',
        '  <%= Html.hidden("cid", model.cid) %>',
        '  <% _.each(model.fields, function(field, name) { %>',
        '    <div>',
        '      <div class="control-group control-group-for-<%= name %>">',
        '        <label class="control-label"><%= field.label %></label>',
        '        <div class="controls"><%= Html.formField(model, field) %></div>',
        '      </div>',
        '    </div>',
        '  <% }) %>',
        '  <input type="submit" value="save"/>',
        '</form>'
      ].join("\n");
          


      buf.push('<form class="form-horizontal">');

      buf.push('<% if() { %>');
      buf.push('<%= Html.hidden("id", model.id) %>');
      buf.push('<% } %>');


      buf.push('<%= Html.hidden("cid", model.cid) %>');

      buf.push('<% _.each(model.fields, function(field, name) { %>');
      buf.push('<div>');

      buf.push('<div class="control-group control-group-for-<%= name %>"><label class="control-label"><%= field.label %></label><div class="controls"><%= Html.formField(model, field) %></div></div>');

      buf.push('</div>');
      buf.push('<% }) %>');

      //buf.push('<%= Html.editorForModel(model) %>');
      buf.push('<input type="submit" value="save"/>');
      buf.push('</form>');

      return buf.join("\n");
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
});
define('piewpiew.views.Layout', 
[
  'piewpiew.views.View', 
  'piewpiew.views.Region'
], 

function(View, Region){
  /**
   *  piewpiew.views.Layout class
   *  --------------------------------------------------------------------------
   *  Extends the basic piewpiew.views.View class by adding support for regions.
   *  Regions are layout containers which can contain child views. The 
   *  Layout->Region->View strategy allows us to create composite views easily
   */
  return View.extend({

    /**
     * Creates a region and adds it to the layout.
     *
     * @param {Object} options
     *  Object containing options to be passed to the Region constructor
     * @return {piewpiew.views.Region}
     *  The Region that was created
     */
    addRegion: function(options) {
      var region = new Region(options);

      if (null == this.regions) this.regions = [];
      
      this.regions.push(region);
      return region;
    },

    /**
     * Extends the standard piewpiew.views.View.render() implementation by
     * rendering all the Layout Regions that have been added to the Layout via
     * calls to addRegion()
     *
     * @return {piewpiew.views.Layout}
     */
    render: function() {
      View.prototype.render.apply(this);

      if (null != this.regions) {
        for (var i in this.regions) {
          this.regions[i].render(this);
        }
      }

      return this;
    }
  });
});
define('piewpiew.views', 
[
   'piewpiew.core'
  ,'piewpiew.views.Helpers'
  ,'piewpiew.views.Region'
  ,'piewpiew.views.View'
  ,'piewpiew.views.CollectionView'
  ,'piewpiew.views.FormView'
  ,'piewpiew.views.Layout'
  
], 

function(piewpiew, Helpers, Region, View, CollectionView, FormView, Layout) {

  piewpiew.views = {
    View: View,
    CollectionView: CollectionView,
    FormView: FormView,
    Region: Region,
    Layout: Layout,
    Helpers: Helpers
  };
  
  return piewpiew.views;
});
define('piewpiew.forms', [
  'underscore',
  'backbone',
  'piewpiew.core'
], 

function(_, backbone, piewpiew) {
  var forms = {};

  forms.Form = backbone.Model.extend({

    initialize: function(attributes, options) {
      this.fields || (this.fields = {});

      _.each(this.fields, function(field, name) {
        field.name = name;

        if (!field.label) { 
          field.label = name;
        }
      });
    },

    /**
     * Iterate over each of the model's field definitions and validate the
     * corresponding value from the model instance. Returns either and object of
     * errors or false if no validation errors occured. The structure of the 
     * error object is:
     *
     *  {
     *    "field-one-name" : [
     *      "Error message one",
     *      "Error message two"
     *    ],
     *    "field-two-name" : [
     *      "Error message one",
     *      "Error message two"
     *    ]
     *  }
     */
    validate: function(attrs) {
      console.log("validate", attrs)
      var errors = {};
      var isValid = true;
      var model = this;

      _.each(attrs, function(value, key) {
        if (model.fields[key]) {
          var e = model.fields[key].validate(value);
          if (e) {
            isValid = false;
            errors[key] = e;
          }
        }
      });

      if (!isValid) return errors;
    },

    submit : function(data) {

    }
  });

  forms.ModelForm = forms.Form.extend({
    initialize : function(attributes, options) {
      this.fields || (this.fields = {});

      // For any fields not explicitly set in the ModelForm.fields 
      // configuration, check the fields of the associated model and 
      // set up corresponding form fields for each
      if (this.model) {
        var that = this;

        _.each(this.model.prototype.fields, function(field, name) {
          if (that.fields[name] == null) {
            that.fields[name] = that.getFormFieldForModelField(field);
          }
        });
      }

      forms.Form.prototype.initialize.apply(this, arguments);
    },

    getFormFieldForModelField: function(modelField) {
      return "TBA";
    },

    save: function() {
      this.validate
    }
  });

  piewpiew.forms = forms;

  return forms;
});

/*

Notes on refactoring old model and formview

Old formview was dumb with regards to template. Required the Html.editorForModel helper.

Get rid of Html.editorForModel helper, and make the default form template smarter.

Try to avoid template library specific template syntax

All view type functions in piewpiew.models.fields needs to be removed


*/
define('piewpiew.forms.fields', [
  'piewpiew.core',
  'piewpiew.forms',
  'piewpiew.validators',
  'piewpiew.views.Helpers'
], 

function(piewpiew, forms, validators, Helpers) {

  var fields = {};

  /**
   * piewpiew.forms.fields.Field
   * ===========================================================================
   *
   */
  fields.Field = piewpiew.Class({
    
    /**
     * Is the field required?
     */
    required: false,

    /**
     * Error message if a value fails required validation
     */
    requiredMessage: "${label} is a required field",
    
    /**
     * Error message if a value is of the wrong type
     */
    invalidTypeMessage: "The value of ${label} is invalid",

    /**
     * Initialise the field instance.
     *
     * @param {object} options
     */
    initialize: function(options) {
      options || (options = {});

      piewpiew.extend(this, options);

      this.validators = this.defaultValidators();

      piewpiew.extend(this.validators, options.validators);
    },

    /**
     * Creates default validators for the field. Inheritting classes should 
     * provide their own implementation
     */
    defaultValidators: function() {
      return {};
    },

    /**
     * Render the field. Form subclasses should override this method and return
     * the appropriate HTML formatted string.
     *
     * @param {Object} value
     *  Value of the field
     * @param {Object} attributes
     *  Extra html attributes for the field
     * @return {String}
     */
    render: function(value, attributes) {
      return "";
    },

    /**
     * Validate a value against each of our validators. If the value is valid,
     * return false, otherwise return an array of validation errors
     */
    validate: function(value) {
      var errors = [];

      // First ensure the type of value is acceptable.
      if (!this.validateType(value)) {
        errors.push(piewpiew.printf(this.invalidTypeMessage, this));
      }

      // Ensure required
      if (this.required && !this.validateRequired(value)) {
        errors.push(piewpiew.printf(this.requiredMessage, this));
      }

      _.each(this.validators, function(validator, name) {
        var v = validator.validate(value);

        if (null != v) errors = errors.concat(v);
      });

      if (errors.length > 0) return errors;

      return false;
    },

    /**
     * Ensures that the type of value is valid. Inheritting classes implement
     * their own version of this method
     *
     * @param {Object} value
     * @return {boolean}
     */
    validateType: function(value) {
      return true;
    },

    /**
     * Validates that the value is valid, if this is a required field. For 
     * example, an empty string would pass the validateType() method, but should
     * not pass the validateRequired() test.
     * @param {Object} value
     * @return {boolean}
     */
    validateRequired: function(value) {
      if (null == value) return false;

      if (typeof value == "string" && value == "") return false;

      return true;
    }    
  });

  /**
   * piewpiew.forms.fields.TextField
   * ===========================================================================
   *
   */
  fields.TextField = fields.Field.extend({

    minLength : -1,

    maxLength : -1,

    regex : /./,

    defaultValidators : function() {
      return {
        length : new validators.StringValidator({
          minLength : this.minLength,
          maxLength : this.maxLength
        }),

        regex : new validators.RegexValidator({
          pattern : this.regex
        })
      };
    },

    render: function(value, attributes) {
      return Helpers.Html.textfield(this.name, value, attributes);
    }
  });

  forms.fields = fields;

  return forms.fields;
});
define('piewpiew.models', ['underscore', 'backbone', 'piewpiew.core'], function(_, Backbone, piewpiew) {
  
  var models = {};

  /**
   *  piewpiew.models.Config
   *  ==========================================================================
   *  
   *  Any and all strings for messages, templates and so forth should live here,
   *  and be retrieved by objects in the models module, rather than declared on
   *  objects themselves. Just makes it easier to change stuff as you don't need
   *  to go looking for strings hidden away in source.
   */
  models.Config = {

    messages: {
      
    },

    templates: {
       modelEditor: function() {
        var buf = [];

        buf.push("<% _.each(model.fields, function(field, name) { %>");
        buf.push("<div>");
        buf.push("<%= Html.editorForField(model, field) %>");
        buf.push("</div>");
        buf.push("<% }); %>");

        return buf.join("\n");
      }
    }    
  };

  // Shortcut access to config stuff  
  var c    = piewpiew.configValue;
  var conf = models.Config;
  var msg  = models.Config.messages;
  var tmpl = models.Config.templates;

  /**
   *  piewpiew.models.Model base class
   *  --------------------------------------------------------------------------
   *  Adds formal field definitions and a validation framework to the base 
   *  Backbone Model class.
   */
  models.Model = Backbone.Model.extend({

    /**
     * Custom implementation of toJSON that ensures the models cid and id (if 
     * set) are included in the json representation of the model
     */
    toJSON: function() {
      return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
        id: this.id,
        cid: this.cid
      });
    },

    editorTemplate: function() {
      return c(tmpl.modelEditor);
    },

    editorTemplateContext: function() {
      return {
        model:this
      }
    },

    initialize: function(attributes, options) {
      this.fields || (this.fields = {});
      
      // Initialize each of our field objects...
      _.each(this.fields, function(field, name) {
        field.name  = name;
      });
    },
    
    /**
     * Iterate over each of the model's field definitions and validate the
     * corresponding value from the model instance. Returns either and object of
     * errors or false if no validation errors occured. The structure of the 
     * error object is:
     *
     *  {
     *    "field-one-name" : [
     *      "Error message one",
     *      "Error message two"
     *    ],
     *    "field-two-name" : [
     *      "Error message one",
     *      "Error message two"
     *    ]
     *  }
     */
    validate: function(attrs) {
      var errors = {};
      var isValid = true;
      var model = this;

      _.each(attrs, function(value, key) {
        if (model.fields[key]) {
          var e = model.fields[key].validate(value);
          if (e) {
            isValid = false;
            errors[key] = e;
          }
        }
      });

      if (!isValid) return errors;
    }
  });

  piewpiew.models = models;

  return models;
  
});
define('piewpiew.validators', ['piewpiew.core'], function(piewpiew) {

  var validators = {};

  /**
   * piewpiew.models.validators.Validator  base class
   * --------------------------------------------------------------------------
   *  
   */
  validators.Validator = piewpiew.Class({
    initialize: function(options) {
      options || (options = {});
      options.messages || (options.messages = {});

      piewpiew.extend(this, options);

      this.messages = this.defaultMessages();

      piewpiew.extend(this.messages, options.messages);
    },

    defaultMessages: function() {
      return {};
    },

    validate: function(value) {
      return [];
    }
  });

  /**
   * piewpiew.models.validators.StringValidator class. 
   * --------------------------------------------------------------------------
   * 
   * Ensures that a string is between a min and max length
   *
   * @property {Number} minLength
   *  Minimum length for the string. Use -1 for no minimum length
   * @property {Number} maxLength
   *  Maximum length for the string. Use -1 for no maximum length
   *
   * Validation messages
   *  outOfRange - String is not between minLength and maxLength
   *  tooLongNoMinLength - String is longer than max length with no minLength
   *    specified
   *  tooShortNoMaxLength - String is shorter than min length with no maxLength
   *    specified
   */
  validators.StringValidator = validators.Validator.extend({
    minLength: -1,
    maxLength: -1,

    defaultMessages: function() {
      return {
        tooLongNoMinLength  : validators.StringValidator.messages.tooLongNoMinLength,
        tooShortNoMaxLength : validators.StringValidator.messages.tooShortNoMaxLength,
        outOfRange          : validators.StringValidator.messages.outOfRange
      }
    },

    validate: function(value) {
      var errors = [];

      if (this.maxLength > -1) {
        if (value.length > this.maxLength) {
          errors.push((this.minLength > -1) ? piewpiew.printf(this.messages.outOfRange, this) : 
                                              piewpiew.printf(this.messages.tooLongNoMinLength, this));
        }
      }

      if (this.minLength > -1) {
        if (value.length < this.minLength) {
          errors.push((this.maxLength > -1) ? piewpiew.printf(this.messages.outOfRange, this) : 
                                              piewpiew.printf(this.messages.tooShortNoMaxLength, this));
        }
      }

      return errors;
    }
  });

  validators.StringValidator.messages = {
     tooLongNoMinLength   : "String must have no more than ${maxLength} characters"
    ,tooShortNoMaxLength  : "String must have at least ${minLength} characters"
    ,outOfRange           : "String must have between ${minLength} and ${maxLength} characters"
  };

  /**
   * piewpiew.models.validators.RangeValidator
   * --------------------------------------------------------------------------
   *
   * Range validator class. Determines whether a numeric value is between a
   * minimum and maximum boundary.
   *
   * @property {Number} min
   *  Minimum allowed value in range
   * @property {Number} max
   *  Maximum allowed valud in range. Set this lower than min to allow 
   *  unbounded values
   *
   * Validation messages:
   *  outOfRange - Displayed when the value being validated is out of range
   */
  validators.RangeValidator = validators.Validator.extend({
    min: 0,
    max: -1,

    defaultMessages: function() {
      return {
        outOfRange: validators.RangeValidator.messages.outOfRange
      }
    },

    validate: function(value) {
      var errors = [];

      if (this.max < this.min) return errors;

      if (value < this.min || value > this.max) {
        errors.push(piewpiew.printf(this.messages.outOfRange, this));        
      }

      return errors;
    }
  });

  validators.RangeValidator.messages = {
    outOfRange : "A value between ${min} and ${max} is required."
  };

  /**
   * piewpiew.models.validators.RegexValidator
   * --------------------------------------------------------------------------
   */
  validators.RegexValidator = validators.Validator.extend({
    regex: /./,

    defaultMessages: function() {
      return {
        invalid: validators.RegexValidator.messages.invalid
      }
    },

    validate: function(value) {
      var errors = [];

      if (!this.regex.test(value)) {
        errors.push(piewpiew.printf(this.messages.invalid, {value: value}))
      }

      return errors;
    }
  });

  validators.RegexValidator.messages = {
    invalid: "The supplied string does not match the regular expression."
  };

  /**
   * piewpiew.models.validators.EmailValidator
   * --------------------------------------------------------------------------
   */
  validators.EmailValidator = validators.RegexValidator.extend({
    regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    defaultMessages: function() {
      return {
        invalid: validators.EmailValidator.messages.invalid
      }
    }
  });  

  validators.EmailValidator.messages = {
    invalid : "${value} is not a valid email address."
  };
  
  return validators;
});
define('piewpiew.models.fields', ['underscore', 'backbone', 'piewpiew.core', 'piewpiew.models', 'piewpiew.validators'], function(_, Backbone, piewpiew, models, validators) {

  var fields = {};
  
  /**
   *  Config
   *  ==========================================================================
   *  
   *  Any and all strings for messages, templates and so forth should live here,
   *  and be retrieved by objects in the models module, rather than declared on
   *  objects themselves. Just makes it easier to change stuff as you don't need
   *  to go looking for strings hidden away in source.
   */
  fields.Config = {

    messages: {
      
      /* Field */
       required: "${label} is a required field"
      ,invalidType: "The value of ${label} is invalid"

      /* StringField */
      ,stringFieldInvalidType: "${label} must be a string"
      ,stringFieldTooLongNoMinLength: "${label} must have no more than ${maxLength} characters"
      ,stringFieldTooShortNoMaxLength: "${label} must have at least ${minLength} characters"
      ,stringFieldOutOfRange: "${label} must have between ${minLength} and ${maxLength} characters"

      /* EmailField */
      ,emailFieldInvalidEmailMessage: "${value} is not a valid email address."
    },

    templates: {
       fieldLabel: '<%= Html.label(name, value, attributes) %>' 
      ,fieldEditor: '<div <%= Html.attributeString(attributes) %>><%= Html.labelForField(model, field) %><div class="controls"><%= Html.formControlForField(model, field) %></div></div>'
      ,stringFieldFormControl: '<%= Html.textfield(name, value, attributes) %>'
    }    
  };

  // Shortcut access to config stuff  
  var c    = piewpiew.configValue;
  var conf = fields.Config;
  var msg  = fields.Config.messages;
  var tmpl = fields.Config.templates;

  /**
   *  piewpiew.models.fields.Field base class
   *  --------------------------------------------------------------------------
   *  
   */
  fields.Field = piewpiew.Class({
    /**
     * Is the field required?
     */
    required: false,

    /**
     * Error message if a value fails required validation
     */
    requiredMessage: c(msg.required),
    
    /**
     * Error message if a value is of the wrong type
     */
    invalidTypeMessage: c(msg.invalidType),
    
    /**
     * Returns a template string for rendering the field label.
     */
    labelTemplate: function() {
      return c(tmpl.fieldLabel);
    },

    /**
     * Returns a template context object for passing to our label template
     */
    labelTemplateContext: function(model) {
      return {
        name: this.name,
        value: this.label
      }; 
    },

    formControlTemplate: function() {
      return "";
    },

    formControlTemplateContext: function(model) {
      return {
        name: this.name,
        value: model.get(this.name)
      };
    },
    
    /**
     * Template for rendering an editor component for this field.
     */
    editorTemplate: function() {
      return c(tmpl.fieldEditor);
    },

    editorTemplateContext: function(model) {
      return {
        name: this.name,
        model: model,
        field: this,
        value: model.get(this.name)
      }
    },

    /**
     * Initialise the field instance.
     *
     * @param {object} options
     */
    initialize: function(options) {
      options || (options = {});

      _.extend(this, options);

      this.validators = this.defaultValidators();

      _.extend(this.validators, options.validators);
    },

    /**
     * Creates default validators for the field. Inheritting classes
     * should provide their own implementation
     */
    defaultValidators: function() {
      return {};
    },

    /**
     * Validate a value against each of our validators. If the value is valid,
     * return false, otherwise return an array of validation errors
     */
    validate: function(value) {
      var errors = [];

      // First ensure the type of value is acceptable.
      if (!this.validateType(value)) errors.push(piewpiew.printf(this.invalidTypeMessage, this));

      // Ensure required
      if (this.required && !this.validateRequired(value)) errors.push(piewpiew.printf(this.requiredMessage, this));

      _.each(this.validators, function(validator, name) {
        var v = validator.validate(value);

        if (null != v) errors = errors.concat(v);
      });

      if (errors.length > 0) return errors;

      return false;
    },

    /**
     * Ensures that the type of value is valid. Inheritting classes implement
     * their own version of this method
     *
     * @param {Object} value
     * @return {boolean}
     */
    validateType: function(value) {
      return true;
    },

    /**
     * Validates that the value is valid, if this is a required field. For 
     * example, an empty string would pass the validateType() method, but should
     * not pass the validateRequired() test.
     * @param {Object} value
     * @return {boolean}
     */
    validateRequired: function(value) {
      if (null == value) return false;

      return true;
    }    
  });

  /**
   *  piewpiew.models.fields.StringField class
   *  --------------------------------------------------------------------------
   *  
   */
  fields.StringField = fields.Field.extend({
    
    invalidTypeMessage : c(msg.stringFieldInvalidType),

    tooLongNoMinLengthMessage : c(msg.stringFieldTooLongNoMinLength),
    
    tooShortNoMaxLengthMessage : c(msg.stringFieldTooShortNoMaxLength),
    
    outOfRangeMessage : c(msg.stringFieldOutOfRange),

    minLength: -1,

    maxLength: -1,

    defaultValidators: function() {
      var self = this;

      return {
        length: new validators.StringValidator({
          minLength: self.minLength,
          maxLength: self.maxLength,
          messages: {
            tooLongNoMinLength : piewpiew.printf(self.tooLongNoMinLengthMessage, self),
            tooShortNoMaxLength : piewpiew.printf(self.tooShortNoMaxLengthMessage, self),
            outOfRange : piewpiew.printf(self.outOfRangeMessage, self)
          }
        })
      }
    },

    formControlTemplate: function() {
      return c(tmpl.stringFieldFormControl);      
    },

    validateType: function(value) {
      return (typeof value == "string");
    },

    validateRequired: function(value) {
      return value.length > 0;
    }
  });

  fields.EmailField = fields.StringField.extend({

    invalidEmailMessage: c(msg.emailFieldInvalidEmailMessage),

    defaultValidators: function() {
      var self = this;

      return {
        email: new validators.EmailValidator({
          messages: {
            invalid: self.invalidEmailMessage
          }
        })
      }
    }
  });

  models.fields = fields;

  return fields;
});
define('piewpiew.controllers', ['piewpiew.core'], function(piewpiew) {
  
  var controllers = {};

  controllers.Controller = piewpiew.Class({
    initialize: function(options) {
      options || (options = {});
      
      if (options.view) {
        this.setView(options.view);
      }

      if (options.model) {
        this.setModel(options.model);
      }
    },

    getView: function() {
      return this._view;
    },

    setView: function(view) {
      if (this.getView()) {
        this.unbindView(this.getView());
      }

      this._view = view;

      if (view) {
        this.bindView(view);
      }
      
      return this;
    },

    bindView: function(view) { },

    unbindView: function(view) { },

    getModel: function() {
      return this._model;
    },

    setModel: function(model) {
      if (this.getModel()) {
        this.unbindModel(this.getModel());
      }      

      this._model = model;

      if (model) {
        this.bindModel(model);
      }
      
      return this;
    },

    bindModel: function(model) {},
    unbindModel: function(model) {}
  });

  piewpiew.controllers = controllers;

  return controllers;
});
define('piewpiew.application', ['underscore', 'backbone', 'piewpiew.core'], function(_, Backbone, piewpiew) {

  var application = {};

  /**
   *  piewpiew.Application
   *  -------------------------------------------------------------------------
   *  The Application class represents the 'core' of our app or app component. 
   *  It provides a consistent point of access to views and models in our app
   *  via the regsiterView, registerModel, getView, getModel methods.
   */    
  application.Application = piewpiew.Class({

    /**
     * Default element for the application is the body tag
     */
    el: 'body',

    initialize: function(config) {

      var options = {};

      var defaults;

      if (defaults = this.defaults) {
        if (typeof defaults == 'function') {
          defaults = defaults.call(this);
        }
        options = _.extend({}, defaults);
      }

      this.set(options);

      if (config) {
        config(this);
      }

      this._routerMap   = {};
      this._modelMap    = {};
      this._viewMap     = {};

      this.initializeRouter();
      this.initializeModel();
      this.initializeView();
      this.initializeController();

      return this;
    },

    set: function(name, value) {
      this._options || (this._options = {});

      if (arguments.length == 2) {
        this._options[name] = value;
      } else {
        for (var n in name) {
          this._options[n] = name[n];
        }
      }

      return this;
    },

    get: function(name) {
      this._options || (this._options = {});
      return this._options[name];
    },

    configure: function(env, fn) {
      var envs = 'all';
      var args = Array.prototype.slice.call(arguments);
      var fn = args.pop();

      if (args.length) {
        envs = args;
      }

      if (envs == 'all' || envs.indexOf(this.env) > -1) {
        fn.call(this); 
      }

      return this;
    },

    /**
     * Register your router(s) here.
     */
    initializeRouter: function() { 
      if (this.routes) {
        var routes = this.normalizeRoutes(this.routes);

        this.registerRouter('default', new Backbone.Router({
          routes: routes
        }));

      }

      return this; 
    },

    /**
     * Register your models with the app here.
     */
    initializeModel: function() { return this; },

    /**
     * Register your views with the app here.
     */
    initializeView: function() { return this; },

    /**
     * Initialize the controller here
     */
    initializeController: function() { return this; },

    /**
     * Registers a router with the app
     *
     * @param {String} name
     *  Name of the router
     * @param {Backbone.Router} router
     *  A router to register
     */
    registerRouter: function(name, router) {
      this._routerMap[name] = router;
    },

    normalizeRoutes: function(routes) {
      if (this.baseUrl) {
        normalizedRoutes = {};
        
        for (var pattern in routes) {
          var p = pattern.length ? this.baseUrl + '/' + pattern : this.baseUrl;

          normalizedRoutes[p] = routes[pattern];
        }  

        return normalizedRoutes;
      }

      return routes;
    },

    /**
     * Retrieve a router by name
     *
     * @param {String} name
     *  The name of the router to retrieve
     * @return {Backbone.Router} the requested router or null if no router has
     *  been registered with the provided name
     */
    getRouter: function(name) {
      return this._routerMap[name];
    },

    /**
     * Registers a model with the App. The model's app property will be set
     * to reference this app. If the model has an onRegister() method it will
     * be called
     *
     * @param {String} name
     *  A name to register the model under
     * @param {Backbone.Model} model
     * @return {App}
     */
    registerModel: function(name, model) {
      this._modelMap[name] = model;
      model.app = this;

      if (typeof model.onRegister == 'function') {
        model.onRegister(this);
      }

      return this;
    },

    /**
     * Retrieve a model from the app.
     *
     * @param {String} name
     *  The name of the model to retrieve
     * @return {Backbone.Model}
     */
    getModel: function(name) {
      return this._modelMap[name]
    },

    /**
     * Registers a view with the App. The view's app property will be set
     * to reference this app. If the view has an onRegister() method it will
     * be called
     *
     * @param {String} name
     *  A name to register the view under
     * @param {Backbone.View} view
     * @return {App}
     */
    registerView: function(name, view) {
      this._viewMap[name] = view;
      view.app = this;

      if (typeof view.onRegister == 'function') {
        view.onRegister(this);
      }

      return this;
    },

    /**
     * Retrieve a view from the app
     *
     * @param {String} name
     *  Name of the view to retrieve
     * @return {Backbone.View}
     */
    getView: function(name) {
      return this._viewMap[name];
    },

    /**
     * Binds a command class to an event source and event name. The App
     * will create an instance of the command class, and call it's execute()
     * method whenever the eventSource triggers the event. The command's
     * execute() method will receive the arguments provided by the event
     *
     * @param {Function} commandClass
     *  Constructor of a command class. Command classes must implement an
     *  execute() method
     * @param {Object} eventSource
     *  The event source that the command will be bound to
     * @param {String} eventName
     *  The name of the event the command will be bound to
     * @return {App}
     */
    registerCommand: function(commandClass, eventSource, eventName) {
      var app = this;

      eventSource.bind(eventName, function() {
        var command = new commandClass(app);
        command.execute.apply(command, arguments)  
      });

      return this;
    }
  });

  

  piewpiew.application = application;

  return application;
});

define('piewpiew.config', ['piewpiew.core'], function(piewpiew) {

	var config = {};

	config.Config = piewpiew.Class({

    initialize: function(options) {
      options || (options = {});

      if (!options.environment) options.environment = piewpiew.DEVELOPMENT;

      this.getOptions = function() {
        return options;
      }
		},

    setEnvironment: function(environment) {
      this.getOptions()['environment'] = environment;
      return this;
    },

    getEnvironment: function() {
      return this.getOptions().environment;
    },

    get: function(key, defaultValue) {
      var value = null;
      var options = this.getOptions();
      var env = this.getEnvironment();

      // First check currently configured environment
      if (options[env]) {
        value = options[env][key];
      }

      // If we didnt find a value, escalate
      while (null === value && env != piewpiew.PRODUCTION) {
        switch (env) {
          case piewpiew.DEVELOPMENT :
            env = piewpiew.TESTING;
            break;

          case piewpiew.TESTING :
            env = piewpiew.PRODUCTION;
            break;
        }

        if(null != options[env]) {
          value = options[env][key];
        }        
      }

      if (null !== value) {
        return this.resolveValue(value);
      }

      return this.resolveValue(defaultValue);
    },

    resolveValue: function(value) {
      if (typeof value == 'function') {
        return value();
      }
      return value;
    }
	});

	piewpiew.config = config;

	return config;
});