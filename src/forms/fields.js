define([
  './fields/Field',
  './fields/TextField',
  './fields/EmailField',
  './fields/PasswordField',
  './fields/SelectList',
  './fields/MultiSelectList'
],

function(Field, TextField, EmailField, PasswordField, SelectList, MultiSelectList) {
  return {
    Field: Field,
    TextField: TextField,
    EmailField: EmailField,
    PasswordField: PasswordField,
    SelectList: SelectList,
    MultiSelectList : MultiSelectList
  };
});