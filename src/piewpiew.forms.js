define('piewpiew.forms',
[
   'piewpiew.core',
   'piewpiew.forms.Form',
   'piewpiew.forms.ModelForm',
   'piewpiew.forms.fields'
],

function(piewpiew, Form, ModelForm, fields) {

  piewpiew.forms = {
    Form: Form,
    ModelForm: ModelForm,
    fields: fields
  };
  
  return piewpiew.forms;
});


/*

Notes on refactoring old model and formview

Old formview was dumb with regards to template. Required the Html.editorForModel helper.

Get rid of Html.editorForModel helper, and make the default form template smarter.

Try to avoid template library specific template syntax

All view type functions in piewpiew.models.fields needs to be removed


*/