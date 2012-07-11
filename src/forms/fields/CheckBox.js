define([
  './Field',
  '../../piewpiew.validators',
  '../../views/Helpers'
],

function(Field, validators, Helpers) {
  return Field.extend({
    render: function(value, attributes) {
      // Send the name property as value, and value as checked. This makes the
      // checkbox field behave like a simple boolean switch
      return Helpers.Html.checkbox(this.label, this.name, this.name, value, attributes);
    }
  });
});