define('piewpiew.views', ['underscore', 'backbone', 'piewpiew.core', 'jquery'], function(_, Backbone, piewpiew, $) {

  var views = {};

  /**
   *  piewpiew.views.View base class
   *  --------------------------------------------------------------------------
   *  Adds external template support to the basic Backbone.View class, as well 
   *  as default implementations for rendering and and app registration.
   */
  views.View = Backbone.View.extend({

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
      return views.template(template, context);
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
          views.TemplateContext(this.templateContext())
        )
      );

      return this;
    }
  });

  /**
   *  piewpiew.views.Layout class
   *  --------------------------------------------------------------------------
   *  Extends the basic piewpiew.views.View class by adding support for regions.
   *  Regions are layout containers which can contain child views. The 
   *  Layout->Region->View strategy allows us to create composite views easily
   */
  views.Layout = views.View.extend({

    /**
     * Creates a region and adds it to the layout.
     *
     * @param {Object} options
     *  Object containing options to be passed to the Region constructor
     * @return {piewpiew.views.Region}
     *  The Region that was created
     */
    addRegion: function(options) {
      var region = new views.Region(options);

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
      views.View.prototype.render.apply(this);

      if (null != this.regions) {
        for (var i in this.regions) {
          this.regions[i].render(this);
        }
      }

      return this;
    }
  });

  /**
   *  piewpiew.views.Region class
   *  --------------------------------------------------------------------------
   *  Regions are simple containers that manage collections of child views
   *  within a Layout instance. A region is associated with a single Layout
   *  instance, and uses a DOM selector in order to attach its managed views to
   *  DOM.
   */
  views.Region = piewpiew.Class({
    
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
  views.template = function(template, context) {
    return _.template(template, context);
  };

  /**
   * Builds a template context object by merging template data with our view helpers
   *
   * @param {object} data
   *  Template data
   * @return {object}
   */
  views.TemplateContext = function(data) {
    return _.extend(data, views.helpers);
  };

  views.CollectionView = views.View.extend({
    initialize: function(options) {
      options || (options = {});

      options = _.extend({}, piewpiew.configValue(this.defaults), options);

      // TODO: options go nowhere ATM

      this.view = options.view;
      this.views = [];

      if (this.collection) {
        this.collection.bind("reset",   this.onCollectionReset,       this);
        this.collection.bind("add",     this.onCollectionItemAdded,   this);
        this.collection.bind("remove",  this.onCollectionItemRemoved, this);
      }
    },

    defaults: function() {
      return {
        view: views.View
      };
    },

    onCollectionReset: function() {
      this.render();
    },

    onCollectionItemAdded: function(model, collection, options) {
      this.addItem(model);
    },

    onCollectionItemRemoved: function(model, collection, options) {
      this.removeItem(model);
    },

    addItem: function(item) {
      var view = new this.view({
        model: item
      });

      this.$el.append(view.render().el);

      this.views.push(view);

      return this;
    },

    removeItem: function(item) {
      for (var v = null, i = 0, m = this.views.length; i < m; i++) {
        v = this.views[i];
        if (v.model == item) {
          this.views.splice(i,1);
          v.remove();
          break;
        }
      }
      return this;
    },

    clear: function() {
      // TODO: Iterate over each this.views and remove each
      for (var v = null, i = 0, m = this.views.length; i < m; i++) {
        v = this.views[i];
        v.remove();
      }
      this.views = [];
    },

    render: function() {
      this.clear();

      if (this.collection) {
        var that = this;

        _.each(this.collection.models, function(item) {
          that.addItem(item);
        }, this);
      }

      return this;
    }
  });
  
  views.FormView = views.View.extend({

    template: function() {
      var buf   = [],
          model = this.model,
          helpers = helpers;


      buf.push('<form class="form-horizontal">');

      if (this.model.id) {
        buf.push('<%= Html.hidden("id", model.id) %>');
      }

      buf.push('<%= Html.hidden("cid", model.cid) %>');

      buf.push('<% _.each(model.fields, function(field, name) { %>');
      buf.push('<div>');

      buf.push('<div class="control-group control-group-for-<%= name %>"><label class="control-label"><%= field.label %></label><div class="controls"><%= Html.formField(model, field) %></div></div>');

      buf.push('</div>');
      buf.push('<% }) %>');

      //buf.push('<%= Html.editorForModel(model) %>');
      buf.push('<input type="submit" value="save"/>');
      buf.push('</form>');

      console.log(buf.join("\n"));

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

      console.log("set",$field.attr('name'), $field.val());

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

  piewpiew.views = views;

  return views;
});