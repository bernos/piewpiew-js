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