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