define([
  './Field',
  '../../piewpiew.validators',
  '../../views/Helpers'
],

function(Field, validators, Helpers) {
  return Field.extend({
    render: function(value, attributes) {
      return Helpers.Html.selectList(this.name, this.options, value, true, attributes);
    }
  });
});