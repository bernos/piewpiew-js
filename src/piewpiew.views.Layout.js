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