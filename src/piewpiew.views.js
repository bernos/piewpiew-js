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