define(['piewpiew.forms', 'piewpiew.forms.fields'], function(forms, fields) {

  var ContactForm = forms.Form.extend({
    fields: {
      name: new fields.TextField({
        label: "Contact Name",
        required: true
      }),
      address: new fields.TextField({
        label: "Address"
      }),
      tel: new fields.TextField({
        label: "Tel"
      }),
      email: new fields.TextField({
        label: "Email"
      }),
      type: new fields.TextField({
        label: "Type"
      })
    }
  });

  return ContactForm;
});