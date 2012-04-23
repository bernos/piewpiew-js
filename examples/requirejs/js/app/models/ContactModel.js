define(['piewpiew.models'], function(models) {
  return models.Model.extend({
    defaults : {
      photo : 'img/placeholder.png'
    }
  });
});