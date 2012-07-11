/**
 * validators package
 * --------------------------------------------------------------------------
 */
define([
  'validators/Validator',
  'validators/StringValidator',
  'validators/RangeValidator',
  'validators/RegexValidator',
  'validators/EmailValidator'
],

function(Validator, StringValidator, RangeValidator, RegexValidator, EmailValidator) {
  return {
    Validator       : Validator,
    StringValidator : StringValidator,
    RangeValidator  : RangeValidator,
    RegexValidator  : RegexValidator,
    EmailValidator  : EmailValidator
  };
});