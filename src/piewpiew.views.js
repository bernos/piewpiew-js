define([
 'piewpiew.core',
 './views/Helpers',
 'piewpiew.views.Region',
 'piewpiew.views.View',
 'piewpiew.views.CollectionView',
 'piewpiew.views.FormView',
 'piewpiew.views.Layout'
],

function(piewpiew, Helpers, Region, View, CollectionView, FormView, Layout) {

  return {
    View: View,
    CollectionView: CollectionView,
    FormView: FormView,
    Region: Region,
    Layout: Layout,
    Helpers: Helpers
  };
});