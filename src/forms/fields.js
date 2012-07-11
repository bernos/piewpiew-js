define([
  './fields/Field',
  './fields/TextField',
  './fields/EmailField',
  './fields/PasswordField',
  './fields/SelectList',
  './fields/MultiSelectList',
  './fields/CheckBox'
],

function(Field, TextField, EmailField, PasswordField, SelectList, MultiSelectList, CheckBox) {
  
  return {
    Field: Field,
    TextField: TextField,
    EmailField: EmailField,
    PasswordField: PasswordField,
    SelectList: SelectList,
    MultiSelectList : MultiSelectList,
    CheckBox: CheckBox
  };
});