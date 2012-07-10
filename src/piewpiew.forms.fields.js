define('piewpiew.forms.fields', [
  'piewpiew.forms',
  'piewpiew.forms.fields.Field',
  'piewpiew.forms.fields.TextField'
],

function(forms, Field, TextField) {

  forms.fields = {
    Field: Field,
    TextField: TextField
  };

  return forms.fields;
});